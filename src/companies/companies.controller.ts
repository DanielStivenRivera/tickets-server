import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllCompanies() {
    return this.companiesService.getAllCompanies();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getCompanyById(@Param('id') id: number) {
    return this.companiesService.getCompanyById(id);
  }
}
