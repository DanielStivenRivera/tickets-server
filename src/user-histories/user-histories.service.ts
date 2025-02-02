import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserHistory } from './entities/user-history.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from '../projects/projects.service';
import { SearchUserHistoryDto } from './dto/search-user-history.dto';
import { CreateUserHistoryDto } from './dto/create-user-history.dto';
import { UpdateUserHistoryDto } from './dto/update-user-history.dto';

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
      relations: ['tasks'],
    });
  }

  async createUserHistory(createUserHistoryDto: CreateUserHistoryDto) {
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
  ) {
    await this.userHistoriesRepository.update(id, updateUserHistoryDto);
    return this.userHistoriesRepository.findOneBy({ id });
  }

  async deleteUserHistory(id: number) {
    return await this.userHistoriesRepository.softDelete(id);
  }

  async getUserHistoryById(id: number) {
    const userHistory = await this.userHistoriesRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!userHistory) throw new NotFoundException('user history not found');
    return userHistory;
  }

  public async getUserHistoryWithProject(id: number): Promise<UserHistory> {
    const userHistory = await this.userHistoriesRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!userHistory) throw new NotFoundException('User history not found');
    return userHistory;
  }
}
