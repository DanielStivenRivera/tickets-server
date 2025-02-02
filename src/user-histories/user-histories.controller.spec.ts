import { Test, TestingModule } from '@nestjs/testing';
import { UserHistoriesController } from './user-histories.controller';
import { UserHistoriesService } from './user-histories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SearchUserHistoryDto } from './dto/search-user-history.dto';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('UserHistoriesController', () => {
  let controller: UserHistoriesController;
  let userHistoriesService: UserHistoriesService;

  // Mock del servicio
  const mockUserHistoriesService = {
    getUserHistories: jest.fn(),
    createUserHistory: jest.fn(),
    updateUserHistory: jest.fn(),
    deleteUserHistory: jest.fn(),
  };

  // Mock del guardia JwtAuthGuard
  const mockJwtAuthGuard = {
    canActivate: (context: ExecutionContext) => {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      if (!user) {
        throw new UnauthorizedException();
      }
      return true;
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserHistoriesController],
      providers: [
        {
          provide: UserHistoriesService,
          useValue: mockUserHistoriesService,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    controller = module.get<UserHistoriesController>(UserHistoriesController);
    userHistoriesService =
      module.get<UserHistoriesService>(UserHistoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserHistories', () => {
    it('should return user histories', async () => {
      const searchUserHistoryDto: SearchUserHistoryDto = { projectId: 1 };
      const mockUserHistories = [
        { id: 1, projectId: 1, description: 'Test History 1' },
        { id: 2, projectId: 1, description: 'Test History 2' },
      ];

      jest
        .spyOn(userHistoriesService, 'getUserHistories')
        .mockResolvedValue(mockUserHistories as any);

      const result = await controller.getUserHistories(searchUserHistoryDto);

      expect(result).toEqual(mockUserHistories);
      expect(userHistoriesService.getUserHistories).toHaveBeenCalledWith(
        searchUserHistoryDto,
      );
    });
  });

  describe('createUserHistory', () => {
    it('should create a new user history', async () => {
      const createUserHistoryDto: CreateUserHistoryDto = {
        projectId: 1,
        description: 'New User History',
        title: 'title',
      };
      const mockCreatedUserHistory = { id: 1, ...createUserHistoryDto };

      jest
        .spyOn(userHistoriesService, 'createUserHistory')
        .mockResolvedValue(mockCreatedUserHistory as any);

      const result = await controller.createUserHistory(createUserHistoryDto);

      expect(result).toEqual(mockCreatedUserHistory);
      expect(userHistoriesService.createUserHistory).toHaveBeenCalledWith(
        createUserHistoryDto,
      );
    });
  });

  describe('updateUserHistory', () => {
    it('should update an existing user history', async () => {
      const updateUserHistoryDto: UpdateUserHistoryDto = {
        description: 'Updated User History',
      };
      const id = 1;
      const mockUpdatedUserHistory = { id: 1, ...updateUserHistoryDto };

      jest
        .spyOn(userHistoriesService, 'updateUserHistory')
        .mockResolvedValue(mockUpdatedUserHistory as any);

      const result = await controller.updateUserHistory(
        updateUserHistoryDto,
        id,
      );

      expect(result).toEqual(mockUpdatedUserHistory);
      expect(userHistoriesService.updateUserHistory).toHaveBeenCalledWith(
        updateUserHistoryDto,
        id,
      );
    });
  });

  describe('deleteUserHistory', () => {
    it('should delete an existing user history', async () => {
      const id = 1;

      jest
        .spyOn(userHistoriesService, 'deleteUserHistory')
        .mockResolvedValue(undefined);

      const result = await controller.deleteUserHistory(id);

      expect(result).toBeUndefined();
      expect(userHistoriesService.deleteUserHistory).toHaveBeenCalledWith(id);
    });
  });
});
