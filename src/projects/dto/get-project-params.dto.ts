import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProjectParamsDto {
  @ApiProperty()
  @IsNumber()
  companyId: number;
}
