import { PartialType } from '@nestjs/mapped-types';
import { CreateCabinetDto } from './cabinet.create.dto';

export class UpdateCabinetDto extends PartialType(CreateCabinetDto) {}
