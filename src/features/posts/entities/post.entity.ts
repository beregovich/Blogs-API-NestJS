import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Blogger } from "../../bloggers/entities/blogger.entity";

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

  @ManyToOne(()=>Blogger, (blogger)=>blogger.posts)
  blogger: Blogger

}
