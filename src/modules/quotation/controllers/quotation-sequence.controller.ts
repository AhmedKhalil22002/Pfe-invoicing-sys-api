import { Body, Controller, Get, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QuotationSequenceService } from '../services/quotation-sequence.service';
import { AppConfigEntity } from 'src/common/app-config/repositories/entities/app-config.entity';
import { QuotationSequence } from '../interfaces/quotation-sequence.interface';

@ApiTags('quotation-sequence')
@Controller({
  version: '1',
  path: '/quotation-sequence',
})
export class QuotationSequenceController {
  constructor(
    private readonly quotationSequenceService: QuotationSequenceService,
  ) {}

  @Get('/')
  async find(): Promise<AppConfigEntity> {
    return await this.quotationSequenceService.get();
  }

  @Put('/')
  async update(
    @Body() quotationSequence: QuotationSequence,
  ): Promise<AppConfigEntity> {
    return await this.quotationSequenceService.set(quotationSequence);
  }
}
