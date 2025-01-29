import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Company])],
  providers: [CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesService, TypeOrmModule],
})
export class CompaniesModule {}
