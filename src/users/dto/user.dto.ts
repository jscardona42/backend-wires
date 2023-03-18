import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInUserDto {
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}

export class CreateUserDto {
  @IsNotEmpty()
  fullname: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  username: string;
  @IsNotEmpty()
  password: string;
}
