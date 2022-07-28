import { EmailService } from './email.service';
import { NotificationRepository } from './notification.repository';
import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class Scheduler {
  constructor(
    private emailService: EmailService,
    private notificationRepository: NotificationRepository,
  ) {}
  @Interval(1000)
  async emailSenderRun() {
    const emailToSend = await this.notificationRepository.dequeueMessage();
    if (emailToSend) {
      await this.emailService.sendEmail(
        emailToSend.email,
        emailToSend.subject,
        emailToSend.message,
      );
      await this.notificationRepository.updateMessageStatus(emailToSend._id);
    }
  }
}
