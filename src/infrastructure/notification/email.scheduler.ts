import { EmailService } from './email.service';
import { NotificationRepository } from './notification.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Scheduler {
  constructor(
    private emailService: EmailService,
    private notificationRepository: NotificationRepository,
  ) {}

  async emailSenderRun() {
    const emailToSend = await this.notificationRepository.dequeueMessage();
    if (emailToSend) {
      setTimeout(async () => {
        await this.emailService.sendEmail(
          emailToSend.email,
          emailToSend.subject,
          emailToSend.message,
        );
        await this.notificationRepository.updateMessageStatus(emailToSend._id);
        await this.emailSenderRun();
      }, 1000);
    }
  }
}
