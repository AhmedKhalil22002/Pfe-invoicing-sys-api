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
import { InterlocutorService } from '../services/interlocutor.service';
import { ResponseInterlocutorDto } from '../dtos/interlocutor.response.dto';
import { CreateInterlocutorDto } from '../dtos/interlocutor.create.dto';
import { UpdateInterlocutorDto } from '../dtos/interlocutor.update.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';

@ApiTags('interlocutor')
@Controller({
  version: '1',
  path: '/interlocutor',
})
export class InterlocutorController {
  constructor(private readonly interlocutorService: InterlocutorService) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseInterlocutorDto[]> {
    return await this.interlocutorService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseInterlocutorDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseInterlocutorDto>> {
    return await this.interlocutorService.findAllPaginated(query);
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
  ): Promise<ResponseInterlocutorDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.interlocutorService.findOneByCondition(query);
  }

  @Post('')
  async save(
    @Body() createInterlocutorDto: CreateInterlocutorDto,
  ): Promise<ResponseInterlocutorDto> {
    return await this.interlocutorService.save(createInterlocutorDto);
  }

  @Post('/promote/:id/:firmId')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async promote(
    @Param('id') id: number,
    @Param('firmId') firmId: number,
  ): Promise<ResponseInterlocutorDto> {
    await this.interlocutorService.demote(firmId);
    await this.interlocutorService.promote(id, firmId);
    return await this.interlocutorService.findOneById(id);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateInterlocutorDto: UpdateInterlocutorDto,
  ): Promise<ResponseInterlocutorDto> {
    return await this.interlocutorService.update(id, updateInterlocutorDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseInterlocutorDto> {
    return await this.interlocutorService.softDelete(id);
  }
}
