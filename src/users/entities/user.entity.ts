export class User {
  user_id: number;
  fullname: string;
  email: string;
  username: string;
  password: string;
  salt: string;
  token?: string;
}
