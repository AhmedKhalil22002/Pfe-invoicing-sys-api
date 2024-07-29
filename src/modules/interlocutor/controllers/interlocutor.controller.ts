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
import { PagingQueryOptionsDto } from 'src/common/database/dtos/databse.query-options.dto';
import { PageDto } from 'src/common/database/dtos/database.page.dto';

@ApiTags('interlocutor')
@Controller({
  version: '1',
  path: '/interlocutor',
})
export class InterlocutorController {
  constructor(private readonly interlocutorService: InterlocutorService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseInterlocutorDto)
  async findAllPaginated(
    @Query()
    options: PagingQueryOptionsDto<ResponseInterlocutorDto> & {
      firmId: number;
    },
  ): Promise<PageDto<ResponseInterlocutorDto>> {
    return await this.interlocutorService.findAllPaginated(options);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(@Param('id') id: number): Promise<ResponseInterlocutorDto> {
    return await this.interlocutorService.findOneById(id);
  }

  @Post('')
  async save(
    @Body() createInterlocutorDto: CreateInterlocutorDto,
  ): Promise<ResponseInterlocutorDto> {
    return await this.interlocutorService.save(createInterlocutorDto);
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
