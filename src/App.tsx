import './App.css';
import { useState } from 'react';
import { PostForm } from './rext/demo/ui/PostForm';
import { PostsList } from './rext/demo/ui/PostsList';
import { ServiceProvider } from './rext/providers/ServiceProvider';
import { PostsService } from './rext/demo/modules/posts';
import { UsersService } from './rext/demo';

function AppContent() {
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

const services = [PostsService, UsersService];

function App() {
  return (
    <ServiceProvider services={services}>
      <AppContent />
    </ServiceProvider>
  );
}

export default App;
