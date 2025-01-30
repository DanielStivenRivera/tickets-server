import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SearchTasksDto {
  @ApiProperty()
  @IsNotEmpty()
  userHistoryId: number;
}
