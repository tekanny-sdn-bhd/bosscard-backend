import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
import { connectDatabase } from './config/database';
import authRouter from './auth/auth.controller';
import userRouter from './user/user.controller';
import cardRouter from './card/card.controller';

const app = express();
app.use(express.json());

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

const PORT = process.env.PORT || 3000;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
