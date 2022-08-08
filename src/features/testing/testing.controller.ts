import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller('testing')
export class RemoveAllController {
  constructor(private testingRepository: TestingRepository) {}
  @HttpCode(204)
  @Delete('all-data')
  async removeAll() {
    return await this.testingRepository.deleteAllData();
  }
}
