import React, { useState, useEffect } from 'react';
import './home.css';

interface Post {
  id: number;
  title: string;
  body: string;
  image: string | null; // Base64-encoded image or null
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5002/posts');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home_contents">
      {error && <p className="error_message">{error}</p>}
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post">
            {post.image && <img src={post.image} alt={post.title} className="post_image" />}
            <h2 className="post_title">{post.title}</h2>
            <p className="post_body">{post.body}</p>
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Home;
