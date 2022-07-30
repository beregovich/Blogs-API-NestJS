import { Length, Matches } from 'class-validator';

export class RegistrationDto {
  @Length(3, 30)
  login: string;
  @Length(3, 30)
  password: string;
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
