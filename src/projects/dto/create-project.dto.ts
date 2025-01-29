import { IsNumber, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  title: string;
  @ApiProperty()
  @IsString()
  @Length(3, 255)
  description: string;
  @ApiProperty()
  @IsNumber()
  companyId: number;
}
