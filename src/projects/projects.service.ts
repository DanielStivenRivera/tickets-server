import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { CompaniesService } from '../companies/companies.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectParamsDto } from './dto/get-project-params.dto';
import { PayloadDto } from '../auth/dto/payload.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly companiesService: CompaniesService,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
    userData: PayloadDto,
  ) {
    const company = await this.companiesService.getCompanyById(
      createProjectDto.companyId,
    );
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    if (company.id !== userData.companyId) {
      throw new UnauthorizedException('user doesnt have access to company');
    }
    const project = this.projectRepository.create({
      ...createProjectDto,
      company,
    });
    return await this.projectRepository.save(project);
  }

  async getProjectById(id: number) {
    return await this.projectRepository.findOneBy({ id });
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userData: PayloadDto,
  ) {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (project.companyId !== userData.companyId) {
      throw new UnauthorizedException(
        'cannot update projects from other companies',
      );
    }
    return await this.projectRepository.save({
      ...project,
      ...updateProjectDto,
    });
  }

  async deleteProject(id: number, user: PayloadDto) {
    const project = await this.getProjectById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    if (user.companyId !== project.companyId) {
      throw new UnauthorizedException(
        'you can delete projects from other companies',
      );
    }
    return await this.projectRepository.update(id, {
      deletedAt: new Date(),
      isActive: false,
    });
  }

  async getAllProjects(getProjectParams: GetProjectParamsDto) {
    return this.projectRepository.findBy({
      companyId: getProjectParams.companyId,
    });
  }
}
