import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { EmailConfirmationMessageType } from '../types/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationRepository {
  constructor(
    private emailsQueueModel: mongoose.Model<EmailConfirmationMessageType>,
  ) {}

  async enqueueMessage(message: EmailConfirmationMessageType) {
    const result = await this.emailsQueueModel.create(message);
    return result.id;
  }

  async dequeueMessage() {
    const message = await this.emailsQueueModel.findOne({ isSent: false });
    return message;
  }

  async updateMessageStatus(id: ObjectId) {
    const result = await this.emailsQueueModel.updateOne(
      { _id: id },
      { $set: { isSent: true } },
    );
    return result.modifiedCount === 1;
  }
}
