import {
  ConvertFrom,
  FromField,
  FromFieldAsync,
  type AdditionalConvertFrom,
} from '../../../Converter';
import { UsersService } from '../users/service';
import type { User } from '../users/types';

export class PostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export class PostPayload {
  title: string;
  body: string;
  userId: number;
}

export class PostUpdatePayload {
  title?: string;
  body?: string;
}

const userService = new UsersService();

export class Post extends ConvertFrom<PostResponse> {
  @FromField('id')
  id: number;

  @FromField('title')
  title: string;

  @FromField('body')
  body: string;

  @FromFieldAsync('userId', async (value: number) => {
    const user = await userService.get(value);
    return user;
  })
  user: User;
}

export class PostListItem extends ConvertFrom<PostResponse> {
  @FromField('id')
  id: number;

  @FromField('title')
  title: string;
}

// Example of defining converter from additional type to existing type:

class MyPost {
  id: number;
  post_title: string;
}

export class PostListItemFromMyPost
  extends ConvertFrom<MyPost>
  implements AdditionalConvertFrom<PostListItem>
{
  @FromField('id')
  id: number;

  @FromField('post_title')
  title: string;
}
