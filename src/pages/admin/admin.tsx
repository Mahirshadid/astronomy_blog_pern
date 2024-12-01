import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

const Admin = () => {

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setError('Both fields are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to a different page on successful login
        navigate('/dashboard'); // Adjust the route as needed
      } else {
        // Show an error message
        setError(result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred while trying to log in.');
    }
  };

  return (
    <div className='admin_login'>
      <form className='admin_login_form' onSubmit={handleSubmit}>
        <input type='text' placeholder='Username' name='username' className='admin_login_form_input' 
          value={formData.username}
          onChange={handleChange} />
        <input type='password' placeholder='Password' name='password' className='admin_login_form_input' 
          value={formData.password}
          onChange={handleChange} />
        <input type='submit' className='admin_login_form_submit' value="Login"/>
        {error && <p className="error_message">{error}</p>}
      </form>
    </div>
  )
}

export default Admin