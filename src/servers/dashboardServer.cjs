const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const app = express();
const port = 5001;

require('dotenv').config({ path: 'src/.env' });

app.use(cors());
app.use(bodyParser.json());

const storage = multer.memoryStorage(); // Store image in memory
const upload = multer({ storage });

const user = process.env.DB_USER;
const password = String(process.env.DB_PASS);
const host = process.env.DB_HOST;
const database = process.env.ADMIN_DB_NAME;
const dbport = process.env.PORT;

const pool = new Pool({
  user: user,
  password: password,
  host: host,
  database: database,
  port: parseInt(dbport, 10),
});

console.log({
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  ADMIN_DB_NAME: process.env.ADMIN_DB_NAME,
  PORT: process.env.PORT,
});

// POST: Handle form submission (store post with image)
app.post('/dashboard', upload.single('image'), async (req, res) => {
  const { title, body } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  if (!title || !body || !imageBuffer) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields (title, body, image).',
    });
  }

  try {
    // Insert the form data including the image into the database
    const result = await pool.query(
      'INSERT INTO posts (title, body, image) VALUES ($1, $2, $3) RETURNING *',
      [title, body, imageBuffer]
    );

    res.status(200).json({
      success: true,
      message: 'Post created successfully!',
      post: result.rows[0],
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET: Fetch all posts (including image URLs)
app.get('/dashboard/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title, body, image FROM posts');

    const posts = result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body,
      image: row.image ? `data:image/*;base64,${row.image.toString('base64')}` : null,
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Get post by ID
app.get('/dashboard/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    const post = result.rows[0];
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
});

// Update post
app.put('/dashboard/posts/:id', upload.single('image'), async (req, res) => {
  const { title, body } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;
  const postId = req.params.id;

  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: 'Title and body are required!',
    });
  }

  try {
    const query = `
      UPDATE posts SET title = $1, body = $2, image = $3
      WHERE id = $4 RETURNING *`;
    const values = [title, body, imageBuffer, postId];

    const result = await pool.query(query, values);
    const updatedPost = result.rows[0];

    if (updatedPost) {
      res.status(200).json({ success: true, post: updatedPost });
    } else {
      res.status(404).json({ success: false, message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ success: false, message: 'Error updating post' });
  }
});

// Delete post
app.delete('/dashboard/posts/:id', async (req, res) => {
  const postId = req.params.id;

  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [postId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ success: false, message: 'Error deleting post' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
