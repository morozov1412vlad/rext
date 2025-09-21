import { InjectRepository } from '../../../Repository';
import { AbstractService } from '../../../Service/AbstractService';
import { Service } from '../../../Service/decorator';
import { UsersRepository } from './repository';
import { User } from './types';
import { convert } from '../../../Converter';

@Service()
export class UsersService extends AbstractService {
  @InjectRepository(UsersRepository)
  repo: UsersRepository;

  async get(id: number): Promise<User> {
    const { data } = await this.repo.getUserById(id);
    return convert(User, data);
  }
}
