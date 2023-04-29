import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { JoinColumn } from 'typeorm/browser';

@Entity()
export class UserAuthEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column()
  password_hash: string;
  @Column()
  is_banned: boolean;
  @Column()
  is_confirmed: boolean;
}
