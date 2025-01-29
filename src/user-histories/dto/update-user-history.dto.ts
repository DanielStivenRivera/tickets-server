import { PartialType } from '@nestjs/swagger';
import { CreateUserHistoryDto } from './create-user-history.dto';

export class UpdateUserHistoryDto extends PartialType(CreateUserHistoryDto) {}
