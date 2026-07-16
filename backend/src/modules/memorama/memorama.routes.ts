import { Router } from 'express';
import { MemoramaController } from './memorama.controller';

const router = Router();
const controller = new MemoramaController();

router.get('/decks', controller.getDecks);
router.post('/decks', controller.createDeck);
router.get('/decks/:id', controller.getDeck);
router.put('/decks/:id', controller.updateDeck);
router.delete('/decks/:id', controller.deleteDeck);
router.get('/decks/:id/stats', controller.getDeckStats);
router.post('/decks/:id/import', controller.importCards);

router.get('/decks/:deckId/cards', controller.getCards);
router.post('/decks/:deckId/cards', controller.createCard);
router.put('/cards/:cardId', controller.updateCard);
router.delete('/cards/:cardId', controller.deleteCard);
router.post('/cards/:cardId/check', controller.checkAnswer);
router.get('/decks/:deckId/next-card', controller.getNextCard);

router.post('/decks/:deckId/sessions', controller.createSession);

export default router;