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
import { BankAccountService } from '../services/bank-account.service';
import { ResponseBankAccountDto } from '../dtos/bank-account.response.dto';
import { CreateBankAccountDto } from '../dtos/bank-account.create.dto';
import { UpdateBankAccountDto } from '../dtos/bank-account.update.dto';
import { IQueryObject } from 'src/common/database/interfaces/database-query-options.interface';

@ApiTags('bank-account')
@Controller({
  version: '1',
  path: '/bank-account',
})
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Get('/all')
  async findAll(
    @Query() options: IQueryObject,
  ): Promise<ResponseBankAccountDto[]> {
    return await this.bankAccountService.findAll(options);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseBankAccountDto)
  async findAllPaginated(
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseBankAccountDto>> {
    return await this.bankAccountService.findAllPaginated(query);
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
  ): Promise<ResponseBankAccountDto> {
    query.filter
      ? (query.filter += `,id||$eq||${id}`)
      : (query.filter = `id||$eq||${id}`);
    return await this.bankAccountService.findOneByCondition(query);
  }

  @Post('')
  async save(
    @Body() createBankAccountDto: CreateBankAccountDto,
  ): Promise<ResponseBankAccountDto> {
    return await this.bankAccountService.save(createBankAccountDto);
  }

  @Put('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async update(
    @Param('id') id: number,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<ResponseBankAccountDto> {
    return await this.bankAccountService.update(id, updateBankAccountDto);
  }

  @Delete('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async delete(@Param('id') id: number): Promise<ResponseBankAccountDto> {
    return await this.bankAccountService.softDelete(id);
  }
}
