import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskLog } from './entities/task-log.entity';
import { UserHistoriesModule } from '../user-histories/user-histories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, TaskLog]), UserHistoriesModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
