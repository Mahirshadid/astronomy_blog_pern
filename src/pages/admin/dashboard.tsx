import React, { useState, useEffect } from 'react';
import './dashboard.css';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]); // State to store posts from the database
  const [postId, setPostId] = useState<number | null>(null); // State for post ID to update or delete

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handlePostIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostId(Number(e.target.value));
  };

  // Fetch posts from the database on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5001/dashboard/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch post details based on the ID entered
  useEffect(() => {
    const fetchPostById = async () => {
      if (postId) {
        try {
          const response = await fetch(`http://localhost:5001/dashboard/posts/${postId}`);
          const data = await response.json();
  
          if (data && data.id) { // Check if data exists and contains a valid ID
            setTitle(data.title);
            setBody(data.body);
            setImage(null);
            setError(null);  // Clear error if post is found
          } else {
            setError('Post not found');
            // Clear fields if no post found
            setTitle('');
            setBody('');
            setImage(null);
          }
        } catch (error) {
          setError('Error fetching post');
          console.error(error);
          setTitle('');  // Clear title
          setBody('');   // Clear body
          setImage(null); // Clear image
        }
      } else {
        // Reset everything when postId is empty
        setTitle('');
        setBody('');
        setImage(null);
        setError(null);
      }
    };
  
    fetchPostById();
  }, [postId]); // Re-run the effect when postId changes
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required!');
      return;
    }

    if (!body.trim()) {
      setError('Body is required!');
      return;
    }

    if (!image && !postId) {
      setError('Please select an image or enter a post ID to update!');
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    if (image) formData.append('image', image);

    try {
      const method = postId ? 'PUT' : 'POST';
      const url = postId
        ? `http://localhost:5001/dashboard/posts/${postId}`
        : 'http://localhost:5001/dashboard';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Post saved successfully!');
        setTitle('');
        setBody('');
        setImage(null);
        setPostId(null);

        setPosts((prevPosts) =>
          postId ? prevPosts.map((post) => (post.id === postId ? data.post : post)) : [...prevPosts, data.post]
        );
      } else {
        alert('Error submitting post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!postId) {
      setError('Please enter a post ID to delete.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/dashboard/posts/${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        alert('Post deleted successfully!');
        setTitle('');
        setBody('');
        setImage(null);
        setPostId(null);

        // Refresh the posts list
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      } else {
        alert('Error deleting post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to open image in a new window
  const openImageInNewWindow = (imageData: string) => {
    const imageWindow = window.open();
    imageWindow?.document.write(`<img src="${imageData}" alt="Post Image" style="width: 100%; height: auto;" />`);
  };

  return (
    <div className="dashboard_items">
      <h1>Hello, Admin!</h1>
      <form className="dashboard_items_form" onSubmit={handleSubmit}>
        <p>Post your thoughts here:</p>
        <input
          type="text"
          placeholder="Title"
          name="title"
          className="dashboard_items_form_input"
          value={title}
          onChange={handleTitleChange}
        />
        <textarea
          placeholder="Body"
          name="body"
          id="body"
          className="dashboard_items_form_input"
          value={body}
          onChange={handleBodyChange}
        />
        <p>Share a related picture:</p>
        <input
          type="file"
          name="image"
          className="dashboard_items_form_image"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type="submit"
          className="dashboard_items_form_submit"
          value={postId ? "Update Post" : "Post"}
        />
      </form>

      {/* Display error message */}
      {error && <p className="error_message" style={{ color: 'red' }}>{error}</p>}

      {/* Input for post ID to update or delete */}
      <div>
        <h3>Enter Post ID to Update or Delete:</h3>
        <input
          type="number"
          placeholder="Post ID"
          className="dashboard_items_form_input"
          value={postId ?? ''}
          onChange={handlePostIdChange}
        />
        <button type="button" onClick={handleDelete} className="dashboard_items_form_submit">
          Delete Post
        </button>
      </div>

      {/* Posts Table */}
      <h2>Posts</h2>
      <table className="posts_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td>
                  {post.image && (
                    <button
                      onClick={() => openImageInNewWindow(post.image)}
                      style={{ padding: '5px 10px', cursor: 'pointer' }}
                    >
                      View Image
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No posts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
