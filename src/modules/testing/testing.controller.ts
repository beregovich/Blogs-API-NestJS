import { Controller, Delete, HttpCode, Inject } from '@nestjs/common';
import { TestingMongoRepository } from './testing-mongo.repository';

@Controller('testing')
export class RemoveAllController {
  //   constructor(@Inject('TestingRepository') private testingRepository: ITestingRepository) {}
  //   @HttpCode(204)
  //   @Delete('all-data')
  //   async removeAll() {
  //     return await this.testingRepository.deleteAllData();
  //  }
}
export interface ITestingRepository {
  deleteAllData(): void;
}
