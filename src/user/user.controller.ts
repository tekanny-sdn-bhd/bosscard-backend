import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from './user.entity';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { id: Number(req.params.id) } });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.put('/:id', async (req, res) => {
  const userRepository = getRepository(User);
  const user = await userRepository.findOne({ where: { id: Number(req.params.id) } });
  if (user) {
    userRepository.merge(user, req.body);
    const result = await userRepository.save(user);
    res.json(result);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const userRepository = getRepository(User);
  const result = await userRepository.delete(req.params.id);
  res.json(result);
});

export default router;
