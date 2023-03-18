import { Module } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { MessagesService } from './messages/messages.service';
import { UsersController } from './users/users.controller';
import { MessagesController } from './messages/messages.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRESIN,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [UsersController, MessagesController],
  providers: [UsersService, MessagesService, PrismaService],
})
export class AppModule {}
