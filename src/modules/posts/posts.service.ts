import { v4 as uuidv4 } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { EntityWithPaginationType, PostType } from '../../types/types';
import { PostsRepository } from './infrastructure/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    blogId: string | null,
    userId,
  ) {
    const postsToSend = this.postsRepository.getPosts(
      page,
      pageSize,
      searchNameTerm,
      blogId,
      userId,
    );
    return postsToSend;
  }

  async getPostById(id: string, userId: string): Promise<PostType | false> {
    //const post = this.postsRepository.getPostById(id);
    const post = this.postsRepository.getPostWithLikesById(id, userId);
    if (post) {
      return post;
    } else return false;
  }

  async createPost(newPostData): Promise<PostType | null> {
    const postToCreate = {
      ...newPostData,
      id: uuidv4(),
    };
    const createdPost = await this.postsRepository.createPost(postToCreate);
    return createdPost;
  }

  async updatePostById(id: string, newPost: PostType) {
    return this.postsRepository.updatePostById(id, newPost);
  }

  async deletePostById(id: string): Promise<boolean> {
    return this.postsRepository.deletePostById(id);
  }

  async updatePostLike(action: string, userId: string, postId: string) {
    const currentDate = new Date();
    const result = this.postsRepository.updatePostLike(
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
    blogId: string | null,
    userId: string | null,
  ): Promise<EntityWithPaginationType<PostType[]>>;

  getPostById(id: string): Promise<PostType | null>;

  createPost(newPostData: PostType): Promise<PostType | null>;

  updatePostById(id: string, newPost: PostType): any;

  deletePostById(id: string): Promise<boolean>;

  getPostWithLikesById(id: string, userId: string): Promise<any>;

  updatePostLike(
    action: string,
    userId: string,
    postId: string,
    addedAt: Date,
  ): Promise<any>;
}

// @Injectable()
// export class PostsService {
//   create(createPostDto: CreateBlogDto) {
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
