import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserHistoriesService } from '../user-histories/user-histories.service';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskLog } from './entities/task-log.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepository: Repository<Task>;
  let taskLogRepository: Repository<TaskLog>;
  let userHistoriesService: UserHistoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TaskLog),
          useClass: Repository,
        },
        {
          provide: UserHistoriesService,
          useValue: {
            getUserHistoryWithProject: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    taskLogRepository = module.get<Repository<TaskLog>>(
      getRepositoryToken(TaskLog),
    );
    userHistoriesService =
      module.get<UserHistoriesService>(UserHistoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create and save a new task', async () => {
      const createTaskDto = { userHistoryId: 1 } as any;
      const mockTask = { id: 1 } as Task;

      jest
        .spyOn(userHistoriesService, 'getUserHistoryWithProject')
        .mockResolvedValue({
          project: { companyId: 1, id: 1, title: 'title' },
        } as any);
      jest.spyOn(taskRepository, 'create').mockReturnValue(mockTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(mockTask);

      const result = await service.createTask(createTaskDto);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const id = 1;
      const updateTaskDto = {} as any;
      const task = { id, userHistoryId: 1 } as Task;

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest
        .spyOn(taskRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.updateTask(id, updateTaskDto);
      expect(result).toBeDefined();
    });
  });

  describe('removeTask', () => {
    it('should soft delete a task', async () => {
      const id = 1;
      const task = { id, userHistoryId: 1 } as Task;

      jest.spyOn(service, 'getTaskById').mockResolvedValue(task);
      jest
        .spyOn(taskRepository, 'softDelete')
        .mockResolvedValue({ affected: 1 } as any);

      await service.removeTask(id);
      expect(taskRepository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('getTaskById', () => {
    it('should return a task if found', async () => {
      const id = 1;
      const task = { id } as Task;
      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(task);

      const result = await service.getTaskById(id);
      expect(result).toEqual(task);
    });

    it('should throw NotFoundException if task is not found', async () => {
      jest.spyOn(taskRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.getTaskById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTaskLogs', () => {
    it('should return logs ordered by createdAt DESC', async () => {
      const id = 1;
      const logs = [
        { id: 1, eventType: 'COMMENT' },
        { id: 2, eventType: 'CHANGE_STATUS' },
      ] as any[];
      jest.spyOn(taskLogRepository, 'find').mockResolvedValue(logs);

      const result = await service.getTaskLogs(id);
      expect(result).toEqual(logs);
      expect(taskLogRepository.find).toHaveBeenCalledWith({
        where: { taskId: id },
        order: { createdAt: 'DESC' },
      });
    });
  });
});
