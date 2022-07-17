import { BloggerType, PostType } from '../types/types';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IPostsRepository } from './posts.service';
import { BloggersRepository } from '../bloggers/bloggers.repository';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectModel('Posts') private postsModel,
    @InjectModel('Bloggers') private bloggersModel,
  ) {}

  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null,
  ) {
    const filter = bloggerId
      ? { title: { $regex: searchNameTerm ? searchNameTerm : '' }, bloggerId }
      : { title: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const totalCount = await this.postsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const allPosts = await this.postsModel
      .find(filter, { _id: 0, __v: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: allPosts,
    };
  }

  async getPostById(id: string) {
    const post = await this.postsModel.findOne({ id }, { _id: 0, __v: 0 });
    if (!post) return false;
    // const blogger = await this.bloggersRepository.getBloggerById(
    //   post.bloggerId,
    // );
    // if (!blogger) return false;
    // const bloggerName = blogger.name;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      //bloggerName,
    };
  }

  async createPost(newPost: PostType): Promise<PostType | null> {
    const blogger = await this.bloggersModel.findOne({ id: newPost.bloggerId });
    if (!blogger) return null;
    await this.postsModel.create({
      ...newPost,
      bloggerName: blogger.name,
    });
    const postToReturn = await this.postsModel.findOne(
      { id: newPost.id },
      { _id: 0, __v: 0 },
    );
    return postToReturn;
  }

  async updatePostById(id: string, newPost: PostType) {
    const result = await this.postsModel.updateOne(
      { id },
      {
        $set: {
          title: newPost.title,
          shortDescription: newPost.shortDescription,
          content: newPost.content,
          bloggerId: newPost.bloggerId,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async deletePostById(id: string) {
    const result = await this.postsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
