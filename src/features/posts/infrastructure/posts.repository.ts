import { BloggerType, PostType } from '../../../types/types';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../posts.service';
import { BloggersRepository } from '../../bloggers/infrastructure/bloggers.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BloggersService } from '../../bloggers/application/bloggers.service';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectModel('Posts') private postsModel,
    @InjectModel('Bloggers') private bloggersModel,
    @InjectModel('PostsLikes') private postsLikesModel,
    private readonly bloggersService: BloggersService,
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
      .find(filter, { _id: 0, __v: 0, PostsLikes: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const postsIds = allPosts.map((el) => el.id);
    const likesForCurrentPosts = await this.postsLikesModel.find({
      postId: { $in: postsIds },
    });
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
    const blogger = await this.bloggersService.getBloggerById(post.bloggerId);
    if (!blogger) return false;
    const bloggerName = blogger.name;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName,
    };
  }

  async getPostWithLikesById(id: string) {
    const post = await this.postsModel.findOne({ id }, { _id: 0, __v: 0 });
    const likes = await this.postsLikesModel
      .find({ postId: id }, '-_id -__v')
      .sort({ lastActionAt: -1 });
    const currentUserLikeStatus = likes.find((l) => l.postId === id);
    // .populate({
    //   path: 'PostsLikes',
    //   match: { postId: id },
    //   select: 'userId login action lastActionAt postId',
    // });
    // .aggregate([
    //   //{ $match: { id } },
    //   {
    //     $lookup: {
    //       from: 'PostsLikes',
    //       localField: 'id',
    //       foreignField: 'postId',
    //       as: 'likes',
    //     },
    //   },
    //{ $group: { _id: '$action', count: { $count: {} } } },
    // ])
    // .exec();
    if (!post) return false;
    const blogger = await this.bloggersService.getBloggerById(post.bloggerId);
    //if (!blogger) return false;
    const bloggerName = blogger?.name;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName,
      extendedLikesInfo: {
        likesCount: likes.filter((l) => l.action === 'Like').length,
        dislikesCount: likes.filter((l) => l.action === 'Dislike').length,
        myStatus: currentUserLikeStatus ? currentUserLikeStatus.action : 'None',
        newestLikes: likes.slice(0, 3),
      },
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
