import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 255)
  name: string;
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 255)
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, {
    message:
      'Password must contain at least one number, one lowercase letter, one uppercase letter, and at least 8 characters',
  })
  password: string;
}
