import { Injectable } from '@nestjs/common';
import { ArticlePurchaseQuotationEntryEntity } from '../entities/article-purchase-quotation-entry.entity';
import { CreateArticlePurchaseQuotationEntryDto } from '../dtos/article-purchase-quotation-entry.create.dto';
import { TaxService } from 'src/modules/tax/services/tax.service';
import { ArticleService } from 'src/modules/article/services/article.service';
import { ResponseArticleDto } from 'src/modules/article/dtos/article.response.dto';
import { UpdateArticlePurchaseQuotationEntryDto } from '../dtos/article-purchase-quotation-entry.update.dto';
import { InvoicingCalculationsService } from 'src/shared/calculations/services/invoicing.calculations.service';
import { ResponseArticlePurchaseQuotationEntryDto } from '../dtos/article-purchase-quotation-entry.response.dto';
import { ArticlePurchaseQuotationEntryRepository } from '../repositories/article-purchase-quotation-entry.repository';
import { ArticlePurchaseQuotationEntryTaxService } from './article-purchase-quotation-entry-tax.service';
import { ArticlePurchaseQuotationEntryNotFoundException } from '../errors/article-purchase-quotation-entry.notfound.error';
import { LineItem } from 'src/shared/calculations/interfaces/line-item.interface';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { FindOneOptions } from 'typeorm';

