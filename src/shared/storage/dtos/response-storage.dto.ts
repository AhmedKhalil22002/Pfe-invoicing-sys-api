import { ApiProperty } from '@nestjs/swagger';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseStorageDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  slug: string;

  @ApiProperty({ type: String })
  filename: string;

  @ApiProperty({ type: String })
  mimeType: string;

  @ApiProperty({ type: Number })
  size: number;

  @ApiProperty({ type: Boolean })
  isTemporary: boolean;
}
