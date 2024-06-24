import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FirmService } from '../services/firm.service';
import { ResponseFirmDto } from '../dtos/firm.response.dto';
import { CreateFirmDto } from '../dtos/firm.create.dto';

@ApiTags('firm')
@Controller({
  version: '1',
  path: '/firm',
})
export class FirmController {
  constructor(private readonly firmService: FirmService) {}

  @Get('/all')
  async findAll(): Promise<ResponseFirmDto[]> {
    return await this.firmService.findAll();
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
    required: true,
  })
  async findOneById(id: number): Promise<ResponseFirmDto> {
    return await this.firmService.findOneById(id);
  }

  @Post('/')
  async save(@Body() createFirmDto: CreateFirmDto): Promise<ResponseFirmDto> {
    return await this.firmService.save(createFirmDto);
  }
}
