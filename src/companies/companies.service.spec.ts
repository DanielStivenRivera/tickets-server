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

      // Simula el comportamiento del método `find` del repositorio
      jest
        .spyOn(companyRepository, 'find')
        .mockResolvedValue(mockCompanies as any);

      const result = await service.getAllCompanies();

      // Verifica que el método `find` fue llamado con los parámetros correctos
      expect(companyRepository.find).toHaveBeenCalled();

      // Verifica que el resultado es el esperado
      expect(result).toEqual(mockCompanies);
    });

    it('should return an empty array if no companies are found', async () => {
      // Simula que no hay compañías en la base de datos
      jest.spyOn(companyRepository, 'find').mockResolvedValue([]);

      const result = await service.getAllCompanies();

      // Verifica que el método `find` fue llamado con los parámetros correctos
      expect(companyRepository.find).toHaveBeenCalled();

      // Verifica que el resultado es un array vacío
      expect(result).toEqual([]);
    });
  });
});
