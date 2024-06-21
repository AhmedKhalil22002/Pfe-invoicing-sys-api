import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto } from '../interfaces/database.pagination.interface';

export class QueryOptionsDto<T> {
  @ApiProperty({ type: 'object', example: {} })
  filters?: Partial<T>;

  @ApiProperty({ type: 'object', example: {} })
  strictMatching?: { [P in keyof T]?: string };

  @ApiProperty({
    type: 'object',
    example: {},
  })
  sort?: { [P in keyof T]?: 'ASC' | 'DESC' };

  @ApiProperty({ type: PageOptionsDto })
  pageOptions?: PageOptionsDto;
}
