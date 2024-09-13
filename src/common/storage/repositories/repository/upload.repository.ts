import { Repository } from 'typeorm';
import { DatabaseAbstractRepostitory } from 'src/common/database/utils/database.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadEntity } from '../entities/upload.entity';

@Injectable()
export class UploadRepository extends DatabaseAbstractRepostitory<UploadEntity> {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepository: Repository<UploadEntity>,
  ) {
    super(uploadRepository);
  }
}
