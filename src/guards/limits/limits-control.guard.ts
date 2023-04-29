import { UsersRepository } from '../../modules/users/infrastructure/users.repository';
import { LimitsRepository } from './limits-control.repository';
import { ObjectId } from 'mongodb';
import { ErrorMessageType } from '../../types/types';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LimitsControlGuard implements CanActivate {
  constructor(
    private limitsRepository: LimitsRepository,
    private usersRepository: UsersRepository,
  ) {}
  private readonly limitInterval = 10 * 1000; //10sec 1000ms
  async canActivate(context: ExecutionContext): Promise<boolean> | null {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const url = request.url;
    const currentTime: Date = new Date();
    const limitTime: Date = new Date(
      currentTime.getTime() - this.limitInterval,
    );
    const countAttempts = await this.limitsRepository.getLastAttempts(
      ip,
      url,
      limitTime,
    );
    await this.limitsRepository.addAttempt(ip, url, currentTime);
    if (countAttempts > 4) throw new ForbiddenException();
    return true;
  }
}
export interface ILimitsRepository {
  addAttempt(ip: string, hostname: string, time: Date): Promise<ObjectId>;

  removeOldAttempts(): Promise<number>;

  getLastAttempts(
    ip: string,
    hostname: string,
    currentTime: Date,
  ): Promise<number>;
}
