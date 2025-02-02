import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserHistoriesService } from './user-histories.service';
import { UserHistory } from './entities/user-history.entity';
import { ProjectsService } from '../projects/projects.service';
import { Project } from '../projects/entities/project.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UserHistoriesService', () => {
  let service: UserHistoriesService;
  let userHistoriesRepository: Repository<UserHistory>;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserHistoriesService,
        {
          provide: getRepositoryToken(UserHistory),
          useValue: {
            findBy: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findOneBy: jest.fn(),
            softDelete: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: ProjectsService,
          useValue: {
            getProjectById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserHistoriesService>(UserHistoriesService);
    userHistoriesRepository = module.get<Repository<UserHistory>>(
      getRepositoryToken(UserHistory),
    );
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserHistories', () => {
    it('should return user histories for a given project', async () => {
      const projectId = 1;
      const mockUserHistories = [
        { id: 1, projectId: 1, description: 'Test History 1' },
        { id: 2, projectId: 1, description: 'Test History 2' },
      ];

      jest
        .spyOn(userHistoriesRepository, 'find')
        .mockResolvedValue(mockUserHistories as any);

      const result = await service.getUserHistories({ projectId });

      expect(result).toEqual(mockUserHistories);
      expect(userHistoriesRepository.find).toHaveBeenCalledWith({
        relations: ['tasks'],
        where: {
          projectId,
        },
      });
    });
  });

  describe('createUserHistory', () => {
    it('should create a new user history', async () => {
      const createUserHistoryDto = {
        projectId: 1,
        description: 'New User History',
        title: 'title',
      };

      jest
        .spyOn(userHistoriesRepository, 'save')
        .mockResolvedValue({ id: 1, ...createUserHistoryDto } as any);

      const result = await service.createUserHistory(createUserHistoryDto);

      expect(result).toEqual({ id: 1, ...createUserHistoryDto });
    });
  });

  describe('updateUserHistory', () => {
    it('should update an existing user history', async () => {
      const updateUserHistoryDto = { description: 'Updated User History' };
      const id = 1;
      const mockUserHistory = {
        id: 1,
        projectId: 1,
        description: 'Original User History',
      };
      jest
        .spyOn(service, 'getUserHistoryWithProject')
        .mockResolvedValue(mockUserHistory as UserHistory);
      jest.spyOn(userHistoriesRepository, 'update').mockResolvedValue(null);
      jest
        .spyOn(userHistoriesRepository, 'findOneBy')
        .mockResolvedValue({ id: 1, ...updateUserHistoryDto } as any);

      const result = await service.updateUserHistory(updateUserHistoryDto, id);

      expect(result).toEqual({ id: 1, ...updateUserHistoryDto });
      expect(userHistoriesRepository.update).toHaveBeenCalledWith(
        id,
        updateUserHistoryDto,
      );
      expect(userHistoriesRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('deleteUserHistory', () => {
    it('should soft delete an existing user history', async () => {
      const id = 1;
      const userData = { companyId: 1, id: 1, email: 'email', name: 'name' };
      const mockUserHistory = {
        id: 1,
        projectId: 1,
        description: 'User History to Delete',
      };

      jest
        .spyOn(service, 'getUserHistoryWithProject')
        .mockResolvedValue(mockUserHistory as UserHistory);
      jest.spyOn(userHistoriesRepository, 'softDelete').mockResolvedValue(null);

      await service.deleteUserHistory(id);

      expect(userHistoriesRepository.softDelete).toHaveBeenCalledWith(id);
    });
  });

  describe('getUserHistoryWithProject', () => {
    it('should return a user history with project', async () => {
      const id = 1;
      const mockUserHistory = {
        id: 1,
        projectId: 1,
        description: 'User History with Project',
        project: { id: 1, companyId: 1 },
      };

      jest
        .spyOn(userHistoriesRepository, 'findOne')
        .mockResolvedValue(mockUserHistory as UserHistory);

      const result = await service['getUserHistoryWithProject'](id);

      expect(result).toEqual(mockUserHistory);
      expect(userHistoriesRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['project'],
      });
    });

    it('should throw NotFoundException if user history not found', async () => {
      const id = 1;

      jest.spyOn(userHistoriesRepository, 'findOne').mockResolvedValue(null);

      await expect(service['getUserHistoryWithProject'](id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
