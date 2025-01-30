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
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayloadDto } from '../auth/dto/payload.dto';
import { TaskChangeStatusDto } from './dto/task-change-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentTaskDto } from './dto/comment-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.tasksService.createTask(createTaskDto, userData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTask(
    @Body() updateTaskDto: UpdateTaskDto,
    @Param('id') id: number,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.tasksService.updateTask(id, updateTaskDto, userData);
  }

  @Post(':id/changeStatus')
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @Body() taskChangeStatusDto: TaskChangeStatusDto,
    @Param('id') id: number,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.tasksService.changeTasksStatus(
      id,
      taskChangeStatusDto,
      userData,
    );
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  commentTask(
    @Body() commentTaskDto: CommentTaskDto,
    @Param('id') id: number,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.tasksService.commentTask(id, commentTaskDto, userData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTask(@Param('id') id: number, @CurrentUser() useData: PayloadDto) {
    return this.tasksService.removeTask(id, useData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getTasks(
    @Query() searchTasksDto: SearchTasksDto,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.tasksService.getTasks(searchTasksDto, userData);
  }

  @Get(':id/logs')
  @UseGuards(JwtAuthGuard)
  getTaskLogs(@Param('id') id: number) {
    return this.tasksService.getTaskLogs(id);
  }
}
