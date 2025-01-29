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
        .spyOn(userHistoriesRepository, 'findBy')
        .mockResolvedValue(mockUserHistories as any);

      const result = await service.getUserHistories({ projectId });

      expect(result).toEqual(mockUserHistories);
      expect(userHistoriesRepository.findBy).toHaveBeenCalledWith({
        projectId,
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
      const userData = { companyId: 1, id: 1, email: 'email', name: 'name' };

      jest.spyOn(service, 'validateProjectOwnership').mockResolvedValue({
        id: 1,
        companyId: 1,
      } as Project);
      jest
        .spyOn(userHistoriesRepository, 'save')
        .mockResolvedValue({ id: 1, ...createUserHistoryDto } as any);

      const result = await service.createUserHistory(
        createUserHistoryDto,
        userData,
      );

      expect(result).toEqual({ id: 1, ...createUserHistoryDto });
      expect(service['validateProjectOwnership']).toHaveBeenCalledWith(
        createUserHistoryDto.projectId,
        userData.companyId,
      );
      expect(userHistoriesRepository.save).toHaveBeenCalledWith(
        createUserHistoryDto,
      );
    });
  });

  describe('updateUserHistory', () => {
    it('should update an existing user history', async () => {
      const updateUserHistoryDto = { description: 'Updated User History' };
      const id = 1;
      const userData = { companyId: 1, id: 1, email: 'email', name: 'name' };
      const mockUserHistory = {
        id: 1,
        projectId: 1,
        description: 'Original User History',
      };
      jest
        .spyOn(service, 'getUserHistoryWithProject')
        .mockResolvedValue(mockUserHistory as UserHistory);
      jest.spyOn(service, 'validateProjectOwnership').mockResolvedValue({
        id: 1,
        companyId: 1,
      } as Project);
      jest.spyOn(userHistoriesRepository, 'update').mockResolvedValue(null);
      jest
        .spyOn(userHistoriesRepository, 'findOneBy')
        .mockResolvedValue({ id: 1, ...updateUserHistoryDto } as any);

      const result = await service.updateUserHistory(
        updateUserHistoryDto,
        id,
        userData,
      );

      expect(result).toEqual({ id: 1, ...updateUserHistoryDto });
      expect(service['getUserHistoryWithProject']).toHaveBeenCalledWith(id);
      expect(service['validateProjectOwnership']).toHaveBeenCalledWith(
        mockUserHistory.projectId,
        userData.companyId,
      );
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
      jest.spyOn(service, 'validateProjectOwnership').mockResolvedValue({
        id: 1,
        companyId: 1,
      } as Project);
      jest.spyOn(userHistoriesRepository, 'softDelete').mockResolvedValue(null);

      await service.deleteUserHistory(id, userData);

      expect(service['getUserHistoryWithProject']).toHaveBeenCalledWith(id);
      expect(service['validateProjectOwnership']).toHaveBeenCalledWith(
        mockUserHistory.projectId,
        userData.companyId,
      );
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

  describe('validateProjectOwnership', () => {
    it('should return project if user has access', async () => {
      const projectId = 1;
      const userCompanyId = 1;
      const mockProject = { id: 1, companyId: 1 };

      jest
        .spyOn(projectsService, 'getProjectById')
        .mockResolvedValue(mockProject as Project);

      const result = await service['validateProjectOwnership'](
        projectId,
        userCompanyId,
      );

      expect(result).toEqual(mockProject);
      expect(projectsService.getProjectById).toHaveBeenCalledWith(projectId);
    });

    it('should throw NotFoundException if project not found', async () => {
      const projectId = 1;
      const userCompanyId = 1;

      jest.spyOn(projectsService, 'getProjectById').mockResolvedValue(null);

      await expect(
        service['validateProjectOwnership'](projectId, userCompanyId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not have access', async () => {
      const projectId = 1;
      const userCompanyId = 2;
      const mockProject = { id: 1, companyId: 1 };

      jest
        .spyOn(projectsService, 'getProjectById')
        .mockResolvedValue(mockProject as Project);

      await expect(
        service['validateProjectOwnership'](projectId, userCompanyId),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
