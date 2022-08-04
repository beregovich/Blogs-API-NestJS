import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  EntityWithPaginationType,
  LikeAction,
  PostType,
} from '../../types/types';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsSqlRepository } from './infrastructure/posts-sql.repository';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null,
  ) {
    const postsToSend = this.postsRepository.getPosts(
      page,
      pageSize,
      searchNameTerm,
      bloggerId,
    );
    return postsToSend;
  }

  async getPostById(id: string): Promise<PostType | false> {
    //const post = this.postsRepository.getPostById(id);
    const post = this.postsRepository.getPostWithLikesById(id);
    if (post) {
      return post;
    } else return false;
  }

  async createPost(newPostData: PostType): Promise<PostType | null> {
    const postToCreate = {
      ...newPostData,
      id: uuidv4(),
    };
    return this.postsRepository.createPost(postToCreate);
  }

  async updatePostById(id: string, newPost: PostType) {
    return this.postsRepository.updatePostById(id, newPost);
  }

  async deletePostById(id: string): Promise<boolean> {
    return this.postsRepository.deletePostById(id);
  }

  async updatePostLike(action: LikeAction, userId: string, postId: string) {
    const currentDate = new Date();
    const result = await this.postsRepository.updatePostLike(
      action,
      userId,
      postId,
      currentDate,
    );
    return result;
  }
}

export interface IPostsRepository {
  getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null,
  ): Promise<EntityWithPaginationType<PostType[]>>;

  getPostById(id: string): Promise<PostType | false>;

  createPost(newPostData: PostType): Promise<PostType | null>;

  updatePostById(id: string, newPost: PostType): any;

  deletePostById(id: string): Promise<boolean>;
}

// @Injectable()
// export class PostsService {
//   create(createPostDto: CreateBloggerDto) {
//     return 'This action adds a new post';
//   }
//
//   findAll() {
//     return `This action returns all posts`;
//   }
//
//   findOne(id: number) {
//     return `This action returns a #${id} post`;
//   }
//
//   update(id: number, updatePostDto: UpdatePostDto) {
//     return `This action updates a #${id} post`;
//   }
//
//   remove(id: number) {
//     return `This action removes a #${id} post`;
//   }
// }
