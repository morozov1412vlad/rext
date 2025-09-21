import React from 'react';
import { usePosts } from '../hooks/usePosts';
import styles from './styles.module.css';

interface PostsListProps {
  onPostClick: (id: number) => void;
  onCreatePost: () => void;
}

export const PostsList: React.FC<PostsListProps> = ({ onPostClick, onCreatePost }) => {
  const { posts, isLoading, error } = usePosts();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => onPostClick(post.id)}
          className={styles.listItem}
        >
          {post.title}
        </div>
      ))}
      <button onClick={onCreatePost}>Create Post</button>
    </div>
  );
};
