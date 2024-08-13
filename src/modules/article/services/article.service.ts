import { Injectable } from '@nestjs/common';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/common/database/dtos/database.page-meta.dto';

import {
  PagingQueryOptions,
  QueryOptions,
} from 'src/common/database/interfaces/database.query-options.interface';
import { buildWhereClause } from 'src/common/database/utils/buildWhereClause';
import { ArticleRepository } from '../repositories/repository/article.repository';
import { ArticleEntity } from '../repositories/entities/article.entity';
import { ArticleNotFoundException } from '../errors/article.notfound.error';
import { ResponseArticleDto } from '../dtos/article.response.dto';
import { CreateArticleDto } from '../dtos/article.create.dto';
import { UpdateArticleDto } from '../dtos/article.update.dto';

@Injectable()
export class ArticleService {
  constructor(private readonly articleRepository: ArticleRepository) {}

  async findOneById(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneById(id);
    if (!article) {
      throw new ArticleNotFoundException();
    }
    return article;
  }

  async findOneByCondition(
    options: QueryOptions<ResponseArticleDto>,
  ): Promise<ArticleEntity | null> {
    const article = await this.articleRepository.findByCondition({
      where: { ...options.filters, deletedAt: null },
    });
    if (!article) return null;
    return article;
  }

  async findAll(): Promise<ArticleEntity[]> {
    return await this.articleRepository.findAll();
  }

  async findAllPaginated(
    options?: PagingQueryOptions<ResponseArticleDto>,
  ): Promise<PageDto<ArticleEntity>> {
    const { filters, strictMatching, sort, pageOptions } = options;
    const where = buildWhereClause(filters, strictMatching);
    const count = await this.articleRepository.getTotalCount({ where });
    const entities = await this.articleRepository.findAll({
      where,
      skip: pageOptions?.page ? (pageOptions.page - 1) * pageOptions.take : 0,
      take: pageOptions?.take || 10,
      order: sort,
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: pageOptions,
      itemCount: count,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async save(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    return this.articleRepository.save(createArticleDto);
  }

  async saveMany(
    createArticleDtos: CreateArticleDto[],
  ): Promise<ArticleEntity[]> {
    return this.articleRepository.saveMany(createArticleDtos);
  }

  async update(
    id: number,
    updateActivityDto: UpdateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findOneById(id);
    return this.articleRepository.save({
      ...article,
      ...updateActivityDto,
    });
  }

  async softDelete(id: number): Promise<ArticleEntity> {
    await this.findOneById(id);
    return this.articleRepository.softDelete(id);
  }

  async deleteAll() {
    return this.articleRepository.deleteAll();
  }

  async getTotal(): Promise<number> {
    return this.articleRepository.getTotalCount();
  }
}
