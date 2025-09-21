import { InjectRepository } from '../../../Repository';
import { PostsRepository } from './repository';
import { AbstractService } from '../../../Service/AbstractService';
import { Service } from '../../../Service/decorator';
import { Post, PostListItem, PostPayload, PostUpdatePayload } from './types';
import { convert } from '../../../Converter';
import { InjectSliceService } from '../../../SliceService';
import { PostsSliceService } from './slice';

@Service()
export class PostsService extends AbstractService {
  @InjectRepository(PostsRepository)
  private repo: PostsRepository;

  @InjectSliceService(PostsSliceService)
  private store: InstanceType<typeof PostsSliceService>;

  async list(): Promise<PostListItem[]> {
    const cachedPosts = this.store.getPosts();
    if (cachedPosts.length) {
      return cachedPosts;
    }
    const { data } = await this.repo.getPosts();
    const posts = await Promise.all(
      data.map(async (post) => convert(PostListItem, post))
    );
    this.store.init(posts);
    return posts;
  }

  async create(payload: PostPayload): Promise<Post> {
    const { data } = await this.repo.createPost(payload);
    const post = await convert(Post, data);
    const postListItem = await convert(PostListItem, data);
    this.store.add(postListItem);
    return post;
  }

  async update(id: number, payload: PostUpdatePayload): Promise<Post> {
    const { data } = await this.repo.updatePost(id, payload);
    const post = await convert(Post, data);
    const postListItem = await convert(PostListItem, data);
    this.store.update(postListItem);
    return post;
  }

  async get(id: number): Promise<Post> {
    const { data } = await this.repo.getPostById(id);
    const post = await convert(Post, data);
    return post;
  }
}
