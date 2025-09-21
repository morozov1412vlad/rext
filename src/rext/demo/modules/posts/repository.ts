import { client } from '../../axios';
import { Get, Repository, GetById, Post, PatchById } from '../../../Repository';
import type { PostPayload, PostResponse, PostUpdatePayload } from './types';
import type { AxiosResponse } from 'axios';

@Repository('/posts', client)
export class PostsRepository {
  @Get()
  getPosts: () => Promise<AxiosResponse<PostResponse[]>>;

  @GetById()
  getPostById: (id: number) => Promise<AxiosResponse<PostResponse>>;

  @Post()
  createPost: (post: PostPayload) => Promise<AxiosResponse<PostResponse>>;

  @PatchById()
  updatePost: (
    id: number,
    data: PostUpdatePayload
  ) => Promise<AxiosResponse<PostResponse>>;
}
