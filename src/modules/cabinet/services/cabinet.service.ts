import { Injectable } from '@nestjs/common';
import { CabinetEntity } from '../entities/cabinet.entity';
import { AddressService } from 'src/modules/address/services/address.service';
import {
  EnterpriseNameAlreadyExistsException,
  TaxIdNumberDuplicateException,
} from '../errors/cabinet.alreadyexists.error';
import { CabinetNotFoundException } from '../errors/cabinet.notfound.error';
import { UpdateCabinetDto } from '../dtos/cabinet.update.dto';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { CabinetRepository } from '../repositories/cabinet.repository';
import { UploadService } from 'src/shared/uploads/services/upload.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class CabinetService {
  constructor(
    private readonly cabinetRepository: CabinetRepository,
    private readonly addressService: AddressService,
    private readonly currencyService: CurrencyService,
    private readonly activityService: ActivityService,
    private readonly uploadService: UploadService,
  ) {}

  async findOneById(id: number): Promise<CabinetEntity> {
    const cabinet = await (
      await this.cabinetRepository.createQueryBuilder('cabinet')
    )
      .leftJoinAndSelect('cabinet.address', 'address')
      .leftJoinAndSelect('cabinet.currency', 'currency')
      .leftJoinAndSelect('cabinet.activity', 'activity')
      .leftJoinAndSelect('address.country', 'country')
      .where('cabinet.id = :id', { id })
      .getOne();

    if (!cabinet) {
      throw new CabinetNotFoundException();
    }
    return cabinet;
  }
  async findAll(): Promise<CabinetEntity[]> {
    return this.cabinetRepository.findAll();
  }

  async save(
    createCabinetDto: DeepPartial<CabinetEntity>,
  ): Promise<CabinetEntity> {
    await this.activityService.findOneById(createCabinetDto.activityId);
    await this.currencyService.findOneById(createCabinetDto.currencyId);

    const existingCabinetByName = await this.cabinetRepository.findOne({
      where: { enterpriseName: createCabinetDto.enterpriseName },
    });

    if (existingCabinetByName) {
      throw new EnterpriseNameAlreadyExistsException();
    }

    const existingCabinetByTaxId = await this.cabinetRepository.findOne({
      where: { taxIdNumber: createCabinetDto.taxIdNumber },
    });
    if (existingCabinetByTaxId) {
      throw new TaxIdNumberDuplicateException();
    }

    return this.cabinetRepository.save(createCabinetDto);
  }

  async update(
    id: number,
    updateCabinetDto: UpdateCabinetDto,
  ): Promise<CabinetEntity> {
    const cabinet = await this.findOneById(id);
    this.uploadService.delete(cabinet.logoId);
    this.uploadService.delete(cabinet.signatureId);

    let address = await this.addressService.findOneById(cabinet.addressId);
    const activity = await this.activityService.findOneById(
      updateCabinetDto.activityId,
    );
    const currency = await this.currencyService.findOneById(
      updateCabinetDto.currencyId,
    );

    address = await this.addressService.update(cabinet.addressId, {
      ...address,
      ...updateCabinetDto.address,
    });

    return this.cabinetRepository.save({
      ...cabinet,
      ...updateCabinetDto,
      address,
      currency,
      activity,
    });
  }

  async softDelete(id: number): Promise<CabinetEntity> {
    await this.findOneById(id);
    return this.cabinetRepository.softDelete(id);
  }

  async deleteAll() {
    this.cabinetRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.cabinetRepository.getTotalCount();
  }
}
