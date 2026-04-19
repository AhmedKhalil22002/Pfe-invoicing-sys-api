import { Injectable } from '@nestjs/common';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { ArticleService } from 'src/modules/article/services/article.service';
import { ResponseArticleDto } from 'src/modules/article/dtos/article.response.dto';
import { InvoicingCalculationsService } from 'src/shared/calculations/services/invoicing.calculations.service';
import { LineItem } from 'src/shared/calculations/interfaces/line-item.interface';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindOneOptions } from 'typeorm';
import { ArticlePurchaseInvoiceEntryRepository } from '../repositories/article-purchase-invoice-entry.repository';
import { ArticlePurchaseInvoiceEntryTaxService } from './article-purchase-invoice-entry-tax.service';
import { ResponseArticlePurchaseInvoiceEntryDto } from '../dtos/article-purchase-invoice-entry.response.dto';
import { ArticlePurchaseInvoiceEntryEntity } from '../entities/article-purchase-invoice-entry.entity';
import { ArticlePurchaseInvoiceEntryNotFoundException } from '../errors/article-purchase-invoice-entry.notfound.error';
import { CreateArticlePurchaseInvoiceEntryDto } from '../dtos/article-purchase-invoice-entry.create.dto';
import { UpdateArticlePurchaseInvoiceEntryDto } from '../dtos/article-purchase-invoice-entry.update.dto';

