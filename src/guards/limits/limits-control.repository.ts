import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { LimitsControlType } from '../../types/types';
import { ObjectId } from 'mongodb';

@Injectable()
export class LimitsRepository implements LimitsRepository {
  constructor(private limitsModel: mongoose.Model<LimitsControlType>) {}

  async addAttempt(ip: string, url: string, time: Date) {
    const result = await this.limitsModel.insertMany([
      {
        userIp: ip,
        url,
        time,
      },
    ]);
    return new ObjectId();
  }

  async removeOldAttempts() {
    const result = await this.limitsModel.deleteMany({});
    return result.deletedCount;
  }

  async getLastAttempts(ip: string, url: string, limitTime: Date) {
    const countAttempts = await this.limitsModel.countDocuments({
      userIp: ip,
      url,
      time: { $gt: limitTime },
    });
    return countAttempts;
  }
}
