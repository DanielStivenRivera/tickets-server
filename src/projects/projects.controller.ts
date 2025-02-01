import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PayloadDto } from '../auth/dto/payload.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  //Return all projects per company
  @Get()
  @UseGuards(JwtAuthGuard)
  getProjects(@CurrentUser() userData: PayloadDto) {
    console.log(userData);
    return this.projectsService.getAllProjects({
      companyId: userData.companyId,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() userData: PayloadDto,
  ) {
    return this.projectsService.createProject(createProjectDto, userData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: number,
    @CurrentUser() user: PayloadDto,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Param('id') id: number, @CurrentUser() user: PayloadDto) {
    return this.projectsService.deleteProject(id, user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProjectById(@Param('id') id: number) {
    console.log(id);
    return this.projectsService.getProjectById(id);
  }
}
