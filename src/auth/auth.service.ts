import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PayloadDto } from './dto/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return {
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: user.companyId,
      }),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        companyId: user.companyId,
      }),
    };
  }

  async validate(token: string) {
    try {
      const payload: PayloadDto = this.jwtService.verify(token);
      const user = await this.usersService.findById(payload.id);
      if (!user || payload.email !== user.email) {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
