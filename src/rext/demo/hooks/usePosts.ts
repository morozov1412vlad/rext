import { useSelector } from 'react-redux';
import { useAsyncMethod } from '../../hooks/useAsyncMethod';
import { PostsService, PostsSliceService } from '../modules/posts';
import { useEffect } from 'react';

export const usePosts = () => {
  const posts = useSelector(PostsSliceService.getPosts);
  const { list } = PostsService.use();
  const { listPosts, isLoading, error } = useAsyncMethod({
    methodKey: 'listPosts',
    method: list,
  });

  useEffect(() => {
    listPosts();
  }, [listPosts]);

  return {
    posts,
    isLoading,
    error,
  };
};
