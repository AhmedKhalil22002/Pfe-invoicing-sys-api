import { Injectable } from '@nestjs/common';
import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { UpdatePaymentConditionDto } from '../dtos/payment-condition.update.dto';
import { Not } from 'typeorm';
import { PaymentConditionEntity } from '../repositories/entity/payment-condition.entity';
import { PaymentConditionRepository } from '../repositories/repository/payment-condition.repository';
import { ResponsePaymentConditionDto } from '../dtos/payment-condition.response.dto';
import { PaymentConditionNotFoundException } from '../errors/payment-condition.notfound.error';
import { CreatePaymentConditionDto } from '../dtos/payment-condition.create.dto';
import { PaymentConditionAlreadyExistsException } from '../errors/payment-condition.alreadyexists.error';
import { PaymentConditionRestrictedDeleteException } from '../errors/payment-condition.restricted-delete.error';

@Injectable()
export class PaymentConditionService {
  constructor(
    private readonly paymentConditionRepository: PaymentConditionRepository,
  ) {}

  async findOneById(id: number): Promise<PaymentConditionEntity> {
    const paymentCondition =
      await this.paymentConditionRepository.findOneById(id);
    if (!paymentCondition) {
      throw new PaymentConditionNotFoundException();
    }
    return paymentCondition;
  }

  async findAll(): Promise<PaymentConditionEntity[]> {
    return this.paymentConditionRepository.findAll();
  }

  async findOneByCondition(
    options: QueryOptions<ResponsePaymentConditionDto>,
  ): Promise<PaymentConditionEntity | null> {
    const paymentCondition =
      await this.paymentConditionRepository.findByCondition({
        where: { ...options.filters, deletedAt: null },
      });
    if (!paymentCondition) return null;
    return paymentCondition;
  }

  async findOneByLabel(
    label: string,
  ): Promise<ResponsePaymentConditionDto | null> {
    const paymentCondition = await this.findOneByCondition({
      filters: { label },
    });
    if (!paymentCondition) {
      return null;
    }
    return paymentCondition;
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponsePaymentConditionDto>,
  ): Promise<PageDto<PaymentConditionEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.paymentConditionRepository.getTotalCount({
      where,
    });
    const entities = await this.paymentConditionRepository.findAll({
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
    createPaymentConditionDto: CreatePaymentConditionDto,
  ): Promise<PaymentConditionEntity> {
    const existingPaymentCondition = await this.findOneByLabel(
      createPaymentConditionDto.label,
    );

    if (existingPaymentCondition) {
      throw new PaymentConditionAlreadyExistsException();
    }
    return this.paymentConditionRepository.save(createPaymentConditionDto);
  }

  async saveMany(
    createCountryDto: CreatePaymentConditionDto[],
  ): Promise<PaymentConditionEntity[]> {
    for (const dto of createCountryDto) {
      const existingPaymentCondition = await this.findOneByLabel(dto.label);
      if (existingPaymentCondition) {
        throw new PaymentConditionAlreadyExistsException();
      }
    }
    return this.paymentConditionRepository.saveMany(createCountryDto);
  }

  async update(
    id: number,
    updatePaymentConditionDto: UpdatePaymentConditionDto,
  ): Promise<PaymentConditionEntity> {
    const existingPaymentCondition =
      await this.paymentConditionRepository.findByCondition({
        where: {
          label: updatePaymentConditionDto.label,
          id: Not(id),
        },
      });
    if (existingPaymentCondition) {
      throw new PaymentConditionAlreadyExistsException();
    }
    return this.paymentConditionRepository.save({
      ...existingPaymentCondition,
      ...updatePaymentConditionDto,
    });
  }

  async softDelete(id: number): Promise<PaymentConditionEntity> {
    const paymentCondition =
      await this.paymentConditionRepository.findOneById(id);
    if (paymentCondition.isDeletionRestricted) {
      throw new PaymentConditionRestrictedDeleteException();
    }
    const deletedPaymentCondition =
      await this.paymentConditionRepository.softDelete(id);
    if (!deletedPaymentCondition) {
      throw new PaymentConditionNotFoundException();
    }
    return deletedPaymentCondition;
  }

  async getTotal(): Promise<number> {
    return this.paymentConditionRepository.getTotalCount({});
  }

  async deleteAll() {
    return this.paymentConditionRepository.deleteAll();
  }
}
