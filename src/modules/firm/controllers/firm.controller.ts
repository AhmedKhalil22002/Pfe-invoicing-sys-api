import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FirmService } from '../services/firm.service';
import { ResponseFirmDto } from '../dtos/firm.response.dto';
import { CreateFirmDto } from '../dtos/firm.create.dto';
import { ApiPaginatedResponse } from 'src/common/database/decorators/ApiPaginatedResponse';
import { PageDto } from 'src/common/database/dtos/database.page.dto';
import { UpdateFirmDto } from '../dtos/firm.update.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';

@ApiTags('firm')
@Controller({
  version: '1',
  path: '/firm',
})
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get('/all')
  async findAll(@Query() options: IQueryObject): Promise<ResponseFirmDto[]> {
    return await this.firmService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseFirmDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseFirmDto>> {
    return await this.firmService.findAllPaginated(query);
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
  ): Promise<ResponseFirmDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.firmService.findOneByCondition(query);
  }

  @Post('')
  async save(@Body() createFirmDto: CreateFirmDto): Promise<ResponseFirmDto> {
    return await this.firmService.save(createFirmDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateActivityDto: UpdateFirmDto,
  ): Promise<ResponseFirmDto> {
    return await this.firmService.update(id, updateActivityDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseFirmDto> {
    return await this.firmService.softDelete(id);
  }
}
