import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';
import { PaymentRepository } from '../repositories/repository/payment-file.entity';
import { PaymentEntity } from '../repositories/entities/payment.entity';
import { PaymentNotFoundException } from '../errors/payment.notfound.error';
import { ResponsePaymentDto } from '../dtos/payment.response.dto';
import { CreatePaymentDto } from '../dtos/payment.create.dto';
import { UpdatePaymentDto } from '../dtos/payment.update.dto';
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { Transactional } from '@nestjs-cls/transactional';
import { PaymentInvoiceEntryService } from './payment-invoice-entry.service';
import { CurrencyService } from 'src/modules/currency/services/currency.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentInvoiceEntryService: PaymentInvoiceEntryService,
    private readonly invoiceService: InvoiceService,
    private readonly currencyService: CurrencyService,
  ) {}

  async findOneById(id: number): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findOneById(id);
    if (!payment) {
      throw new PaymentNotFoundException();
    }
    return payment;
  }

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponsePaymentDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const payment = await this.paymentRepository.findOne(
      queryOptions as FindOneOptions<PaymentEntity>,
    );
    if (!payment) return null;
    return payment;
  }

  async findAll(query: IQueryObject): Promise<ResponsePaymentDto[]> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    return await this.paymentRepository.findAll(
      queryOptions as FindManyOptions<PaymentEntity>,
    );
  }

  async findAllPaginated(
    query: IQueryObject,
  ): Promise<PageDto<ResponsePaymentDto>> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const count = await this.paymentRepository.getTotalCount({
      where: queryOptions.where,
    });

    const entities = await this.paymentRepository.findAll(
      queryOptions as FindManyOptions<PaymentEntity>,
    );

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: parseInt(query.page),
        take: parseInt(query.limit),
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(createPaymentDto: CreatePaymentDto): Promise<PaymentEntity> {
    const payement = await this.paymentRepository.save(createPaymentDto);
    const currency = await this.currencyService.findOneById(
      payement.currencyId,
    );
    await this.paymentInvoiceEntryService.saveMany(
      createPaymentDto.invoices.map((entry) => ({
        paymentId: payement.id,
        invoiceId: entry.invoiceId,
        amount: entry.amount,
        convertionRate: entry.convertionRate,
        digitsAfterComma: currency.digitAfterComma,
      })),
    );
    return payement;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<PaymentEntity> {
    const existingPayment = await this.findOneById(id);
    return this.paymentRepository.save({
      ...existingPayment,
      ...updatePaymentDto,
    });
  }

  async softDelete(id: number): Promise<PaymentEntity> {
    await this.findOneById(id);
    return this.paymentRepository.softDelete(id);
  }

  async deleteAll() {
    return this.paymentRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.paymentRepository.getTotalCount();
  }
}
