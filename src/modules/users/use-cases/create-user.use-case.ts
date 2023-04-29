import { CreateUserDto } from '../dto/create-user.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async execute(userDto: CreateUserDto) {
    const passwordHash = await this._generateHash(userDto.password);
    const user = await User.create(userDto, passwordHash);
    return this.userRepository.save(user);
  }

  private async _generateHash(password: string) {
    return bcrypt.hash(password, 10);
  }
}
