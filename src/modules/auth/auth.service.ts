import { Inject, Injectable } from '@nestjs/common';
import { isAfter } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { EmailService } from '../../infrastructure/notifications/email/email.service';
import { emailTemplateService } from '../../infrastructure/notifications/email/email.manager';
import { AppSettings } from '../../settings/app-settings';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private usersRepository: UsersRepository,
    @Inject(AppSettings.name)
    private readonly appSettings: AppSettings,
  ) {}

  createJwtTokensPair(userId: string, login: string | null) {
    const accessSecretKey = this.appSettings.auth.ACCESS_JWT_SECRET_KEY;
    const refreshSecretKey = this.appSettings.auth.REFRESH_JWT_SECRET_KEY;
    const payload: { userId: string; date: Date; login: string | null } = {
      userId,
      date: new Date(),
      login,
    };
    const accessToken = jwt.sign(payload, accessSecretKey, { expiresIn: '1d' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, {
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async checkCredentials(login: string, password: string) {
    const user = await this.usersRepository.findUserByLogin(login);
    if (!user /*|| !user.emailConfirmation.isConfirmed*/)
      return {
        resultCode: 1,
        data: {
          accessToken: null,
          refreshToken: null,
        },
      };
    const isHashesEquals = await this._isPasswordCorrect(
      password,
      user.accountData.passwordHash,
    );
    if (isHashesEquals) {
      const tokensPair = this.createJwtTokensPair(
        user.accountData.id,
        user.accountData.login,
      );
      return {
        resultCode: 0,
        data: tokensPair,
      };
    } else {
      return {
        resultCode: 1,
        data: {
          token: {
            accessToken: null,
            refreshToken: null,
          },
        },
      };
    }
  }

  async _isPasswordCorrect(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);
    if (!user || user.emailConfirmation.isConfirmed) return false;
    const dbCode = user.emailConfirmation.confirmationCode;
    const dateIsExpired = isAfter(
      user.emailConfirmation.expirationDate,
      new Date(),
    );
    if (dbCode === code && dateIsExpired) {
      const result = await this.usersRepository.updateConfirmation(
        user.accountData.id,
      );
      return result;
    }
    return false;
  }

  async resendCode(email: string) {
    const user = await this.usersRepository.findUserByEmail(email);
    if (!user || user.emailConfirmation.isConfirmed) return null;
    const updatedUser = await this.usersRepository.updateConfirmationCode(
      user.accountData.id,
    );
    if (updatedUser) {
      const messageBody = emailTemplateService.getEmailConfirmationMessage(
        updatedUser.emailConfirmation.confirmationCode,
      );
      await this.emailService.addMessageInQueue({
        email: updatedUser.accountData.email,
        message: messageBody,
        subject: 'E-mail confirmation ',
        isSent: false,
        createdAt: new Date(),
      });
      return true;
    }
    return null;
  }
}
