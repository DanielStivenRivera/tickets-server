import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.findByEmail(createUserDto.email)) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    const user = new User();
    user.email = createUserDto.email;
    user.name = createUserDto.name;
    user.password = await bcrypt.hash(createUserDto.password, 10);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }
}
