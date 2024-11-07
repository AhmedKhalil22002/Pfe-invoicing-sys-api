import { Injectable } from '@nestjs/common';
import { PaymentInvoiceEntryRepository } from '../repositories/repository/payment-invoice-entry.entity';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { ResponsePaymentInvoiceEntryDto } from '../dtos/payment-invoice-entry.response.dto';
import { QueryBuilder } from 'src/common/database/utils/database-query-builder';
import { FindOneOptions } from 'typeorm';
import { PaymentInvoiceEntryEntity } from '../repositories/entities/payment-invoice-entry.entity';
import { PaymentInvoiceEntryNotFoundException } from '../errors/payment-invoice-entry.notfound.error';
import { CreatePaymentInvoiceEntryDto } from '../dtos/payment-invoice-entry.create.dto';
import { UpdatePaymentInvoiceEntryDto } from '../dtos/payment-invoice-entry.update.dto';

@Injectable()
export class PaymentInvoiceEntryService {
  constructor(
    private readonly paymentInvoiceEntryRepository: PaymentInvoiceEntryRepository,
  ) {}

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<ResponsePaymentInvoiceEntryDto | null> {
    const queryBuilder = new QueryBuilder();
    const queryOptions = queryBuilder.build(query);
    const entry = await this.paymentInvoiceEntryRepository.findOne(
      queryOptions as FindOneOptions<PaymentInvoiceEntryEntity>,
    );
    if (!entry) return null;
    return entry;
  }

  async findOneById(id: number): Promise<ResponsePaymentInvoiceEntryDto> {
    const entry = await this.paymentInvoiceEntryRepository.findOneById(id);
    if (!entry) {
      throw new PaymentInvoiceEntryNotFoundException();
    }
    return entry;
  }

  async save(
    createPaymentInvoiceEntryDto: CreatePaymentInvoiceEntryDto,
  ): Promise<PaymentInvoiceEntryEntity> {
    return this.paymentInvoiceEntryRepository.save(
      createPaymentInvoiceEntryDto,
    );
  }

  async saveMany(
    createPaymentInvoiceEntryDtos: CreatePaymentInvoiceEntryDto[],
  ): Promise<PaymentInvoiceEntryEntity[]> {
    const savedEntries = [];
    for (const dto of createPaymentInvoiceEntryDtos) {
      const savedEntry = await this.save(dto);
      savedEntries.push(savedEntry);
    }
    return savedEntries;
  }

  async update(
    id: number,
    updatePaymentInvoiceEntryDtos: UpdatePaymentInvoiceEntryDto,
  ): Promise<PaymentInvoiceEntryEntity> {
    const existingEntry = await this.findOneById(id);
    return this.paymentInvoiceEntryRepository.save({
      ...existingEntry,
      ...updatePaymentInvoiceEntryDtos,
    });
  }

  async softDelete(id: number): Promise<PaymentInvoiceEntryEntity> {
    await this.findOneById(id);
    return this.paymentInvoiceEntryRepository.softDelete(id);
  }

  async softDeleteMany(ids: number[]) {
    ids.forEach(async (id) => {
      await this.softDelete(id);
    });
  }
}
