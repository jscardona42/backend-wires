import { User } from 'src/users/entities/user.entity';

export class Message {
  message_id: number;
  title: string;
  content: string;
  created_date: Date;
  updated_date: Date;
  users?: User;
}
