import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Card } from './card.entity';
import { authMiddleware } from '../auth/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  const cardRepository = getRepository(Card);
  const card = cardRepository.create({ ...req.body, user: (req as any).userId });
  const result = await cardRepository.save(card);
  res.status(201).json(result);
});

router.get('/', async (req, res) => {
  const cardRepository = getRepository(Card);
  const cards = await cardRepository.find({ where: { user: { id: (req as any).userId } } });
  res.json(cards);
});

router.get('/:id', async (req, res) => {
  const cardRepository = getRepository(Card);
  const card = await cardRepository.findOne({ where: { id: Number(req.params.id), user: { id: (req as any).userId } } });
  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

router.put('/:id', async (req, res) => {
  const cardRepository = getRepository(Card);
  const card = await cardRepository.findOne({ where: { id: Number(req.params.id), user: { id: (req as any).userId } } });
  if (card) {
    cardRepository.merge(card, req.body);
    const result = await cardRepository.save(card);
    res.json(result);
  } else {
    res.status(404).json({ message: 'Card not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const cardRepository = getRepository(Card);
  const result = await cardRepository.delete({ id: Number(req.params.id), user: { id: (req as any).userId } });
  res.json(result);
});

export default router;
