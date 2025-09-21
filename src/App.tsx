import './App.css';
import { useState } from 'react';
import { PostForm } from './rext/demo/ui/PostForm';
import { PostsList } from './rext/demo/ui/PostsList';

function App() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [postId, setPostId] = useState<number | undefined>(undefined);

  return isPostFormOpen ? (
    <PostForm
      postId={postId}
      onClose={() => {
        setIsPostFormOpen(false);
        setPostId(undefined);
      }}
    />
  ) : (
    <PostsList
      onPostClick={(id) => {
        setPostId(id);
        setIsPostFormOpen(true);
      }}
      onCreatePost={() => {
        setPostId(undefined);
        setIsPostFormOpen(true);
      }}
    />
  );
}

export default App;
