import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const mongoUri = process.env.mongoURI || '';
@Module({
  imports: [MongooseModule.forRoot(mongoUri)],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
