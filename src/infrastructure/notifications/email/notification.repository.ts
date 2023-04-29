import mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { EmailConfirmationMessageType } from '../../../types/types';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel('EmailsQueue')
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
