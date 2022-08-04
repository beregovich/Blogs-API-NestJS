import mongoose from 'mongoose';
import { EntityWithPaginationType, UserType } from '../../types/types';
import { Injectable } from '@nestjs/common';
import { addHours } from 'date-fns';
import { IUsersRepository } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectModel('Users') private usersModel: mongoose.Model<UserType>,
  ) {}

  async getUsers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<UserType[]>> {
    const filter = {
      'accountData.login': { $regex: searchNameTerm ? searchNameTerm : '' },
    };
    const users = await this.usersModel
      .find(filter, { projection: { _id: 0, passwordHash: 0 } })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const totalCount = await this.usersModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: users,
    };
  }

  async createUser(newUser: UserType): Promise<UserType | null> {
    await this.usersModel.create(newUser);
    const createdUser = await this.usersModel.findOne({
      'accountData.id': newUser.accountData.id,
    });
    return createdUser ? createdUser : null;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.usersModel.deleteOne({ 'accountData.id': id });
    return result.deletedCount === 1;
  }

  async findUserById(id: string): Promise<UserType | null> {
    const user = await this.usersModel.findOne({ 'accountData.id': id }).lean();
    if (user) {
      return user;
    } else return null;
  }

  async findUserByLogin(login: string): Promise<UserType | null> {
    const user = await this.usersModel
      .findOne({ 'accountData.login': login })
      .lean();
    if (user) {
      return user;
    } else return null;
  }

  async findUserByEmail(email: string): Promise<UserType | null> {
    const user = await this.usersModel.findOne({ 'accountData.email': email });
    if (user) {
      return user;
    } else return null;
  }

  async findUserByConfirmationCode(code: string): Promise<UserType | null> {
    const user = await this.usersModel.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    if (user) {
      return user;
    } else return null;
  }

  async updateConfirmation(id: string) {
    const result = await this.usersModel.updateOne(
      { 'accountData.id': id },
      { $set: { 'emailConfirmation.isConfirmed': true } },
    );
    return result.modifiedCount === 1;
  }

  async updateConfirmationCode(id: string) {
    const updatedUser = await this.usersModel.findOneAndUpdate(
      { 'accountData.id': id },
      {
        $set: {
          'emailConfirmation.confirmationCode': uuidv4(),
          'emailConfirmation.expirationDate': addHours(new Date(), 24),
        },
      },
      { returnDocument: 'after' },
    );
    return updatedUser;
  }

  async addRevokedToken(id: string, token: string): Promise<UserType | null> {
    const updatedUser = this.usersModel.findOneAndUpdate(
      { 'accountData.id': id },
      {
        $push: {
          'accountData.revokedTokens': token.toString(),
        },
      },
      { returnDocument: 'after' },
    );
    return updatedUser.lean();
  }

  async findExistingUser(login: string, email: string) {
    const result = await this.usersModel.findOne({
      $or: [{ 'accountData.login': login }, { 'accountData.email': email }],
    });
    return result;
  }

  async getUserById(id: string) {
    const user = await this.usersModel.findOne({ 'accountData.id': id });
    return user;
  }
}
