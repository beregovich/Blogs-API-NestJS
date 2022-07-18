import { v4 as uuidv4 } from 'uuid';
import { EntityWithPaginationType, UserType } from '../types/types';
import { addHours } from 'date-fns';
import { Injectable } from '@nestjs/common';
import { EmailService } from '../notification/email.service';
import { AuthService } from '../auth/auth.service';
import { emailTemplateService } from '../notification/email.manager';
import jwt from 'jsonwebtoken';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: IUsersRepository,
    private authService: AuthService,
    private emailService: EmailService,
  ) {}

  async getUsers(page: number, pageSize: number, searchNameTerm: string) {
    const users = await this.usersRepository.getUsers(
      page,
      pageSize,
      searchNameTerm,
    );
    return users;
  }

  async createUser(
    login: string,
    password: string,
    email: string,
  ): Promise<UserType | null> {
    const passwordHash = await this.authService._generateHash(password);
    const newUser: UserType = {
      accountData: {
        id: uuidv4(),
        login: login,
        email: email,
        passwordHash,
        createdAt: new Date(),
      },
      // loginAttempts: [],
      emailConfirmation: {
        //sentEmails: [],
        confirmationCode: uuidv4(),
        expirationDate: addHours(new Date(), 24),
        isConfirmed: false,
      },
    };
    const createdUser = await this.usersRepository.createUser(newUser);
    if (createdUser) {
      const messageBody = emailTemplateService.getEmailConfirmationMessage(
        createdUser.emailConfirmation.confirmationCode,
      );
      await this.emailService.addMessageInQueue({
        email: newUser.accountData.email,
        message: messageBody,
        subject: 'E-mail confirmation ',
        isSent: false,
        createdAt: new Date(),
      });
      return createdUser;
    } else {
      return null;
    }
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.usersRepository.deleteUserById(id);
  }

  async addRevokedToken(token: string) {
    const secretKey = process.env.JWT_SECRET_KEY;
    try {
      const decoded: any = jwt.verify(token, secretKey!);
      const updatedUser = this.usersRepository.addRevokedToken(
        decoded.userId,
        token,
      );
      return updatedUser;
    } catch (e) {
      console.log('Decoding error: e');
      return null;
    }
  }
}

export interface IUsersRepository {
  getUsers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<UserType[]>>;

  createUser(newUser: UserType): Promise<UserType | null>;

  deleteUserById(id: string): Promise<boolean>;

  findUserById(id: string): Promise<UserType | null>;

  addRevokedToken(id: string, token: string): Promise<UserType | null>;
}
