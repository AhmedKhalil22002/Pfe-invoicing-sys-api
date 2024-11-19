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
import { InvoiceService } from 'src/modules/invoice/services/invoice.service';
import { Transactional } from '@nestjs-cls/transactional';
import { INVOICE_STATUS } from 'src/modules/invoice/enums/invoice-status.enum';
import { ciel } from 'src/utils/number.utils';

@Injectable()
export class PaymentInvoiceEntryService {
  constructor(
    private readonly paymentInvoiceEntryRepository: PaymentInvoiceEntryRepository,
    private readonly invoiceService: InvoiceService,
  ) {}

  async findOneByCondition(
    query: IQueryObject,
  ): Promise<PaymentInvoiceEntryEntity | null> {
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

  @Transactional()
  async save(
    createPaymentInvoiceEntryDto: CreatePaymentInvoiceEntryDto,
  ): Promise<PaymentInvoiceEntryEntity> {
    // Fetch the invoice
    const existingInvoice = await this.invoiceService.findOneById(
      createPaymentInvoiceEntryDto.invoiceId,
    );

    // Calculate the total amount paid
    const totalAmountPaid = ciel(
      existingInvoice.amountPaid + createPaymentInvoiceEntryDto.amount,
    );

    // determine the new invoice status
    const newInvoiceStatus =
      totalAmountPaid === 0
        ? INVOICE_STATUS.Unpaid
        : totalAmountPaid === existingInvoice.total
          ? INVOICE_STATUS.Paid
          : INVOICE_STATUS.PartiallyPaid;

    await this.invoiceService.updateFields(existingInvoice.id, {
      amountPaid: totalAmountPaid,
      status: newInvoiceStatus,
    });

    return this.paymentInvoiceEntryRepository.save(
      createPaymentInvoiceEntryDto,
    );
  }

  @Transactional()
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

  @Transactional()
  async softDelete(id: number): Promise<PaymentInvoiceEntryEntity> {
    const existingEntry = await this.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: 'payment',
    });
    const existingInvoice = await this.invoiceService.findOneByCondition({
      filter: `id||$eq||${existingEntry.invoiceId}`,
      join: 'currency',
    });
    // Calculate the total amount paid
    const totalAmountPaid = ciel(
      existingInvoice.amountPaid - existingEntry.amount,
    );
    // determine the new invoice status
    const newInvoiceStatus =
      totalAmountPaid === 0
        ? INVOICE_STATUS.Unpaid
        : INVOICE_STATUS.PartiallyPaid;

    await this.invoiceService.updateFields(existingInvoice.id, {
      amountPaid: totalAmountPaid,
      status: newInvoiceStatus,
    });
    return this.paymentInvoiceEntryRepository.softDelete(id);
  }

  @Transactional()
  async softDeleteMany(ids: number[]) {
    ids.forEach(async (id) => {
      await this.softDelete(id);
    });
  }
}
