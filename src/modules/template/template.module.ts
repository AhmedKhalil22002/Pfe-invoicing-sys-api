import { Module } from '@nestjs/common';
import { TemplateCategoryService } from './services/template-category.service';
import { TemplateRepositoryModule } from './repositories/template.repository.module';

@Module({
  controllers: [],
  providers: [TemplateCategoryService],
  exports: [TemplateCategoryService],
  imports: [TemplateRepositoryModule],
})
export class TemplateModule {}
