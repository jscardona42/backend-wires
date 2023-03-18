import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, SignInUserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Post('signin')
  signInUser(@Body() data: SignInUserDto) {
    return this.usersService.signInUser(data);
  }

  @Patch('logout')
  logOut(@Body("user_id") user_id: number) {
    return this.usersService.logOut(user_id);
  }
}
