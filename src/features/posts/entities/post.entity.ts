import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Blog } from '../../blogs/entities/blog.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  shortDescription: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Blog, (blog) => blog.posts)
  blog: Blog;
}
