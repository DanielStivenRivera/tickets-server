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
  createUserHistory(@Body() createUserHistoryDto: CreateUserHistoryDto) {
    return this.userHistoriesService.createUserHistory(createUserHistoryDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateUserHistory(
    @Body() updateUserHistoryDto: UpdateUserHistoryDto,
    @Param('id') id: number,
  ) {
    return this.userHistoriesService.updateUserHistory(
      updateUserHistoryDto,
      id,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteUserHistory(@Param('id') id: number) {
    return this.userHistoriesService.deleteUserHistory(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getUserHistoryById(@Param('id') id: number) {
    return this.userHistoriesService.getUserHistoryById(id);
  }
}
