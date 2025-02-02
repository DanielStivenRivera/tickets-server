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
import { TaskChangeStatusDto } from './dto/task-change-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentTaskDto } from './dto/comment-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Param('id') id: number) {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Post(':id/changeStatus')
  @UseGuards(JwtAuthGuard)
  changeStatus(
    @Body() taskChangeStatusDto: TaskChangeStatusDto,
    @Param('id') id: number,
  ) {
    return this.tasksService.changeTasksStatus(id, taskChangeStatusDto);
  }

  @Post(':id/comment')
  @UseGuards(JwtAuthGuard)
  commentTask(@Body() commentTaskDto: CommentTaskDto, @Param('id') id: number) {
    return this.tasksService.commentTask(id, commentTaskDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteTask(@Param('id') id: number) {
    return this.tasksService.removeTask(id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getTasks(@Query() searchTasksDto: SearchTasksDto) {
    return this.tasksService.getTasks(searchTasksDto);
  }

  @Get(':id/logs')
  @UseGuards(JwtAuthGuard)
  getTaskLogs(@Param('id') id: number) {
    return this.tasksService.getTaskLogs(id);
  }
}
