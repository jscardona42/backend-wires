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

  async getMessages(): Promise<Message[]> {
    return this.prismaService.messages.findMany({
      include: { users: true },
    });
  }

  async getMessageById(message_id: number): Promise<Message> {
    const message = await this.prismaService.messages.findUnique({
      where: { message_id: message_id },
    });

    if (message == null) {
      throw new InternalServerErrorException(
        `El mensaje con id ${message_id} no existe`,
      );
    }
    return message;
  }

  async getFilterMessages(data: FilterMessageDto): Promise<Message[]> {
    return this.prismaService.messages.findMany({
      where: {
        OR: [
          { users: { fullname: data.fullname } },
          { created_date: { equals: data.created_date } },
        ],
      },
    });
  }

  async getMessageByUserId(user_id: number): Promise<Message> {
    await this.usersService.getUserById(user_id);

    return this.prismaService.messages.findFirst({
      where: { user_id: user_id },
    });
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    await this.usersService.getUserById(data.user_id);

    return this.prismaService.messages.create({
      data: {
        ...data,
      },
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
