import { Injectable } from '@nestjs/common';
import { DatabaseAbstractRepostitory } from 'src/common/database/repositories/database.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from '../entities/article.entity';

@Injectable()
export class ArticleRepository extends DatabaseAbstractRepostitory<ArticleEntity> {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {
    super(articleRepository);
  }
}
