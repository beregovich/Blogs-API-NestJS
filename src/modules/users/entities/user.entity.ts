import { Column, Entity } from 'typeorm';
import { BaseDomainEntity } from '../../core/entities/base-domain.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Entity()
export class User extends BaseDomainEntity {
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  is_deleted: boolean;
  // static async create(userDto: CreateUserDto) {
  //   this.login = userDto.login;
  //   this.email = userDto.email;
  //   this.is_deleted = false;
  // }
}
