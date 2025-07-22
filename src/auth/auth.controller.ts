import { Router } from 'express';
import pool from '../config/database';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
  if ((rows as any).length > 0) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO user (username, password) VALUES (?, ?)', [username, hashedPassword]);

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const [rows] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
  const user = (rows as any)[0];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });

  res.json({ token });
});

export default router;
