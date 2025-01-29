import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: {
            getAllCompanies: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    companiesService = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCompanies', () => {
    it('should return an array of companies', async () => {
      const result: Company[] = [
        {
          id: 1,
          name: 'Company A',
          users: [],
          nit: '1231232',
          address: 'address',
          phone: '12312222',
          email: 'email',
        },
        {
          id: 2,
          name: 'Company B',
          users: [],
          nit: '1231232',
          address: 'address',
          phone: '12312222',
          email: 'email',
        },
      ];
      jest.spyOn(companiesService, 'getAllCompanies').mockResolvedValue(result);

      expect(await controller.getAllCompanies()).toEqual(result);
      expect(companiesService.getAllCompanies).toHaveBeenCalled();
    });
  });
});
