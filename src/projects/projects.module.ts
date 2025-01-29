import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { CompaniesModule } from '../companies/companies.module';
import { CompaniesService } from '../companies/companies.service';

@Module({
  providers: [ProjectsService],
  controllers: [ProjectsController],
  imports: [TypeOrmModule.forFeature([Project]), CompaniesModule],
  exports: [TypeOrmModule, ProjectsService],
})
export class ProjectsModule {}
