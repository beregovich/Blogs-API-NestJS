import { Injectable } from '@nestjs/common';
import { isAfter } from 'date-fns';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../users/users.repository';
import { EmailService } from '../../infrastructure/notification/email.service';
import { emailTemplateService } from '../../infrastructure/notification/email.manager';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private usersRepository: UsersRepository,
  ) {}

  createJwtTokensPair(userId: string) {
    const secretKey = process.env.JWT_SECRET_KEY || 'topSecretKey';
    const payload: { userId: string; date: Date } = {
      userId,
      date: new Date(),
    };
    const accessToken = jwt.sign(payload, secretKey, { expiresIn: '10s' });
    const refreshToken = jwt.sign(payload, secretKey, { expiresIn: '20s' });
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
      const tokensPair = this.createJwtTokensPair(user.accountData.id);
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

  async _generateHash(password: string) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  async _isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
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
