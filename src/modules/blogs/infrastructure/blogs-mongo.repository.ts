import { BlogType, EntityWithPaginationType } from '../../../types/types';

import { Injectable } from '@nestjs/common';
import { IBlogsRepository } from '../application/blogs.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BlogsMongoRepository implements IBlogsRepository {
  constructor(
    @InjectModel('Blogs') private blogsModel,
    @InjectModel('Posts') private postsModel,
  ) {}

  async getBlogs(
    page: number,
    pageSize: number,
    searchNameTerm: string,
  ): Promise<EntityWithPaginationType<BlogType[]>> {
    const filter = { name: { $regex: searchNameTerm ? searchNameTerm : '' } };
    const blogs = await this.blogsModel
      .find(filter, { _id: 0, __v: 0 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();
    const totalCount = await this.blogsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: blogs,
    };
  }

  async getBlogById(blogId: string): Promise<BlogType | null> {
    const blog = await this.blogsModel
      .findOne({ id: blogId }, { _id: 0, __v: 0 })
      .lean();
    if (blog) {
      return blog;
    } else return null;
  }

  async createBlog(newblog: BlogType) {
    await this.blogsModel.create(newblog);
    return {
      id: newblog.id,
      name: newblog.name,
      youtubeUrl: newblog.youtubeUrl,
    };
  }

  async updateBlogById(id: string, name: string, youtubeUrl: string) {
    const result = await this.blogsModel.updateOne(
      { id },
      {
        $set: {
          name: name,
          youtubeUrl: youtubeUrl,
        },
      },
    );
    await this.postsModel.updateMany(
      { blogId: id },
      {
        $set: {
          blogName: name,
        },
      },
    );
    return result.modifiedCount === 1;
  }

  async deleteBlogById(id: string): Promise<boolean> {
    const result = await this.blogsModel.deleteOne({ id });
    return result.deletedCount === 1;
  }
}
