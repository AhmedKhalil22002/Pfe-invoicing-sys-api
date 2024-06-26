import { Injectable } from '@nestjs/common';
import { PaymentMethodRepository } from '../repositories/repository/payment-method.repository';
import { PaymentMethodEntity } from '../repositories/entity/payment-method.entity';
import { PaymentMethodNotFoundException } from '../errors/payment-method.notfound.error';
import { CreatePaymentMethodDto } from '../dtos/payment-method.create.dto';
import { PaymentMethodAlreadyExistsException } from '../errors/payment-method.alreadyexists.error';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { ResponsePaymentMethodDto } from '../dtos/payment-method.response.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { UpdatePaymentMethodDto } from '../dtos/payment-method.update.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    private readonly paymentMethodRepository: PaymentMethodRepository,
  ) {}

  async findOneById(id: number): Promise<PaymentMethodEntity> {
    const paymentMethod = await this.paymentMethodRepository.findOneById(id);
    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }
    return paymentMethod;
  }

  async findAll(): Promise<PaymentMethodEntity[]> {
    return this.paymentMethodRepository.findAll();
  }

  async findOneByCondition(
    options: QueryOptions<ResponsePaymentMethodDto>,
  ): Promise<PaymentMethodEntity | null> {
    const paymentMethod = await this.paymentMethodRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!paymentMethod) return null;
    return paymentMethod;
  }

  async findOneByLabel(
    label: string,
  ): Promise<ResponsePaymentMethodDto | null> {
    const paymentMethod = await this.findOneByCondition({
      filters: { label },
    });
    if (!paymentMethod) {
      return null;
    }
    return paymentMethod;
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponsePaymentMethodDto>,
  ): Promise<PageDto<PaymentMethodEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.paymentMethodRepository.getTotalCount({ where });
    const entities = await this.paymentMethodRepository.findAll({
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async save(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const existingPaymentMethod = await this.findOneByLabel(
      createPaymentMethodDto.label,
    );

    if (existingPaymentMethod) {
      throw new PaymentMethodAlreadyExistsException();
    }
    return this.paymentMethodRepository.save(createPaymentMethodDto);
  }

  async saveMany(
    createCountryDto: CreatePaymentMethodDto[],
  ): Promise<PaymentMethodEntity[]> {
    for (const dto of createCountryDto) {
      const existingPaymentMethod = await this.findOneByLabel(dto.label);
      if (existingPaymentMethod) {
        throw new PaymentMethodAlreadyExistsException();
      }
    }
    return this.paymentMethodRepository.saveMany(createCountryDto);
  }

  async update(
    id: number,
    updatePaymentMethodDto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const existingPaymentMethod = await this.findOneByLabel(
      updatePaymentMethodDto.label,
    );
    if (existingPaymentMethod) {
      throw new PaymentMethodAlreadyExistsException();
    }
    return this.paymentMethodRepository.save({
      ...existingPaymentMethod,
      ...existingPaymentMethod,
    });
  }

  async softDelete(id: number): Promise<PaymentMethodEntity> {
    const paymentMethod = await this.paymentMethodRepository.softDelete(id);
    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }
    return paymentMethod;
  }

  async getTotal(): Promise<number> {
    return this.paymentMethodRepository.getTotalCount({});
  }

  async deleteAll() {
    return this.paymentMethodRepository.deleteAll();
  }
}
