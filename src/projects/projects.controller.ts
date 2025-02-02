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

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getProjects(@Query() company: { companyId: number }) {
    return this.projectsService.getAllProjects({
      companyId: company.companyId,
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(createProjectDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @Param('id') id: number,
  ) {
    return this.projectsService.updateProject(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteProject(@Param('id') id: number) {
    return this.projectsService.deleteProject(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getProjectById(@Param('id') id: number) {
    return this.projectsService.getProjectById(id);
  }
}
