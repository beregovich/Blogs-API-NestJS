import { Module } from '@nestjs/common';
import { LikesService } from '../entities/application/likes.service';
import { LikesRepository } from '../infrastructure/likes.repository';

@Module({
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
