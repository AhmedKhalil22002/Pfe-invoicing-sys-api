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
    const firm = await this.firmRepository.findOneById(id);
    if (!firm) {
      throw new FirmNotFoundException();
    }
    return firm;
  }

  async findOneByCondition(
    options: QueryOptionsDto<CreateFirmDto>,
  ): Promise<FirmEntity | null> {
    const firm = await this.firmRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!firm) return null;
    return firm;
  }

  async findAll(): Promise<FirmEntity[]> {
    return await this.firmRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseFirmDto>,
  ): Promise<PageDto<ResponseFirmDto>> {
    const { filters, strictMatching, sort, pageOptions } = options || {};

    const where = buildWhereClause(filters, strictMatching);

    const count = await this.firmRepository.getTotalCount({ where });
    const entities = await this.firmRepository.findAll({
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
      relations: {
        mainInterlocutor: true,
        currency: true,
        invoicingAddress: true,
        deliveryAddress: true,
        activity: true,
        paymentCondition: true,
      },
    });

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async save(createFirmDto: CreateFirmDto): Promise<FirmEntity> {
    console.log('save', createFirmDto);
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

  async update(id: number, updateFirmDto: UpdateFirmDto): Promise<FirmEntity> {
    const firm = await this.findOneById(id);

    const interlocutor = await this.interlocutorService.findOneById(
      firm.mainInterlocutorId,
    );

    const invoicingAddress = await this.addressService.findOneById(
      firm.invoicingAddressId,
    );
    const deliveryAddress = await this.addressService.findOneById(
      firm.deliveryAddressId,
    );

    await this.activityService.findOneById(updateFirmDto.activityId);
    await this.currencyService.findOneById(updateFirmDto.currencyId);
    await this.paymentConditionService.findOneById(
      updateFirmDto.paymentConditionId,
    );

    this.interlocutorService.update(firm.mainInterlocutorId, {
      ...interlocutor,
      ...updateFirmDto.mainInterlocutor,
    });

    this.addressService.update(firm.invoicingAddressId, {
      ...invoicingAddress,
      ...updateFirmDto.invoicingAddress,
    });
    this.addressService.update(firm.deliveryAddressId, {
      ...deliveryAddress,
      ...updateFirmDto.deliveryAddress,
    });

    return this.firmRepository.save({
      ...firm,
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
