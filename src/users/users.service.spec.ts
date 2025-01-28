import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = new User();
      user.email = createUserDto.email;
      user.name = createUserDto.name;
      user.password = hashedPassword;

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(user);

      const result = await service.create(createUserDto);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
      expect(result).toEqual(user);
    });

    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const existingUser = new User();
      existingUser.email = createUserDto.email;
      existingUser.name = 'Existing User';
      existingUser.password = 'hashedPassword';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        email: createUserDto.email,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.email = email;
      user.name = 'Test User';
      user.password = 'hashedPassword';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(user);

      const result = await service.findByEmail(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';

      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });
});
