import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { title, description } = req.body;
  const userId = (req as any).userId;
  const [result] = await pool.query('INSERT INTO card (title, description, userId) VALUES (?, ?, ?)', [title, description, userId]);
  res.status(201).json({ id: (result as any).insertId, title, description, userId });
});

router.get('/', async (req, res) => {
  const userId = (req as any).userId;
  const [rows] = await pool.query('SELECT * FROM card WHERE userId = ?', [userId]);
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const userId = (req as any).userId;
  const [rows] = await pool.query('SELECT * FROM card WHERE id = ? AND userId = ?', [req.params.id, userId]);
  if ((rows as any).length > 0) {
    res.json((rows as any)[0]);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

router.put('/:id', async (req, res) => {
  const { title, description } = req.body;
  const userId = (req as any).userId;
  const [result] = await pool.query('UPDATE card SET title = ?, description = ? WHERE id = ? AND userId = ?', [title, description, req.params.id, userId]);
  if ((result as any).affectedRows > 0) {
    res.json({ id: req.params.id, title, description, userId });
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = (req as any).userId;
  const [result] = await pool.query('DELETE FROM card WHERE id = ? AND userId = ?', [req.params.id, userId]);
  if ((result as any).affectedRows > 0) {
    res.json({ message: 'Card deleted' });
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

export default router;
