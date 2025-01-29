import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PayloadDto } from '../auth/dto/payload.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            getAllProjects: jest.fn(),
            createProject: jest.fn(),
            updateProject: jest.fn(),
            deleteProject: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProjects', () => {
    it('should return an array of projects', async () => {
      const queryParams = { companyId: 1 };
      const result = [{ id: 1, name: 'Project 1' }];
      jest.spyOn(service, 'getAllProjects').mockResolvedValue(result as any);

      expect(await controller.getProjects(queryParams)).toBe(result);
      expect(service.getAllProjects).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('createProject', () => {
    it('should create and return a project', async () => {
      const dto = { name: 'New Project', companyId: 1 } as any;
      const result = { id: 1, ...dto };
      jest.spyOn(service, 'createProject').mockResolvedValue(result);

      expect(await controller.createProject(dto)).toBe(result);
      expect(service.createProject).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateProject', () => {
    it('should update and return the project', async () => {
      const dto: UpdateProjectDto = { title: 'Updated Project' };
      const id = 1;
      const user: PayloadDto = {
        id: 1,
        name: 'name',
        companyId: 1,
        email: 'email',
      };
      const result = { id, ...dto };
      jest.spyOn(service, 'updateProject').mockResolvedValue(result as any);

      expect(await controller.updateProject(dto, id, user)).toBe(result);
      expect(service.updateProject).toHaveBeenCalledWith(id, dto, user);
    });
  });

  describe('deleteProject', () => {
    it('should delete the project and return void', async () => {
      const id = 1;
      const user: PayloadDto = {
        id: 1,
        name: 'name',
        companyId: 1,
        email: 'email',
      };
      jest.spyOn(service, 'deleteProject').mockResolvedValue(undefined);

      expect(await controller.deleteProject(id, user)).toBeUndefined();
      expect(service.deleteProject).toHaveBeenCalledWith(id, user);
    });
  });
});
