import { client } from '../../axios';
import { Get, GetById, Repository } from '../../../Repository';
import { UserResponse } from './types';
import type { AxiosResponse } from 'axios';

@Repository('/users', client)
export class UsersRepository {
  @Get()
  getUsers: () => Promise<AxiosResponse<UserResponse[]>>;

  @GetById()
  getUserById: (id: number) => Promise<AxiosResponse<UserResponse>>;
}
