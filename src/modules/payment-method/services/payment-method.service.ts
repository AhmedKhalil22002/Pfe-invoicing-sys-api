import { Injectable } from '@nestjs/common';
import { PaymentMethodRepository } from '../repositories/repository/payment-method.repository';
import { PaymentMethodEntity } from '../repositories/entity/payment-method.entity';
import { PaymentMethodNotFoundException } from '../errors/payment-method.notfound.error';
import { CreatePaymentMethodDto } from '../dtos/payment-method.create.dto';
import { PaymentMethodAlreadyExistsException } from '../errors/payment-method.alreadyexists.error';

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

  async save(
    createPaymentMethodDto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodEntity> {
    const existingCountry = await this.paymentMethodRepository.findByCondition({
      where: { label: createPaymentMethodDto.label },
    });
    if (existingCountry) {
      throw new PaymentMethodAlreadyExistsException();
    }
    return this.paymentMethodRepository.save(createPaymentMethodDto);
  }

  async saveMany(
    createCountryDto: CreatePaymentMethodDto[],
  ): Promise<PaymentMethodEntity[]> {
    for (const dto of createCountryDto) {
      const existingPaymentMethod =
        await this.paymentMethodRepository.findByCondition({
          where: { label: dto.label },
        });
      if (existingPaymentMethod) {
        throw new PaymentMethodAlreadyExistsException();
      }
    }
    return this.paymentMethodRepository.saveMany(createCountryDto);
  }

  async softDelete(id: number): Promise<PaymentMethodEntity> {
    const country = await this.paymentMethodRepository.softDelete(id);
    if (!country) {
      throw new PaymentMethodNotFoundException();
    }
    return country;
  }

  async getTotal(): Promise<number> {
    return this.paymentMethodRepository.getTotalCount({});
  }

  async deleteAll() {
    return this.paymentMethodRepository.deleteAll();
  }
}
