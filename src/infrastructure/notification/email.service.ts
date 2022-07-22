import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { EmailConfirmationMessageType } from '../../types/types';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class EmailService {
  constructor(private notificationRepository: NotificationRepository) {}

  async sendEmail(email: string, subject: string, message: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // the service used
      auth: {
        user: process.env.EMAIL_FROM, // authentication details of sender, here the details are coming from .env file
        pass: process.env.EMAIL_FROM_PASSWORD,
      },
    });
    try {
      await transporter.sendMail(
        {
          from: 'From me to You',
          to: email,
          subject: subject,
          html: message,
        },
        (err) => err,
      );
    } catch (e) {
      console.log('sendMail function error: ' + e);
    }
  }

  async addMessageInQueue(message: EmailConfirmationMessageType) {
    const result = await this.notificationRepository.enqueueMessage(message);
    return result;
  }
}
