import React, { useEffect, useState } from 'react';
import { useInitPost, useUpdatePost, useCreatePost } from '../hooks/usePost';
import styles from './styles.module.css';

interface PostFormProps {
  postId?: number;
  onClose: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({ postId, onClose }) => {
  const { getPost, post, postLoading } = useInitPost();
  const { handleUpdatePost, isLoading: isUpdating } = useUpdatePost();
  const { handleCreatePost, isLoading: isCreating } = useCreatePost();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (postId) {
      getPost(postId);
    }
  }, [postId, getPost]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const handleSubmit = async () => {
    if (postId) {
      await handleUpdatePost(postId, { title, body });
    } else {
      await handleCreatePost({ title, body, userId: 1 });
    }
    onClose();
  };

  if (postLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.form}>
      <h2>{postId ? 'Edit Post' : 'Create Post'}</h2>
      <textarea
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.textarea}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className={styles.textarea}
      />
      {postId && (
        <p>
          {post?.user.firstName} {post?.user.lastName} {post?.user.contactInfo.email}
        </p>
      )}
      <button onClick={onClose}>Cancel</button>
      <button onClick={handleSubmit} disabled={isUpdating || isCreating}>
        Submit
      </button>
    </div>
  );
};
