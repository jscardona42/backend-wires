import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SignInUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  createUser(@Body() data: CreateUserDto): Promise<User> {
    return this.usersService.createUser(data);
  }

  @Post('signin')
  signInUser(@Body() data: SignInUserDto): Promise<User> {
    return this.usersService.signInUser(data);
  }

  @Patch('logout')
  logOut(@Body('user_id') user_id: number): Promise<User> {
    return this.usersService.logOut(user_id);
  }
}
