const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5001;

require('dotenv').config({ path: 'src/.env' });

app.use(cors());
app.use(bodyParser.json());

// Setup multer for handling form-data, but we won't save the file locally
const storage = multer.memoryStorage();  // Store image in memory, not in a file
const upload = multer({ storage });

// Database connection setup
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

// Handle POST request to submit form data (including image as BYTEA)
app.post('/dashboard', upload.single('image'), async (req, res) => {
  const { title, body } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null; // Get the image as buffer

  if (!imageBuffer) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an image.',
    });
  }

  try {
    // Insert the form data including the image into the database
    const result = await pool.query(
      'INSERT INTO posts (title, body, image) VALUES ($1, $2, $3) RETURNING *',
      [title, body, imageBuffer] // Insert the image as BYTEA
    );

    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        message: 'Post created successfully!',
        post: result.rows[0],
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Failed to create post',
      });
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
