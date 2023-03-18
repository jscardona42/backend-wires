import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  message_id: number;
  title?: string;
  content?: string;
}

export class FilterMessageDto {
  fullname?: string;
  created_date?: Date;
  created_time?: Date;
}
