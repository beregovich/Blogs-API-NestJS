import { BloggerType, LikeAction, PostType } from '../../../types/types';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { IPostsRepository } from '../posts.service';
import { BloggersRepository } from '../../bloggers/infrastructure/bloggers.repository';
import { InjectModel } from '@nestjs/mongoose';
import { BloggersService } from '../../bloggers/application/bloggers.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class PostsRepository implements IPostsRepository {
  constructor(
    @InjectModel('Posts') private postsModel,
    @InjectModel('Bloggers') private bloggersModel,
    @InjectModel('PostsLikes') private postsLikesModel,
    private readonly usersService: UsersService,
    private readonly bloggersService: BloggersService,
  ) {}

  async getPosts(
    page: number,
    pageSize: number,
    searchNameTerm: string,
    bloggerId: string | null,
    userId: string | null,
  ) {
    const filter = bloggerId
      ? { title: { $regex: searchNameTerm ? searchNameTerm : '' }, bloggerId }
      : { title: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const totalCount = await this.postsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const allPosts = await this.postsModel
      .find(filter, {
        _id: 0,
        __v: 0,
        PostsLikes: 0,
        'extendedLikesInfo._id': 0,
      })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const formattedPosts = allPosts.map((post) => {
      const likes = post.extendedLikesInfo;
      const currentUserLikeStatus = likes.find((l) => l.userId === userId);
      const likesCount = likes.filter((l) => l.action === 'Like').length;
      const dislikesCount = likes.filter((l) => l.action === 'Dislike').length;
      return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        bloggerId: post.bloggerId,
        extendedLikesInfo: {
          likesCount: likesCount,
          dislikesCount: dislikesCount,
          myStatus: currentUserLikeStatus
            ? currentUserLikeStatus.action
            : 'None',
          newestLikes: likes
            .reverse()
            .slice(0, 3)
            .map((like) => ({
              addedAt: like.addedAt,
              userId: like.userId,
              login: like.login,
            })),
        },
      };
    });
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: formattedPosts,
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

  async getPostWithLikesById(id: string, userId) {
    // const post = await this.postsModel.aggregate([
    //   { $match: { id } },
    //   { $project: { _id: 0, __v: 0 } },
    //
    //   // {
    //   //   $group: {
    //   //     _id: '$extendedLikesInfo.action',
    //   //     likesCount: { $count: {} },
    //   //   },
    //   // },
    //
    //   {
    //     $addFields: {
    //       likesCount: {
    //         $size: {
    //           filter: {
    //             input: { $ifNull: ['$extendedLikesInfo', []] },
    //             cond: { $eq: ['$this.action', 'Like'] },
    //           },
    //         },
    //       },
    //       //       // $filter: {
    //       //       //   input: '$extendedLikesInfo',
    //       //       //   as: 's',
    //       //       //   cond: { $eq: ['$$s.action', 'Dislike'] },
    //       //       // },
    //     },
    //   },
    // ]);

    //
    const post = await this.postsModel
      .findOne(
        { id },
        {
          _id: 0,
          __v: 0,
          'extendedLikesInfo._id': 0,
        },
      )
      .lean();
    const likes = post.extendedLikesInfo;
    const currentUserLikeStatus = likes.find((l) => l.userId === userId);
    if (!post) return false;
    const blogger = await this.bloggersService.getBloggerById(post.bloggerId);
    if (!blogger) return false;
    const bloggerName = blogger?.name;
    const likesCount = likes.filter((l) => l.action === 'Like').length;
    const dislikesCount = likes.filter((l) => l.action === 'Dislike').length;
    return {
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      bloggerId: post.bloggerId,
      bloggerName,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: currentUserLikeStatus ? currentUserLikeStatus.action : 'None',
        newestLikes: likes.reverse().slice(0, 3),
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

  async updatePostLike(
    action: LikeAction,
    userId: string,
    postId: string,
    addedAt: Date,
  ) {
    if (action == LikeAction.None) {
      await this.postsModel.updateOne(
        {
          postId,
        },
        { $pull: { extendedLikesInfo: { userId } } },
      );
    } else {
      const user = await this.usersService.getUserById(userId);
      const result = await this.postsModel.updateOne(
        { postId },
        {
          $push: {
            extendedLikesInfo: {
              action: action,
              userId: userId,
              login: user.accountData.login,
              addedAt,
            },
          },
        },
      );
      return result;
    }
    return;
  }
}
