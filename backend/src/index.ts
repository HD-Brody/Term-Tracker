import express from 'express';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ serverTime: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
