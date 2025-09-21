import { useCallback } from 'react';
import { useAsyncMethod } from '../../hooks/useAsyncMethod';
import { PostPayload, PostsService, PostUpdatePayload } from '../modules/posts';

export const useInitPost = () => {
  const { get } = PostsService.use();

  const { getPost, post, postLoading } = useAsyncMethod({
    methodKey: 'getPost',
    dataKey: 'post',
    method: get,
  });

  return {
    getPost,
    post,
    postLoading,
  };
};

export const useUpdatePost = () => {
  const { update } = PostsService.use();
  const { updatePost, isLoading } = useAsyncMethod({
    methodKey: 'updatePost',
    method: update,
    throwOnError: true,
  });

  const handleUpdatePost = useCallback(
    async (id: number, payload: PostUpdatePayload) => {
      try {
        await updatePost(id, payload);
      } catch (error) {
        console.error(error);
      }
    },
    [updatePost]
  );

  return {
    handleUpdatePost,
    isLoading,
  };
};

export const useCreatePost = () => {
  const { create } = PostsService.use();
  const { createPost, isLoading } = useAsyncMethod({
    methodKey: 'createPost',
    method: create,
    throwOnError: true,
  });

  const handleCreatePost = useCallback(
    async (payload: PostPayload) => {
      await createPost(payload);
    },
    [createPost]
  );

  return {
    handleCreatePost,
    isLoading,
  };
};
