import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, SignInUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from 'src/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUserById(user_id: number): Promise<any> {
    const user = await this.prismaService.users.findUnique({
      where: { user_id: user_id },
      select: { fullname: true, email: true, user_id: true, username: true },
    });

    if (user == null) {
      throw new InternalServerErrorException(
        `El usuario con id ${user_id} no existe`,
      );
    }
    return user;
  }

  async createUser(data: CreateUserDto): Promise<any> {
    let salt = await bcrypt.genSalt();
    let password = await bcrypt.hash(data.password, salt);

    try {
      return await this.prismaService.users.create({
        data: {
          fullname: data.fullname,
          email: data.email,
          username: data.username,
          password: password,
          salt: salt,
        },
        select: { username: true, user_id: true, fullname: true, email: true },
      });
    } catch (error) {
      if (error.code == 'P2002') {
        throw new InternalServerErrorException(
          `El ${error.meta.target[0]} ya se encuentra registrado.`,
        );
      }
    }
  }

  async signInUser(data: SignInUserDto): Promise<any> {
    let user = await this.prismaService.users.findFirst({
      where: { username: data.username },
    });

    if (user == null) {
      throw new UnauthorizedException(`Credenciales inválidas`);
    }

    let user2 = await this.prismaService.users.findFirst({
      where: {
        username: data.username,
        password: await bcrypt.hash(data.password, user.salt),
      },
    });

    if (user2 == null) {
      throw new UnauthorizedException(`Credenciales inválidas`);
    }

    const token = this.jwtService.sign({ user_id: user2.user_id });
    return this.saveToken(token, user2);
  }

  async logOut(user_id: number): Promise<any> {
    await this.getUserById(user_id);

    return this.prismaService.users.update({
      where: { user_id: user_id },
      data: { token: null },
      select: { username: true, user_id: true, fullname: true, email: true },
    });
  }

  async saveToken(token: any, user: any): Promise<any>  {
    return this.prismaService.users.update({
      where: { user_id: user.user_id },
      data: { token: token },
      select: {
        username: true,
        user_id: true,
        token: true,
        fullname: true,
        email: true,
      },
    });
  }
}
