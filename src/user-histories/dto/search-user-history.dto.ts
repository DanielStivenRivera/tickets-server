import { ApiProperty } from '@nestjs/swagger';

export class SearchUserHistoryDto {
  @ApiProperty()
  projectId: number;
}