@Injectable()
export class ArticlePurchaseInvoiceEntryService {
  constructor(
    private readonly articlePurchaseInvoiceEntryRepository: ArticlePurchaseInvoiceEntryRepository,
    private readonly articlePurchaseInvoiceEntryTaxService: ArticlePurchaseInvoiceEntryTaxService,
    private readonly articleService: ArticleService,
    private readonly taxService: TaxService,
    private readonly calculationsService: InvoicingCalculationsService,
  ) {}

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponseArticlePurchaseInvoiceEntryDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const entry = await this.articlePurchaseInvoiceEntryRepository.findOne(
      queryOptions as FindOneOptions<ArticlePurchaseInvoiceEntryEntity>,
    );
    if (!entry) return null;
    return entry;
  }

  async findOneById(id: number): Promise<ResponseArticlePurchaseInvoiceEntryDto> {
    const entry = await this.articlePurchaseInvoiceEntryRepository.findOneById(id);
    if (!entry) {
      throw new ArticlePurchaseInvoiceEntryNotFoundException();
    }
    return entry;
  }

  async findOneAsLineItem(id: number): Promise<LineItem> {
    const entry = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articlePurchaseInvoiceEntryTaxes',
    });
    const taxes = entry.articlePurchaseInvoiceEntryTaxes
      ? await Promise.all(
          entry.articlePurchaseInvoiceEntryTaxes.map((taxEntry) =>
            this.taxService.findOneById(taxEntry.taxId),
          ),
        )
      : [];
    return {
      quantity: entry.quantity,
      unit_price: entry.unit_price,
      discount: entry.discount,
      discount_type: entry.discount_type,
      taxes: taxes,
    };
  }

  async findManyAsLineItem(ids: number[]): Promise<LineItem[]> {
    const lineItems = await Promise.all(
      ids.map((id) => this.findOneAsLineItem(id)),
    );
    return lineItems;
  }

  async save(
    createArticlePurchaseInvoiceEntryDto: CreateArticlePurchaseInvoiceEntryDto,
  ): Promise<ArticlePurchaseInvoiceEntryEntity> {
    const taxes = createArticlePurchaseInvoiceEntryDto.taxes
      ? await Promise.all(
          createArticlePurchaseInvoiceEntryDto.taxes.map((id) =>
            this.taxService.findOneById(id),
          ),
        )
      : [];

    const article =
      (await this.articleService.findOneByCondition({
        filter: `title||$eq||${createArticlePurchaseInvoiceEntryDto.article.title}`,
      })) ||
      (await this.articleService.save(createArticlePurchaseInvoiceEntryDto.article));

    const lineItem = {
      quantity: createArticlePurchaseInvoiceEntryDto.quantity,
      unit_price: createArticlePurchaseInvoiceEntryDto.unit_price,
      discount: createArticlePurchaseInvoiceEntryDto.discount,
      discount_type: createArticlePurchaseInvoiceEntryDto.discount_type,
      taxes: taxes,
    };

    const entry = await this.articlePurchaseInvoiceEntryRepository.save({
      ...createArticlePurchaseInvoiceEntryDto,
      articleId: article.id,
      article: article,
      subTotal: this.calculationsService.calculateSubTotalForLineItem(lineItem),
      total: this.calculationsService.calculateTotalForLineItem(lineItem),
    });

    await this.articlePurchaseInvoiceEntryTaxService.saveMany(
      taxes.map((tax) => {
        return { taxId: tax.id, articlePurchaseInvoiceEntryId: entry.id };
      }),
    );
    return entry;
  }

  async saveMany(
    createArticlePurchaseInvoiceEntryDtos: CreateArticlePurchaseInvoiceEntryDto[],
  ): Promise<ArticlePurchaseInvoiceEntryEntity[]> {
    const savedEntries = [];
    for (const dto of createArticlePurchaseInvoiceEntryDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async update(
    id: number,
    updateArticlePurchaseInvoiceEntryDto: UpdateArticlePurchaseInvoiceEntryDto,
  ): Promise<ArticlePurchaseInvoiceEntryEntity> {
    //fetch exisiting entry
    const existingEntry =
      await this.articlePurchaseInvoiceEntryRepository.findOne({
        where: { id },
        relations: ['articlePurchaseInvoiceEntryTaxes']
      });
    
    if (!existingEntry) {
      throw new ArticlePurchaseInvoiceEntryNotFoundException();
    }

    await this.articlePurchaseInvoiceEntryTaxService.softDeleteMany(
      existingEntry.articlePurchaseInvoiceEntryTaxes.map((taxEntry) => taxEntry.id),
    );

    //fetch and check the existance of all taxes
    const taxes = updateArticlePurchaseInvoiceEntryDto.taxes
      ? await Promise.all(
          updateArticlePurchaseInvoiceEntryDto.taxes.map((id) =>
            this.taxService.findOneById(id),
          ),
        )
      : [];

    //save and check of articles existance , if a given article doesn't exist by name , it will be created
    let article: ResponseArticleDto;
    try {
      article = await this.articleService.findOneByCondition({
        filter: `title||$eq||${updateArticlePurchaseInvoiceEntryDto.article.title}`,
      });
    } catch (error) {
      article = await this.articleService.save(
        updateArticlePurchaseInvoiceEntryDto.article,
      );
    }

    const lineItem = {
      quantity: updateArticlePurchaseInvoiceEntryDto.quantity,
      unit_price: updateArticlePurchaseInvoiceEntryDto.unit_price,
      discount: updateArticlePurchaseInvoiceEntryDto.discount,
      discount_type: updateArticlePurchaseInvoiceEntryDto.discount_type,
      taxes: taxes,
    };

    //update the entry with the new data and save it
    const entry = await this.articlePurchaseInvoiceEntryRepository.save({
      ...existingEntry,
      ...updateArticlePurchaseInvoiceEntryDto,
      articleId: article.id,
      article: article,
      subTotal: this.calculationsService.calculateSubTotalForLineItem(lineItem),
      total: this.calculationsService.calculateTotalForLineItem(lineItem),
    });
    //save the new tax entries for the article entry
    await this.articlePurchaseInvoiceEntryTaxService.saveMany(
      taxes.map((tax) => {
        return { taxId: tax.id, articlePurchaseInvoiceEntryId: entry.id };
      }),
    );
    return entry;
  }

  async duplicate(
    id: number,
    purchaseInvoiceId: number,
  ): Promise<ArticlePurchaseInvoiceEntryEntity> {
    // Fetch the existing entry
    const existingEntry = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articlePurchaseInvoiceEntryTaxes',
    });

    // Duplicate the taxes associated with this entry
    const duplicatedTaxes = existingEntry.articlePurchaseInvoiceEntryTaxes.map(
      (taxEntry) => ({ taxId: taxEntry.taxId }),
    );

    // Create the duplicated entry
    const duplicatedEntry = {
      ...existingEntry,
      purchaseInvoiceId: purchaseInvoiceId,
      id: undefined,
      articlePurchaseInvoiceEntryTaxes: duplicatedTaxes, // Attach duplicated taxes
      createdAt: undefined,
      updatedAt: undefined,
    };

    // Save the duplicated entry
    const newEntry =
      await this.articlePurchaseInvoiceEntryRepository.save(duplicatedEntry);

    // Save the new tax entries for the duplicated entry
    await this.articlePurchaseInvoiceEntryTaxService.saveMany(
      duplicatedTaxes.map((tax) => ({
        taxId: tax.taxId,
        articlePurchaseInvoiceEntryId: newEntry.id,
      })),
    );

    return newEntry;
  }

  async duplicateMany(
    ids: number[],
    purchaseInvoiceId: number,
  ): Promise<ArticlePurchaseInvoiceEntryEntity[]> {
    const duplicatedEntries = [];
    for (const id of ids) {
      const duplicatedEntry = await this.duplicate(id, purchaseInvoiceId);
      duplicatedEntries.push(duplicatedEntry);
    }
    return duplicatedEntries;
  }

  async softDelete(id: number): Promise<ArticlePurchaseInvoiceEntryEntity> {
    const entry = await this.articlePurchaseInvoiceEntryRepository.findOne({
      where: { id, deletedAt: null },
      relations: { articlePurchaseInvoiceEntryTaxes: true },
    });
    await this.articlePurchaseInvoiceEntryTaxService.softDeleteMany(
      entry.articlePurchaseInvoiceEntryTaxes.map((taxEntry) => taxEntry.id),
    );
    return this.articlePurchaseInvoiceEntryRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<ArticlePurchaseInvoiceEntryEntity[]> {
    const entries = await Promise.all(
      ids.map(async (id) => this.softDelete(id)),
    );
    return entries;
  }
}
