import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';
import { DefaultConditionService } from '../services/default-condition.service';
import { ResponseDefaultConditionDto } from '../dtos/default-condition.response.dto';
import { CreateDefaultConditionDto } from '../dtos/default-condition.create.dto';
import { UpdateDefaultConditionDto } from '../dtos/default-condition.update.dto';

@ApiTags('default-condition')
@Controller({
  version: '1',
  path: '/default-condition',
})
export class DefaultConditionController {
  constructor(
    private readonly defaultConditionService: DefaultConditionService,
  ) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseDefaultConditionDto[]> {
    return await this.defaultConditionService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseDefaultConditionDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseDefaultConditionDto>> {
    return await this.defaultConditionService.findAllPaginated(query);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(
    @Param('id') id: number,
    @Query() query: IQueryObject,
  ): Promise<ResponseDefaultConditionDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.defaultConditionService.findOneByCondition(query);
  }

  @Post('')
  async save(
    @Body() createDefaultConditionDto: CreateDefaultConditionDto,
  ): Promise<ResponseDefaultConditionDto> {
    return await this.defaultConditionService.save(createDefaultConditionDto);
  }

  @Put('/batch-update')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async batchUpdate(
    @Body()
    updateDefaultConditionDtos: UpdateDefaultConditionDto[],
  ): Promise<ResponseDefaultConditionDto[]> {
    return await this.defaultConditionService.updateMany(
      updateDefaultConditionDtos,
    );
  }
  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateDefaultConditionDto: UpdateDefaultConditionDto,
  ): Promise<ResponseDefaultConditionDto> {
    return await this.defaultConditionService.update(
      id,
      updateDefaultConditionDto,
    );
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseDefaultConditionDto> {
    return await this.defaultConditionService.softDelete(id);
  }
}
