import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateCategoryRepository } from './repository/template-category.repository';
import { TemplateCategoryEntity } from './entities/template-category.entity';

@Module({
  controllers: [],
  providers: [TemplateCategoryRepository],
  exports: [TemplateCategoryRepository],
  imports: [TypeOrmModule.forFeature([TemplateCategoryEntity])],
})
export class TemplateRepositoryModule {}
