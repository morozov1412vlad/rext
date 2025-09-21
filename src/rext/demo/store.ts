import { configureAppStore } from '../SliceService/configureAppStore';
import { PostsSliceService } from './modules/posts';
import { combineSlices } from '@reduxjs/toolkit';

const rootReducer = combineSlices(PostsSliceService.slice);

export const store = configureAppStore({
  reducer: rootReducer,
});
