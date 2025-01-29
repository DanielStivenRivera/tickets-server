import { IsNumber, IsString } from 'class-validator';

export class CreateUserHistoryDto {
  @IsString()
  title: string;
  @IsString()
  description: string;
  @IsNumber()
  projectId: number;
}
