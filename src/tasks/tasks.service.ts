import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskLog, TaskLogEventType } from './entities/task-log.entity';
import { UserHistoriesService } from '../user-histories/user-histories.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { PayloadDto } from '../auth/dto/payload.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskChangeStatusDto } from './dto/task-change-status.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    @InjectRepository(TaskLog)
    private readonly taskLogRepository: Repository<TaskLog>,
    private readonly userHistoriesService: UserHistoriesService,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    const userHistory =
      await this.userHistoriesService.getUserHistoryWithProject(
        createTaskDto.userHistoryId,
      );
    const task = this.taskRepository.create(createTaskDto);
    task.userHistory = userHistory;
    return await this.taskRepository.save(task);
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.update(id, updateTaskDto);
    return await this.getTaskById(id);
  }

  async getTaskById(id: number) {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException('task doesnt exists');
    return task;
  }

  async removeTask(id: number) {
    await this.taskRepository.softDelete(id);
  }

  async changeTasksStatus(
    id: number,
    taskChangeStatusDto: TaskChangeStatusDto,
  ) {
    const task = await this.getTaskById(id);
    await this.taskRepository.update(id, {
      status: taskChangeStatusDto.status,
    });
    await this.taskLogRepository.save({
      eventType: TaskLogEventType.CHANGE_STATUS,
      taskId: id,
      task,
      statusChange: {
        current: taskChangeStatusDto.status,
        previous: task.status,
      },
    });
    return this.taskRepository.findOne({ where: { id }, relations: ['logs'] });
  }

  async commentTask(id: number, commentTaskDto: CommentTaskDto) {
    const task = await this.getTaskById(id);
    return await this.taskLogRepository.save({
      eventType: TaskLogEventType.COMMENT,
      comment: commentTaskDto.comment,
      task,
      taskId: task.id,
    });
  }

  async getTasks(searchTasksDto: SearchTasksDto) {
    const userHistory =
      await this.userHistoriesService.getUserHistoryWithProject(
        searchTasksDto.userHistoryId,
      );
    if (!userHistory) {
      throw new NotFoundException('user history not found');
    }
    return this.taskRepository.find({
      where: { userHistoryId: searchTasksDto.userHistoryId },
    });
  }

  getTaskLogs(id: number) {
    return this.taskLogRepository.find({
      where: { taskId: id },
      order: { createdAt: 'DESC' },
    });
  }
}
