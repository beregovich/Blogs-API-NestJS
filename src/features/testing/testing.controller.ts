import { Controller, Delete } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Controller('testing')
export class RemoveAllController {
  constructor(private testingRepository: TestingRepository) {}
  @Delete('all-data')
  async removeAll() {
    return await this.testingRepository.deleteAllData();
  }
}
