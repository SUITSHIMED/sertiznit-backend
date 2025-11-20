const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection - UPDATE THESE WITH YOUR INFO!
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',        // Your PostgreSQL username
  host: 'localhost',
  database: 'sertiznit',    // Your database name
  password: '0000', // Your PostgreSQL password
  port: 5432,
});

// ===== ROUTES START HERE =====

// 1. Test route
app.get('/', (req, res) => {
  res.json({ message: 'Artisans API is working!' });
});

// 2. GET all artisans
app.get('/artisans', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artisans ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. GET one artisan by ID
app.get('/artisans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM artisans WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artisan not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. POST - Add new artisan
app.post('/artisans', async (req, res) => {
  try {
    const { nom, prenom, profession, telephone, ville = 'Tiznit' } = req.body;
    
    const result = await pool.query(
      'INSERT INTO artisans (nom, prenom, profession, telephone, ville) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nom, prenom, profession, telephone, ville]
    );
    
    res.json({ success: true, artisan: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add artisan' });
  }
});

// 5. PUT - Update artisan
app.put('/artisans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, profession, telephone, ville } = req.body;
    
    const result = await pool.query(
      'UPDATE artisans SET nom=$1, prenom=$2, profession=$3, telephone=$4, ville=$5 WHERE id=$6 RETURNING *',
      [nom, prenom, profession, telephone, ville, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artisan not found' });
    }
    
    res.json({ success: true, artisan: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update artisan' });
  }
});

// 6. DELETE - Remove artisan
app.delete('/artisans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM artisans WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artisan not found' });
    }
    
    res.json({ success: true, message: 'Artisan deleted', artisan: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete artisan' });
  }
});

// ===== SERVER START =====
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available endpoints:');
  console.log(`  GET    http://localhost:${port}/artisans`);
  console.log(`  GET    http://localhost:${port}/artisans/1`);
  console.log(`  POST   http://localhost:${port}/artisans`);
  console.log(`  PUT    http://localhost:${port}/artisans/1`);
  console.log(`  DELETE http://localhost:${port}/artisans/1`);
});