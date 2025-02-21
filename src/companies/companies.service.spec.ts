import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let companyRepository: Repository<Company>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: getRepositoryToken(Company),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    companyRepository = module.get<Repository<Company>>(
      getRepositoryToken(Company),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should return an array of companies with only id and name', async () => {
      const mockCompanies = [
        { id: 1, name: 'Company A' },
        { id: 2, name: 'Company B' },
      ];

      jest
        .spyOn(companyRepository, 'find')
        .mockResolvedValue(mockCompanies as any);

      const result = await service.getAllCompanies();

      expect(companyRepository.find).toHaveBeenCalled();

      expect(result).toEqual(mockCompanies);
    });

    it('should return an empty array if no companies are found', async () => {
      jest.spyOn(companyRepository, 'find').mockResolvedValue([]);

      const result = await service.getAllCompanies();
      expect(companyRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  it('should return a company when search by id', async () => {
    const company: Company = {
      email: 'email',
      name: 'name',
      projects: [],
      nit: 'nit',
      address: 'address',
      phone: 'phone',
      id: 1,
    };
    jest
      .spyOn(companyRepository, 'findOneBy')
      .mockResolvedValue(Promise.resolve(company));
    const resp = await service.getCompanyById(1);
    expect(resp).toEqual(company);
  });
});
