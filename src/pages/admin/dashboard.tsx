import React, { useState } from 'react';

const Dashboard = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

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

    if (!image) {
      setError('Please select an image!');
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:5001/dashboard', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('Post submitted successfully!');
        setTitle('');
        setBody('');
        setImage(null);
      } else {
        alert('Error submitting post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='dashboard_items'>
      <form className='dashboard_items_form' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Title'
          name='title'
          className='dashboard_items_form_input'
          value={title}
          onChange={handleTitleChange}
        />
        <input
          type='text'
          placeholder='Body'
          name='body'
          className='dashboard_items_form_input'
          value={body}
          onChange={handleBodyChange}
        />
        <input
          type='file'
          name='image'
          className='dashboard_items_form_input'
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          type='submit'
          className='dashboard_items_form_submit'
          value="Post"
        />
      </form>

      {/* Display error message */}
      {error && <p className="error_message" style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;