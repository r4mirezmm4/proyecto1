import { Request, Response } from 'express';
import { MemoramaService } from './memorama.service';

const service = new MemoramaService();

export class MemoramaController {
  async createDeck(req: Request, res: Response) {
    const { name, description, type, sourceLanguage, targetLanguage, directionMode, similarityThreshold } = req.body;
    const deck = await service.createDeck({
      name,
      description,
      type,
      sourceLanguage,
      targetLanguage,
      directionMode: directionMode || 'normal',
      similarityThreshold: similarityThreshold || 0.7,
    });
    res.status(201).json(deck);
  }

  async getDecks(req: Request, res: Response) {
    const decks = await service.getDecks();
    res.json(decks);
  }

  async getDeck(req: Request, res: Response) {
    const deck = await service.getDeck(Number(req.params.id));
    res.json(deck);
  }

  async updateDeck(req: Request, res: Response) {
    const deck = await service.updateDeck(Number(req.params.id), req.body);
    res.json(deck);
  }

  async deleteDeck(req: Request, res: Response) {
    await service.deleteDeck(Number(req.params.id));
    res.status(204).send();
  }

  async createCard(req: Request, res: Response) {
    const card = await service.createCard(Number(req.params.deckId), req.body);
    res.status(201).json(card);
  }

  async getCards(req: Request, res: Response) {
    const cards = await service.getCards(Number(req.params.deckId));
    res.json(cards);
  }

  async updateCard(req: Request, res: Response) {
    const card = await service.updateCard(Number(req.params.cardId), req.body);
    res.json(card);
  }

  async deleteCard(req: Request, res: Response) {
    await service.deleteCard(Number(req.params.cardId));
    res.status(204).send();
  }

  async checkAnswer(req: Request, res: Response) {
    const { cardId } = req.params;
    const { answer } = req.body;
    const result = await service.checkAnswer(Number(cardId), answer);
    res.json(result);
  }

  async getNextCard(req: Request, res: Response) {
    const card = await service.getNextCard(Number(req.params.deckId));
    res.json(card);
  }

  async getDeckStats(req: Request, res: Response) {
    const stats = await service.getDeckStats(Number(req.params.id));
    res.json(stats);
  }

  async createSession(req: Request, res: Response) {
    const session = await service.createSession(Number(req.params.deckId), req.body);
    res.status(201).json(session);
  }

  async importCards(req: Request, res: Response) {
    const { cards } = req.body;
    const result = await service.importCards(Number(req.params.deckId), cards);
    res.status(201).json(result);
  }
}