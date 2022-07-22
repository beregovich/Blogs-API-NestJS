import { PartialType } from '@nestjs/mapped-types';
import { CreateBloggerDto } from './create-blogger.dto';

export class UpdateBloggerDto extends PartialType(CreateBloggerDto) {}
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
