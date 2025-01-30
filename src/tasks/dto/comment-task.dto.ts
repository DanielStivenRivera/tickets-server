import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentTaskDto {
  @ApiProperty()
  @IsString()
  comment: string;
}
