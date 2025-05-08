require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ─────────────────────────────────────────────────────────────
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'https://nice-beach-0856e2d03.6.azurestaticapps.net'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Azure SQL Configuration ────────────────────────────────────────────────
const sqlConfig = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true,
    trustServerCertificate: false
  }
};

const pool = new sql.ConnectionPool(sqlConfig);
const poolConnect = pool.connect();

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('SnapShare backend is running.');
});

// ─── Register (for consumers only) ───────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await poolConnect;
    const result = await pool.request()
      .input('id', sql.VarChar, uuidv4())
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password) // Optional: Hash before storing
      .input('name', sql.NVarChar, name)
      .input('role', sql.VarChar, 'consumer')
      .query(`
        INSERT INTO Users (id, email, name, password, role, created_at)
        VALUES (@id, @email, @name, @password, @role, SYSDATETIME())
      `);

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// ─── Login ───────────────────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    await poolConnect;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT id, name, email, role FROM Users
        WHERE email = @email AND password = @password
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    res.json(user);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// ─── Get Authenticated User ──────────────────────────────────────────────────
app.get('/api/auth/me', async (req, res) => {
  // Optional: Add session or token auth logic
  res.status(200).json({ message: "Auth check not implemented" });
});

// ─── Upload Photo Metadata ───────────────────────────────────────────────────
app.post('/api/photos', async (req, res) => {
  const { url, title, caption, location, people, creator_id, blob_path } = req.body;

  if (!url || !title || !creator_id || !blob_path) {
    return res.status(400).json({ message: 'Required fields missing.' });
  }

  try {
    await poolConnect;
    await pool.request()
      .input('id', sql.VarChar, uuidv4())
      .input('url', sql.NVarChar, url)
      .input('title', sql.NVarChar, title)
      .input('caption', sql.NVarChar, caption || '')
      .input('location', sql.NVarChar, location || '')
      .input('people', sql.NVarChar, people || '')
      .input('creator_id', sql.VarChar, creator_id)
      .input('blob_path', sql.NVarChar, blob_path)
      .query(`
        INSERT INTO Photos (id, url, title, caption, location, people, creator_id, blob_path, timestamp)
        VALUES (@id, @url, @title, @caption, @location, @people, @creator_id, @blob_path, SYSDATETIME())
      `);

    res.status(201).json({ message: "Photo uploaded successfully" });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// ─── Get All Photos ──────────────────────────────────────────────────────────
app.get('/api/photos', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query(`
      SELECT * FROM Photos ORDER BY timestamp DESC
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error("Fetch photos error:", error);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`SnapShare API running on http://localhost:${PORT}`);
});
