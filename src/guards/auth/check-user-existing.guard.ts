import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { LimitsRepository } from '../limits/limits-control.repository';
import { UsersRepository } from '../../features/users/users.repository';

export class LimitsControlGuard implements CanActivate {
  constructor(
    private limitsRepository: LimitsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request = context.switchToHttp().getRequest();
    const login = request.body.login;
    const email = request.body.email;
    const userWithExistingEmail = await this.usersRepository.findUserByEmail(
      email,
    );
    const userWithExistingLogin = await this.usersRepository.findUserByLogin(
      login,
    );
    if (userWithExistingEmail)
      throw new BadRequestException({
        message: 'email already exist',
        field: 'email',
      });
    if (userWithExistingLogin)
      throw new BadRequestException({
        message: 'login already exist',
        field: 'login',
      });
    return true;
  }
}
