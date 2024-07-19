import { ApiProperty } from '@nestjs/swagger';
import { CreateInterlocutorDto } from './interlocutor.create.dto';

export class UpdateInterlocutorDto extends CreateInterlocutorDto {
  @ApiProperty({ example: 1, type: Number })
  id: number;
}
