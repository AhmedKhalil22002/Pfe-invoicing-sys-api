import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('hello')
@ApiTags('hello')
export class HelloController {
  @Get()
  findAll(): string {
    return 'Hello Invoice System!';
  }
}
