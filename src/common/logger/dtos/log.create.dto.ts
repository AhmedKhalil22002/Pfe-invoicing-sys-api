import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ACCESS_TYPE } from 'src/app/enums/logger/access-types.enum';
import { EVENT_TYPE } from 'src/app/enums/logger/event-types.enum';

export class CreateLogDto {
  @IsOptional()
  @IsEnum(ACCESS_TYPE)
  access_type?: ACCESS_TYPE;

  @IsOptional()
  @IsEnum(ACCESS_TYPE)
  event?: EVENT_TYPE;

  @IsOptional()
  payload?: any;

  @IsOptional()
  @IsInt()
  userId?: number;
}
