import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  FilterMessageDto,
  UpdateMessageDto,
} from './dto/message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(): Promise<Message[]> {
    return this.messagesService.getMessages();
  }

  @Get('filter')
  async getFilterMessages(@Body() data: FilterMessageDto): Promise<Message[]> {
    return this.messagesService.getFilterMessages(data);
  }

  @Get('byuserid')
  async getMessageByUserId(@Body('user_id') user_id: number): Promise<Message> {
    return this.messagesService.getMessageByUserId(user_id);
  }

  @Post('create')
  createMessage(@Body() data: CreateMessageDto): Promise<Message> {
    return this.messagesService.createMessage(data);
  }

  @Patch('update')
  async updateMessage(@Body() data: UpdateMessageDto): Promise<Message> {
    return this.messagesService.updateMessage(data);
  }
}
