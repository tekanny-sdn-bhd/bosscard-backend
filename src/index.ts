import express from 'express';
import dotenv from 'dotenv';
import pool from './config/database';
import authRouter from './auth/auth.controller';
import userRouter from './user/user.controller';
import cardRouter from './card/card.controller';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/cards', cardRouter);

const PORT = process.env.PORT || 3000;

pool.getConnection().then(() => {
  console.log('Database connected successfully');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(error => {
  console.error('Database connection error:', error);
});
