import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHistory } from './entities/user-history.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { SearchUserHistoryDto } from './dto/search-user-history.dto';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { PayloadDto } from '../auth/dto/payload.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class UserHistoriesService {
  constructor(
    @InjectRepository(UserHistory)
    private readonly userHistoriesRepository: Repository<UserHistory>,
    private readonly projectsService: ProjectsService,
  ) {}

  async getUserHistories(searchUserHistoryDto: SearchUserHistoryDto) {
    return await this.userHistoriesRepository.find({
      where: { projectId: searchUserHistoryDto.projectId },
    });
  }

  async createUserHistory(
    createUserHistoryDto: CreateUserHistoryDto,
    userData: PayloadDto,
  ) {
    await this.validateProjectOwnership(
      createUserHistoryDto.projectId,
      userData.companyId,
    );
    const project = await this.projectsService.getProjectById(
      createUserHistoryDto.projectId,
    );
    return await this.userHistoriesRepository.save({
      project,
      ...createUserHistoryDto,
      tasks: [],
    });
  }

  async updateUserHistory(
    updateUserHistoryDto: UpdateUserHistoryDto,
    id: number,
    userData: PayloadDto,
  ) {
    const userHistory = await this.getUserHistoryWithProject(id);
    await this.validateProjectOwnership(
      userHistory.projectId,
      userData.companyId,
    );

    await this.userHistoriesRepository.update(id, updateUserHistoryDto);
    return this.userHistoriesRepository.findOneBy({ id });
  }

  async deleteUserHistory(id: number, userData: PayloadDto) {
    const userHistory = await this.getUserHistoryWithProject(id);
    await this.validateProjectOwnership(
      userHistory.projectId,
      userData.companyId,
    );

    return await this.userHistoriesRepository.softDelete(id);
  }

  public async getUserHistoryWithProject(id: number): Promise<UserHistory> {
    const userHistory = await this.userHistoriesRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!userHistory) throw new NotFoundException('User history not found');
    return userHistory;
  }

  public async validateProjectOwnership(
    projectId: number,
    userCompanyId: number,
  ): Promise<Project> {
    const project = await this.projectsService.getProjectById(projectId);
    if (!project) throw new NotFoundException('Project not found');
    if (project.companyId !== userCompanyId)
      throw new ForbiddenException('User does not have access to this project');
    return project;
  }
}
