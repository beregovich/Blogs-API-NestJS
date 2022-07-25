import { Controller, Delete } from '@nestjs/common';
import { RemoveAllRepository } from '../../infrastructure/common/remove-all.repository';

@Controller('testing')
export class RemoveAllController {
  constructor(private testingRepository: RemoveAllRepository) {}
  @Delete('all-data')
  async removeAll() {
    return await this.testingRepository.removeAll();
  }
}
