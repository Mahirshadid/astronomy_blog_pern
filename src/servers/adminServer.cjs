const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const port = 5000;

require('dotenv').config({ path: 'src/.env' });

app.use(cors());
app.use(bodyParser.json());

const user = process.env.DB_USER;
const password = String(process.env.DB_PASS);
const host = process.env.DB_HOST;
const database = process.env.ADMIN_DB_NAME;
const dbport = process.env.PORT;

const pool = new Pool({
  user:user,
  password:password,
  host:host,
  database:database,
  port:parseInt(dbport, 10),
});

console.log({
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  ADMIN_DB_NAME: process.env.ADMIN_DB_NAME,
  PORT: process.env.PORT,
});

// Endpoint for login verification
app.post('/admin', async (req,  res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      // Login successful
      res.status(200).send({ success: true, message: 'Login successful' });
    } else {
      // Invalid credentials
      res.status(401).send({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
