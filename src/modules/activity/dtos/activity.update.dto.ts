import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './activity.create.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}
