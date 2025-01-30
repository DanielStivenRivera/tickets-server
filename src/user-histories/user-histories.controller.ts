import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserHistoriesService } from './user-histories.service';
import { SearchUserHistoryDto } from './dto/search-user-history.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayloadDto } from '../auth/dto/payload.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';

@Controller('user-histories')
export class UserHistoriesController {
  constructor(private readonly userHistoriesService: UserHistoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getUserHistories(@Query() getUserHistoriesQueryParams: SearchUserHistoryDto) {
    return this.userHistoriesService.getUserHistories(
      getUserHistoriesQueryParams,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createUserHistory(
    @Body() createUserHistoryDto: CreateUserHistoryDto,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.userHistoriesService.createUserHistory(
      createUserHistoryDto,
      userData,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUserHistory(
    @Body() updateUserHistoryDto: UpdateUserHistoryDto,
    @CurrentUser() userData: PayloadDto,
    @Param('id') id: number,
  ) {
    return this.userHistoriesService.updateUserHistory(
      updateUserHistoryDto,
      id,
      userData,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUserHistory(
    @Param('id') id: number,
    @CurrentUser() userData: PayloadDto,
  ) {
    console.log(id, userData);
    return this.userHistoriesService.deleteUserHistory(id, userData);
  }
}
