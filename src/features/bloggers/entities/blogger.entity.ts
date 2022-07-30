import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blogger {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  youtubeUrl: string;
}
