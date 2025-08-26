import { Module } from '@nestjs/common';
import { ArticleService } from './services/article.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleRepository } from './repositories/article.repository';

@Module({
  controllers: [],
  providers: [ArticleRepository ,ArticleService],
  exports: [ArticleRepository ,ArticleService],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
})
export class ArticleModule {}
