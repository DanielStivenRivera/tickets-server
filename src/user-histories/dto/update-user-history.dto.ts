import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserHistoryDto } from './create-user-history.dto';

export class UpdateUserHistoryDto extends PartialType(
  OmitType(CreateUserHistoryDto, ['projectId']),
) {}
