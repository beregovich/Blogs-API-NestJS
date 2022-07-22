import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from '../../infrastructure/notification/email.service';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, EmailService],
})
export class AuthModule {}
