
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class TestingSQLRepository {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async deleteAllData() {
    await this.dataSource.query(`
    TRUNCATE "Bloggers", "Users" CASCADE;
    `)
    return null;
  }
}
