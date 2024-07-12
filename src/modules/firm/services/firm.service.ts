import { Injectable } from '@nestjs/common';
import { FirmRepository } from '../repositories/repository/firm.repository';
import { FirmEntity } from '../repositories/entities/firm.entity';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';
import { CreateFirmDto } from '../dtos/firm.create.dto';
import { FirmNotFoundException } from '../errors/firm.notfound.error';
import { UpdateFirmDto } from '../dtos/firm.update.dto';
import { QueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PagingQueryOptions } from 'src/common/database/interfaces/database.query-options.interface';
import { ResponseFirmDto } from '../dtos/firm.response.dto';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { InterlocutorService } from 'src/modules/interlocutor/services/interlocutor.service';
import {
  FirmAlreadyExistsException,
  TaxIdNumberDuplicateException,
} from '../errors/firm.alreadyexists.error';
import { AddressService } from 'src/modules/address/services/address.service';
import { CurrencyService } from 'src/modules/currency/services/currency.service';
import { ActivityService } from 'src/modules/activity/services/activity.service';
import { PaymentConditionService } from 'src/modules/payment-condition/services/payment-condition.service';
import {
  arrayToTrueObject,
  getSelectAndRelations,
} from 'src/common/database/utils/selectAndRelations';

@Injectable()
export class FirmService {
  constructor(
    private readonly firmRepository: FirmRepository,
    private readonly activityService: ActivityService,
    private readonly currencyService: CurrencyService,
    private readonly addressService: AddressService,
    private readonly paymentConditionService: PaymentConditionService,
    private readonly interlocutorService: InterlocutorService,
  ) {}

  async findOneById(id: number): Promise<FirmEntity> {
    const firm = await this.firmRepository.findByCondition({
      where: { id },
      relations: arrayToTrueObject(
        await this.firmRepository.getRelatedEntityNames(),
      ),
    });
    if (!firm) {
      throw new FirmNotFoundException();
    }
    return firm;
  }

  async findOneByCondition(
    options: QueryOptionsDto<FirmEntity>,
  ): Promise<FirmEntity | null> {
    const { select, relations } = getSelectAndRelations(
      await this.firmRepository.getRelatedEntityNames(),
      options,
    );
    const where = buildWhereClause<FirmEntity>(
      options.filters,
      options.strictMatching,
    );
    const firm = await this.firmRepository.findByCondition({
      select,
      relations,
      where: { ...where, deletedAt: null },
    });
    if (!firm) return null;
    return firm;
  }

  async findAll(
    options: QueryOptionsDto<ResponseFirmDto>,
  ): Promise<FirmEntity[]> {
    const { select, relations } = getSelectAndRelations(
      await this.firmRepository.getRelatedEntityNames(),
      options,
    );
    return await this.firmRepository.findAll({ select, relations });
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseFirmDto>,
  ): Promise<PageDto<ResponseFirmDto>> {
    const { filters, strictMatching, sort, pageOptions } = options || {};

    const where = buildWhereClause<ResponseFirmDto>(filters, strictMatching);
    const count = await this.firmRepository.getTotalCount({ where });

    const { select, relations } = getSelectAndRelations(
      await this.firmRepository.getRelatedEntityNames(),
      options,
    );

    const entities = await this.firmRepository.findAll({
      select,
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations,
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(createFirmDto: CreateFirmDto): Promise<FirmEntity> {
    let firm = await this.firmRepository.findByCondition({
      where: { name: createFirmDto.name },
    });
    if (firm) {
      throw new FirmAlreadyExistsException();
    }

    firm = await this.firmRepository.findByCondition({
      where: { taxIdNumber: createFirmDto.taxIdNumber },
    });

    if (firm) {
      throw new TaxIdNumberDuplicateException();
    }

    const interlocutor = await this.interlocutorService.save(
      createFirmDto.mainInterlocutor,
    );
    const invoicingAddress = await this.addressService.save(
      createFirmDto.invoicingAddress,
    );
    const deliveryAddress = await this.addressService.save(
      createFirmDto.deliveryAddress,
    );
    return this.firmRepository.save({
      ...createFirmDto,
      invoicingAddressId: invoicingAddress.id,
      deliveryAddressId: deliveryAddress.id,
      mainInterlocutorId: interlocutor.id,
    });
  }

  async saveMany(createFirmDtos: CreateFirmDto[]): Promise<FirmEntity[]> {
    let existingFirm: FirmEntity;
    for (const dto of createFirmDtos) {
      existingFirm = await this.firmRepository.findByCondition({
        where: { name: dto.name },
      });
      if (existingFirm) {
        throw new FirmAlreadyExistsException();
      }
      existingFirm = await this.firmRepository.findByCondition({
        where: { taxIdNumber: dto.taxIdNumber },
      });
      if (existingFirm) {
        throw new TaxIdNumberDuplicateException();
      }
      await this.interlocutorService.save(dto.mainInterlocutor);
    }
    return this.firmRepository.saveMany(createFirmDtos);
  }

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<FirmEntity> {
    const firm = await this.firmRepository.findByCondition({
      where: { taxIdNumber: updateFirmDto.taxIdNumber },
    });

    if (firm) {
      throw new TaxIdNumberDuplicateException();
    }

    const existingFirm = await this.findOneById(id);

    const interlocutor = await this.interlocutorService.findOneById(
      existingFirm.mainInterlocutorId,
    );

    const invoicingAddress = await this.addressService.findOneById(
      existingFirm.invoicingAddressId,
    );
    const deliveryAddress = await this.addressService.findOneById(
      existingFirm.deliveryAddressId,
    );

    await this.activityService.findOneById(updateFirmDto.activityId);
    await this.currencyService.findOneById(updateFirmDto.currencyId);
    await this.paymentConditionService.findOneById(
      updateFirmDto.paymentConditionId,
    );

    this.interlocutorService.update(existingFirm.mainInterlocutorId, {
      ...interlocutor,
      ...updateFirmDto.mainInterlocutor,
    });

    this.addressService.update(existingFirm.invoicingAddressId, {
      ...invoicingAddress,
      ...updateFirmDto.invoicingAddress,
    });
    this.addressService.update(existingFirm.deliveryAddressId, {
      ...deliveryAddress,
      ...updateFirmDto.deliveryAddress,
    });

    return this.firmRepository.save({
      ...existingFirm,
      ...updateFirmDto,
    });
  }

  async softDelete(id: number): Promise<FirmEntity> {
    const firm = await this.findOneById(id);
    this.addressService.softDelete(firm.invoicingAddressId);
    this.addressService.softDelete(firm.deliveryAddressId);
    return this.firmRepository.softDelete(id);
  }

  async deleteAll() {
    return this.firmRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.firmRepository.getTotalCount({});
  }
}
