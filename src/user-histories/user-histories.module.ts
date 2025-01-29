import { Module } from '@nestjs/common';
import { UserHistoriesService } from './user-histories.service';
import { UserHistoriesController } from './user-histories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHistory } from './entities/user-history.entity';
import { ProjectsModule } from '../projects/projects.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserHistory]),
    ProjectsModule,
    CompaniesModule,
  ],
  providers: [UserHistoriesService],
  controllers: [UserHistoriesController],
})
export class UserHistoriesModule {}
