import { Column, Entity } from 'typeorm';
import { BaseDomainEntity } from '../../core/entities/base-domain.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { IsString, Length, Matches } from 'class-validator';
import { DomainResultNotification } from '../../core/validation/notification';
import { UserDeletedEvent } from '../events/user-deleted.event';

@Entity()
export class User extends BaseDomainEntity {
  @Column()
  login: string;
  @Column()
  email: string;
  @Column()
  password_hash: string;
  @Column()
  is_deleted: boolean;

  static async create(userDto: CreateUserDto, passwordHash: string) {
    const user = new User();
    user.login = userDto.login;
    user.email = userDto.email;
    user.is_deleted = false;
    user.password_hash = passwordHash;
    return user;
  }

  delete(user: User) {
    const domainResultNotification = new DomainResultNotification<User>(this);

    if (this.is_deleted) {
      domainResultNotification.addError(`Client is already deleted`, null, 1);
      return domainResultNotification;
    }
    this.is_deleted = true;
    domainResultNotification.addEvents(new UserDeletedEvent(this.id));
    return domainResultNotification;
  }
}

export const validationsConstants = {
  login: {
    minLength: 2,
    maxLength: 3,
    pattern: /^[a-zA-Z0-9_-]*$/,
  },
  email: {
    pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  password: {
    minLength: 6,
    maxLength: 20,
  },
};

export class CreateUserCommand {
  @IsString()
  @Length(
    validationsConstants.login.minLength,
    validationsConstants.login.maxLength,
  )
  @Matches(validationsConstants.login.pattern)
  public login: string;
  @Matches(validationsConstants.login.pattern)
  public email: string;
  @Length(
    validationsConstants.password.minLength,
    validationsConstants.password.maxLength,
  )
  public password: string;
}
