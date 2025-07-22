import { Router } from 'express';
import pool from '../config/database';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT id, username FROM user');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT id, username FROM user WHERE id = ?', [req.params.id]);
  if ((rows as any).length > 0) {
    res.json((rows as any)[0]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.put('/:id', async (req, res) => {
  const { username } = req.body;
  const [result] = await pool.query('UPDATE user SET username = ? WHERE id = ?', [username, req.params.id]);
  if ((result as any).affectedRows > 0) {
    res.json({ id: req.params.id, username });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM user WHERE id = ?', [req.params.id]);
  if ((result as any).affectedRows > 0) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
