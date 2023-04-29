import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  youtubeUrl: string;
  @OneToMany(() => Post, (post) => post.blog)
  posts: Post[];
}
