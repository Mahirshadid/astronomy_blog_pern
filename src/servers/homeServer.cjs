const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config({ path: 'src/.env' });

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

// Configure database connection
const pool = new Pool({
  user: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  host: process.env.DB_HOST,
  database: process.env.ADMIN_DB_NAME,
  port: parseInt(process.env.PORT, 10),
});

// Fetch all posts
app.get('/posts', async (req, res) => {
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
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
