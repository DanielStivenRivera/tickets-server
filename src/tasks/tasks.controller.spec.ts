import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskChangeStatusDto } from './dto/task-change-status.dto';
import { CommentTaskDto } from './dto/comment-task.dto';
import { SearchTasksDto } from './dto/search-tasks.dto';
import { TaskStatus } from './entities/task.entity';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockTasksService = {
    createTask: jest.fn(),
    updateTask: jest.fn(),
    changeTasksStatus: jest.fn(),
    commentTask: jest.fn(),
    removeTask: jest.fn(),
    getTasks: jest.fn(),
    getTaskLogs: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createTask', () => {
    it('should call tasksService.createTask with correct parameters', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'desc',
        userHistoryId: 1,
      };

      await controller.createTask(createTaskDto);
      expect(tasksService.createTask).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('updateTask', () => {
    it('should call tasksService.updateTask with correct parameters', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      const taskId = 1;

      await controller.updateTask(updateTaskDto, taskId);
      expect(tasksService.updateTask).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
      );
    });
  });

  describe('changeStatus', () => {
    it('should call tasksService.changeTasksStatus with correct parameters', async () => {
      const taskChangeStatusDto: TaskChangeStatusDto = {
        status: TaskStatus.IN_PROGRESS,
      };
      const taskId = 1;

      await controller.changeStatus(taskChangeStatusDto, taskId);
      expect(tasksService.changeTasksStatus).toHaveBeenCalledWith(
        taskId,
        taskChangeStatusDto,
      );
    });
  });

  describe('commentTask', () => {
    it('should call tasksService.commentTask with correct parameters', async () => {
      const commentTaskDto: CommentTaskDto = { comment: 'Nice job' };
      const taskId = 1;

      await controller.commentTask(commentTaskDto, taskId);
      expect(tasksService.commentTask).toHaveBeenCalledWith(
        taskId,
        commentTaskDto,
      );
    });
  });

  describe('deleteTask', () => {
    it('should call tasksService.removeTask with correct parameters', async () => {
      const taskId = 1;

      await controller.deleteTask(taskId);
      expect(tasksService.removeTask).toHaveBeenCalledWith(taskId);
    });
  });

  describe('getTasks', () => {
    it('should call tasksService.getTasks with correct parameters', async () => {
      const searchTasksDto: SearchTasksDto = { userHistoryId: 1 };

      await controller.getTasks(searchTasksDto);
      expect(tasksService.getTasks).toHaveBeenCalledWith(searchTasksDto);
    });
  });

  describe('getTaskLogs', () => {
    it('should call tasksService.getTaskLogs with correct parameters', async () => {
      const taskId = 1;

      await controller.getTaskLogs(taskId);
      expect(tasksService.getTaskLogs).toHaveBeenCalledWith(taskId);
    });
  });
});
