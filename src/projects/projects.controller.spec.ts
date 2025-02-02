import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

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
            getProjectById: jest.fn(),
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
      const result = { id, ...dto };
      jest.spyOn(service, 'updateProject').mockResolvedValue(result as any);

      expect(await controller.updateProject(dto, id)).toBe(result);
      expect(service.updateProject).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteProject', () => {
    it('should delete the project and return void', async () => {
      const id = 1;
      jest.spyOn(service, 'deleteProject').mockResolvedValue(undefined);

      expect(await controller.deleteProject(id)).toBeUndefined();
      expect(service.deleteProject).toHaveBeenCalledWith(id);
    });
  });

  it('should be able to get project by id', async () => {
    const project: Project = {
      companyId: 1,
      id: 1,
      company: {
        id: 1,
        name: 'name',
        phone: 'string',
        projects: [],
        address: 'address',
        nit: 'nit',
        email: 'email',
      },
      title: 'title',
      description: 'desc',
      isActive: true,
      userHistories: [],
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      updateStatusAfterRestore() {},
      updateStatusAfterSoftRemove() {},
    };
    jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
    const resp = await controller.getProjectById(1);
    expect(project).toEqual(resp);
  });
});
