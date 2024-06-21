import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity';

@Injectable()
export class AddressRepository extends DatabaseAbstractRepostitory<AddressEntity> {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
  ) {
    super(addressRepository);
  }
}
