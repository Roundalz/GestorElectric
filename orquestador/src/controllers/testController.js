// controllers/testController.js
import express from 'express';
import pool from '../database.js';

const router = express.Router();

router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // o alguna tabla de prueba
    res.json({ success: true, timestamp: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
