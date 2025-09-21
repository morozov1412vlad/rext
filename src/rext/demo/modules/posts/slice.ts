import type { PayloadAction } from '@reduxjs/toolkit';
import { createSliceService } from '../../../SliceService/createSliceService';
import type { PostListItem } from './types';

interface PostsState {
  posts: PostListItem[];
}

const initialState: PostsState = {
  posts: [],
};

export const PostsSliceService = createSliceService({
  name: 'posts',
  initialState: initialState,
  reducers: {
    init: (state, action: PayloadAction<PostListItem[]>) => {
      state.posts = action.payload;
    },
    add: (state, action: PayloadAction<PostListItem>) => {
      state.posts = [action.payload, ...state.posts];
    },
    update: (state, action: PayloadAction<PostListItem>) => {
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    },
  },
  selectors: {
    getPosts: (state) => state.posts,
  },
});