@Injectable()
export class ArticlePurchaseQuotationEntryService {
  constructor(
    private readonly articlePurchaseQuotationEntryRepository: ArticlePurchaseQuotationEntryRepository,
    private readonly articlePurchaseQuotationEntryTaxService: ArticlePurchaseQuotationEntryTaxService,
    private readonly articleService: ArticleService,
    private readonly taxService: TaxService,
    private readonly calculationsService: InvoicingCalculationsService,
  ) {}

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponseArticlePurchaseQuotationEntryDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const entry = await this.articlePurchaseQuotationEntryRepository.findOne(
      queryOptions as FindOneOptions<ArticlePurchaseQuotationEntryEntity>,
    );
    if (!entry) return null;
    return entry;
  }

  async findOneById(id: number): Promise<ResponseArticlePurchaseQuotationEntryDto> {
    const entry = await this.articlePurchaseQuotationEntryRepository.findOneById(id);
    if (!entry) {
      throw new ArticlePurchaseQuotationEntryNotFoundException();
    }
    return entry;
  }

  async findOneAsLineItem(id: number): Promise<LineItem> {
    const entry = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articlePurchaseQuotationEntryTaxes',
    });
    const taxes = entry.articlePurchaseQuotationEntryTaxes
      ? await Promise.all(
          entry.articlePurchaseQuotationEntryTaxes.map((taxEntry) =>
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
    createArticlePurchaseQuotationEntryDto: CreateArticlePurchaseQuotationEntryDto,
  ): Promise<ArticlePurchaseQuotationEntryEntity> {
    const taxes = createArticlePurchaseQuotationEntryDto.taxes
      ? await Promise.all(
          createArticlePurchaseQuotationEntryDto.taxes.map((id) =>
            this.taxService.findOneById(id),
          ),
        )
      : [];

    const article =
      (await this.articleService.findOneByCondition({
        filter: `title||$eq||${createArticlePurchaseQuotationEntryDto.article.title}`,
      })) ||
      (await this.articleService.save(createArticlePurchaseQuotationEntryDto.article));

    const lineItem = {
      quantity: createArticlePurchaseQuotationEntryDto.quantity,
      unit_price: createArticlePurchaseQuotationEntryDto.unit_price,
      discount: createArticlePurchaseQuotationEntryDto.discount,
      discount_type: createArticlePurchaseQuotationEntryDto.discount_type,
      taxes: taxes,
    };

    const entry = await this.articlePurchaseQuotationEntryRepository.save({
      ...createArticlePurchaseQuotationEntryDto,
      articleId: article.id,
      article: article,
      subTotal: this.calculationsService.calculateSubTotalForLineItem(lineItem),
      total: this.calculationsService.calculateTotalForLineItem(lineItem),
    });

    await this.articlePurchaseQuotationEntryTaxService.saveMany(
      taxes.map((tax) => {
        return { taxId: tax.id, articlePurchaseQuotationEntryId: entry.id };
      }),
    );
    return entry;
  }

  async saveMany(
    createArticlePurchaseQuotationEntryDtos: CreateArticlePurchaseQuotationEntryDto[],
  ): Promise<ArticlePurchaseQuotationEntryEntity[]> {
    const savedEntries = [];
    for (const dto of createArticlePurchaseQuotationEntryDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async update(
    id: number,
    updateArticlePurchaseQuotationEntryDto: UpdateArticlePurchaseQuotationEntryDto,
  ): Promise<ArticlePurchaseQuotationEntryEntity> {
    //fetch exisiting entry
    const existingEntry =
      await this.articlePurchaseQuotationEntryRepository.findOneById(id);
    this.articlePurchaseQuotationEntryTaxService.softDeleteMany(
      existingEntry.articlePurchaseQuotationEntryTaxes.map((taxEntry) => taxEntry.id),
    );

    //fetch and check the existance of all taxes
    const taxes = updateArticlePurchaseQuotationEntryDto.taxes
      ? await Promise.all(
          updateArticlePurchaseQuotationEntryDto.taxes.map((id) =>
            this.taxService.findOneById(id),
          ),
        )
      : [];

    //delete all existing taxes and rebuild
    for (const taxEntry of existingEntry.articlePurchaseQuotationEntryTaxes) {
      this.articlePurchaseQuotationEntryTaxService.softDelete(taxEntry.id);
    }

    //save and check of articles existance , if a given article doesn't exist by name , it will be created
    let article: ResponseArticleDto;
    try {
      article = await this.articleService.findOneByCondition({
        filter: `title||$eq||${updateArticlePurchaseQuotationEntryDto.article.title}`,
      });
    } catch (error) {
      article = await this.articleService.save(
        updateArticlePurchaseQuotationEntryDto.article,
      );
    }

    const lineItem = {
      quantity: updateArticlePurchaseQuotationEntryDto.quantity,
      unit_price: updateArticlePurchaseQuotationEntryDto.unit_price,
      discount: updateArticlePurchaseQuotationEntryDto.discount,
      discount_type: updateArticlePurchaseQuotationEntryDto.discount_type,
      taxes: taxes,
    };

    //update the entry with the new data and save it
    const entry = await this.articlePurchaseQuotationEntryRepository.save({
      ...existingEntry,
      ...updateArticlePurchaseQuotationEntryDto,
      articleId: article.id,
      article: article,
      subTotal: this.calculationsService.calculateSubTotalForLineItem(lineItem),
      total: this.calculationsService.calculateTotalForLineItem(lineItem),
    });
    //save the new tax entries for the article entry
    await this.articlePurchaseQuotationEntryTaxService.saveMany(
      taxes.map((tax) => {
        return { taxId: tax.id, articlePurchaseQuotationEntryId: entry.id };
      }),
    );
    return entry;
  }

  async duplicate(
    id: number,
    purchaseQuotationId: number,
  ): Promise<ArticlePurchaseQuotationEntryEntity> {
    // Fetch the existing entry
    const existingEntry = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'articlePurchaseQuotationEntryTaxes',
    });

    // Duplicate the taxes associated with this entry
    const duplicatedTaxes = existingEntry.articlePurchaseQuotationEntryTaxes.map(
      (taxEntry) => ({ taxId: taxEntry.taxId }),
    );

    // Create the duplicated entry
    const duplicatedEntry = {
      ...existingEntry,
      purchaseQuotationId: purchaseQuotationId,
      id: undefined,
      articlePurchaseQuotationEntryTaxes: duplicatedTaxes, // Attach duplicated taxes
      createdAt: undefined,
      updatedAt: undefined,
    };

    // Save the duplicated entry
    const newEntry =
      await this.articlePurchaseQuotationEntryRepository.save(duplicatedEntry);

    // Save the new tax entries for the duplicated entry
    await this.articlePurchaseQuotationEntryTaxService.saveMany(
      duplicatedTaxes.map((tax) => ({
        taxId: tax.taxId,
        articlePurchaseQuotationEntryId: newEntry.id,
      })),
    );

    return newEntry;
  }

  async duplicateMany(
    ids: number[],
    purchaseQuotationId: number,
  ): Promise<ArticlePurchaseQuotationEntryEntity[]> {
    const duplicatedEntries = [];
    for (const id of ids) {
      const duplicatedEntry = await this.duplicate(id, purchaseQuotationId);
      duplicatedEntries.push(duplicatedEntry);
    }
    return duplicatedEntries;
  }

  async softDelete(id: number): Promise<ArticlePurchaseQuotationEntryEntity> {
    const entry = await this.articlePurchaseQuotationEntryRepository.findOne({
      where: { id, deletedAt: null },
      relations: { articlePurchaseQuotationEntryTaxes: true },
    });
    await this.articlePurchaseQuotationEntryTaxService.softDeleteMany(
      entry.articlePurchaseQuotationEntryTaxes.map((taxEntry) => taxEntry.id),
    );
    return this.articlePurchaseQuotationEntryRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]): Promise<ArticlePurchaseQuotationEntryEntity[]> {
    const entries = await Promise.all(
      ids.map(async (id) => this.softDelete(id)),
    );
    return entries;
  }
}
