import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import {
  CreateMessageDto,
  FilterMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    private prismaService: PrismaService,
    private usersService: UsersService,
  ) {}

  async getMessages(): Promise<any[]> {
    return this.prismaService.messages.findMany({
      include: { users: { select: { fullname: true, user_id: true } } },
    });
  }

  async getMessageById(message_id: number): Promise<any> {
    const message = await this.prismaService.messages.findUnique({
      where: { message_id: message_id },
      include: { users: { select: { fullname: true, user_id: true } } },
    });

    if (message == null) {
      throw new InternalServerErrorException(
        `El mensaje con id ${message_id} no existe`,
      );
    }
    return message;
  }

  async getFilterMessages(data: FilterMessageDto): Promise<any[]> {
    return this.prismaService.messages.findMany({
      where: {
        AND: [
          {
            users: {
              fullname: { contains: data.fullname, mode: 'insensitive' },
            },
          },
          { created_date: new Date(data.created_date) },
        ],
      },
      include: { users: { select: { fullname: true, user_id: true } } },
    });
  }

  async getMessageByUserId(user_id: number): Promise<any[]> {
    await this.usersService.getUserById(user_id);

    return this.prismaService.messages.findMany({
      where: { user_id: user_id },
      include: { users: { select: { fullname: true, user_id: true } } },
    });
  }

  async createMessage(data: CreateMessageDto): Promise<any> {
    await this.usersService.getUserById(data.user_id);

    return this.prismaService.messages.create({
      data: { ...data },
      include: { users: { select: { fullname: true, user_id: true } } },
    });
  }

  async updateMessage(data: UpdateMessageDto): Promise<Message> {
    await this.getMessageById(data.message_id);

    return this.prismaService.messages.update({
      where: { message_id: data.message_id },
      data: {
        title: data.title,
        content: data.content,
        updated_date: new Date(),
      },
    });
  }
}
