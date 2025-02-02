import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password: bcrypt.hashSync(loginDto.password, 10),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      const result = await authService.login(loginDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      expect(result).toEqual({ token: 'jwt-token' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = {
        id: 1,
        email: loginDto.email,
        name: 'Test User',
        password: bcrypt.hashSync('password123', 10),
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });
  });

  describe('register', () => {
    it('should return a JWT token after successful registration', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const user = {
        id: 1,
        email: createUserDto.email,
        name: createUserDto.name,
        password: bcrypt.hashSync(createUserDto.password, 10),
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('jwt-token');

      const result = await authService.register(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        name: user.name,
      });
      expect(result).toEqual({ token: 'jwt-token' });
    });
  });

  describe('validate', () => {
    it('should return the payload if the token is valid', async () => {
      const token = 'valid-token';
      const payload = { id: 1, email: 'test@example.com' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);
      jest.spyOn(usersService, 'findById').mockReturnValue(
        Promise.resolve({
          id: 1,
          email: 'test@example.com',
          password: 'pasdas',
          name: 'name',
        }),
      );

      await authService.validate(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException if the token is invalid', async () => {
      const token = 'invalid-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.validate(token)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });
  });
});
