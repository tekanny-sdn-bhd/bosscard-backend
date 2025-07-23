import { Router } from 'express';
import pool from '../config/database';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
  const { id, user_name, user_email, user_password } = req.body;



  const [rows] = await pool.query('SELECT * FROM user WHERE user_name = ?', [user_name]);
  if ((rows as any).length > 0) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(user_password, 10);
  await pool.query('INSERT INTO user (user_name, user_email, user_password) VALUES (?, ?, ?)', [user_name, user_email, hashedPassword]);

  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { user_name, user_password } = req.body;

  const [rows] = await pool.query('SELECT * FROM user WHERE user_name = ?', [user_name]);
  const user = (rows as any)[0];
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1h',
  });

  res.json({ token });
});

export default router;
