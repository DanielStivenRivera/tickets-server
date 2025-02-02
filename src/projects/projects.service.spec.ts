import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompaniesService } from '../companies/companies.service';
import { Project } from './entities/project.entity';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let projectRepository: Repository<Project>;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: CompaniesService,
          useValue: {
            getCompanyById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProject', () => {
    it('should be able to create project if company exists', async () => {
      const createProjectDto: CreateProjectDto = {
        title: 'Project A',
        companyId: 1,
        description: 'desc',
      };
      const company = { id: 1, name: 'Company A' } as any;
      const project = { id: 1, ...createProjectDto, company };

      jest.spyOn(companiesService, 'getCompanyById').mockResolvedValue(company);
      jest.spyOn(projectRepository, 'create').mockReturnValue(project as any);
      jest.spyOn(projectRepository, 'save').mockResolvedValue(project as any);

      const result = await service.createProject(createProjectDto);
      expect(result).toEqual(project);
      expect(companiesService.getCompanyById).toHaveBeenCalledWith(1);
      expect(projectRepository.create).toHaveBeenCalledWith({
        ...createProjectDto,
        company,
      });
      expect(projectRepository.save).toHaveBeenCalledWith(project);
    });

    it('should be able to throw error if company dont exists', async () => {
      jest.spyOn(companiesService, 'getCompanyById').mockResolvedValue(null);

      await expect(
        service.createProject({
          title: 'Project B',
          companyId: 2,
          description: 'desc',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getProjectById', () => {
    it('should be able to return project if exists', async () => {
      const project = { id: 1, name: 'Project A' } as any;
      jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue(project);

      const result = await service.getProjectById(1);
      expect(result).toEqual(project);
      expect(projectRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should be able to return null when project dont exists', async () => {
      jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue(null);
      const result = await service.getProjectById(999);
      expect(result).toBeNull();
    });
  });

  describe('updateProject', () => {
    it('should be able to update project', async () => {
      const project = { id: 1, name: 'Old Project', companyId: 1 } as any;
      const updateProjectDto: UpdateProjectDto = { title: 'Updated Project' };

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest
        .spyOn(projectRepository, 'save')
        .mockResolvedValue({ ...project, ...updateProjectDto });

      const result = await service.updateProject(1, updateProjectDto);
      expect(result).toEqual({ ...project, ...updateProjectDto });
      expect(projectRepository.save).toHaveBeenCalledWith({
        ...project,
        ...updateProjectDto,
      });
    });

    it('should be able to throw error if project dont exists', async () => {
      jest.spyOn(service, 'getProjectById').mockResolvedValue(null);
      await expect(
        service.updateProject(999, { title: 'Invalid' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProject', () => {
    it('should be able to delete project if this is from the same company of user', async () => {
      const project = {
        id: 1,
        title: 'Project A',
        companyId: 1,
        description: 'desc',
      } as any;

      jest.spyOn(service, 'getProjectById').mockResolvedValue(project);
      jest
        .spyOn(projectRepository, 'update')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteProject(1);
      expect(result).toEqual({ affected: 1 });
      expect(projectRepository.update).toHaveBeenCalledWith(1, {
        deletedAt: expect.any(Date),
        isActive: false,
      });
    });

    it('should be able to throw error if project dont exists', async () => {
      jest.spyOn(service, 'getProjectById').mockResolvedValue(null);
      await expect(service.deleteProject(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getAllProjects', () => {
    it('should be able to return project from user company', async () => {
      const projects = [{ id: 1, name: 'Project A', companyId: 1 }] as any;
      jest.spyOn(projectRepository, 'findBy').mockResolvedValue(projects);

      const result = await service.getAllProjects({ companyId: 1 });
      expect(result).toEqual(projects);
      expect(projectRepository.findBy).toHaveBeenCalledWith({ companyId: 1 });
    });
  });
});
