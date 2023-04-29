import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';

export class UpdateblogDto extends PartialType(CreateBlogDto) {}
/*
class User {
  public name: string;
  public age: number;
}

type UserDBType = {
  _id: string;
  name: string;
  age: number;
  address: { line: string };
};*/

/*
type UserViewType = Omit<User, 'age'>;
const user: UserViewType = {

};
*/
