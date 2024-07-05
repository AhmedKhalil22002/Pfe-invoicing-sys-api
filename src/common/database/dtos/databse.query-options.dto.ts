import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { PageOptionsDto } from '../interfaces/database.pagination.interface';
import { FindOptionsSelect } from 'typeorm';

export class QueryOptionsDto<T> {
  @ApiProperty({ type: 'object', example: {} })
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    const transformedValue = {};
    for (const key in value) {
      transformedValue[key] = value[key] === 'true' || value[key] === true;
    }
    return transformedValue;
  })
  columns?: FindOptionsSelect<T>;

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  relationSelect?: boolean;

  @ApiProperty({ type: 'object', example: {} })
  @IsOptional()
  @IsObject()
  filters?: Partial<T>;

  @ApiProperty({ type: 'object', example: {} })
  @IsOptional()
  @IsObject()
  strictMatching?: { [P in keyof T]?: string };

  @ApiProperty({
    type: 'object',
    example: {},
  })
  @IsOptional()
  @IsObject()
  sort?: { [P in keyof T]?: 'ASC' | 'DESC' };
}

export class PagingQueryOptionsDto<T> extends QueryOptionsDto<T> {
  @ApiProperty({ type: PageOptionsDto })
  @Type(() => PageOptionsDto)
  @IsOptional()
  @ValidateNested()
  pageOptions?: PageOptionsDto;
}
