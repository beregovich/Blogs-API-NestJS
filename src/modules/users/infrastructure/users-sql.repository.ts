import {
  EntityWithPaginationType,
  UserType,
  UserViewType,
} from '../../../types/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../services/users.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersSqlRepository implements IUsersRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getUsers(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<UserViewType[]>> {
    const users = await this.dataSource.query(
      `
        SELECT to_jsonb("Users") FROM "Users"
        ORDER BY "login" DESC
        OFFSET $1 ROWS FETCH NEXT $2 ROWS ONLY
    `,
      [(page - 1) * pageSize, pageSize],
    );

    const totalCount = await this.dataSource.query(
      `
            SELECT COUNT(login) FROM public."Usesrs"
            `,
    );
    const pagesCount = Math.ceil(totalCount[0].count / pageSize);
    const usersView = users.map((u) => ({
      id: u.id,
      login: u.login,
    }));
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: usersView,
    };
  }

  async createUser(newUser: UserType): Promise<UserType | null> {
    const createdUser = await this.dataSource.query(
      `
        INSERT INTO "Users" ("id", "login", "email", "passwordHash", "createdAt")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ("id", "login",);
    `,
      [
        newUser.accountData.id,
        newUser.accountData.login,
        newUser.accountData.email,
        newUser.accountData.passwordHash,
        newUser.accountData.createdAt,
      ],
    );
    return createdUser;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.dataSource.query(
      `
    DELETE FROM "blogs"
    WHERE id = $1
    `,
      [id],
    );
    if (result[1] === 0)
      throw new NotFoundException({ field: 'id', message: 'not found' });
    return null;
  }

  async addRevokedToken(id: string, token: string): Promise<UserType | null> {
    return Promise.resolve(undefined);
  }

  async findUserById(id: string): Promise<UserType | null> {
    const blog = await this.dataSource.query(
      `
      SELECT to_jsonb("blogs") FROM "blogs"
      WHERE id = $1
      `,
      [id],
    );
    if (blog) {
      return blog[0].to_jsonb;
    } else return null;
  }
}
