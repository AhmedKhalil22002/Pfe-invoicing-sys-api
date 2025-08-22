import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepository } from 'src/shared/database/utils/database.repository';
import { TemplateCategoryEntity } from '../entities/template-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';

@Injectable()
export class TemplateCategoryRepository extends DatabaseAbstractRepository<TemplateCategoryEntity> {
  constructor(
    @InjectRepository(TemplateCategoryEntity)
    private readonly templateCategoryRepository: Repository<TemplateCategoryEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(templateCategoryRepository, txHost);
  }
}
