import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  content: string;
  @IsNotEmpty()
  user_id: number;
}

export class UpdateMessageDto {
  @IsNotEmpty()
  message_id: number;
  title?: string;
  content?: string;
}

export class FilterMessageDto {
  fullname?: string;
  created_date?: Date;
}
