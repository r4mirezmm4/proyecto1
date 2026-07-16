import { prisma } from '../../index';
import { isCorrectAnswer } from '../../shared/utils/similarity';

interface CreateDeckInput {
  name: string;
  description?: string;
  type: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  directionMode: string;
  similarityThreshold: number;
}

export class MemoramaService {
  async createDeck(input: CreateDeckInput) {
    return prisma.deck.create({ data: input });
  }

  async getDecks() {
    return prisma.deck.findMany({
      include: { _count: { select: { cards: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDeck(id: number) {
    return prisma.deck.findUnique({
      where: { id },
      include: {
        cards: { orderBy: { createdAt: 'asc' } },
        sessions: { orderBy: { completedAt: 'desc' }, take: 10 },
      },
    });
  }

  async updateDeck(id: number, data: Partial<CreateDeckInput>) {
    return prisma.deck.update({ where: { id }, data });
  }

  async deleteDeck(id: number) {
    await prisma.deck.delete({ where: { id } });
  }

  async createCard(deckId: number, data: { term: string; definition: string }) {
    return prisma.card.create({
      data: { ...data, deckId },
    });
  }

  async getCards(deckId: number) {
    return prisma.card.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateCard(id: number, data: { term?: string; definition?: string }) {
    return prisma.card.update({ where: { id }, data });
  }

  async deleteCard(id: number) {
    await prisma.card.delete({ where: { id } });
  }

  async checkAnswer(cardId: number, answer: string) {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { deck: true },
    });
    if (!card) throw new Error('Card not found');

    const correct = isCorrectAnswer(answer, card.definition, card.deck.similarityThreshold);
    const similarity = (await import('../../shared/utils/similarity')).normalizedSimilarity(answer, card.definition);

    await prisma.card.update({
      where: { id: cardId },
      data: {
        timesCorrect: correct ? { increment: 1 } : undefined,
        timesWrong: correct ? undefined : { increment: 1 },
        lastReviewedAt: new Date(),
      },
    });

    return {
      correct,
      similarity: Math.round(similarity * 100),
      definition: correct ? undefined : card.definition,
    };
  }

  async getNextCard(deckId: number) {
    const cards = await prisma.card.findMany({
      where: { deckId },
      orderBy: [
        { timesWrong: 'desc' },
        { lastReviewedAt: { sort: 'asc', nulls: 'first' } },
      ],
    });

    if (!cards.length) return null;

    // Priorizar cartas con más errores y menos revisadas
    const weighted = cards.map(card => ({
      ...card,
      weight: (card.timesWrong * 2) + (card.lastReviewedAt ? 0 : 10),
    }));
    weighted.sort((a, b) => b.weight - a.weight);

    const topWeight = weighted[0].weight;
    const candidates = weighted.filter(c => c.weight >= topWeight * 0.7);
    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    return {
      id: selected.id,
      term: selected.term,
      timesWrong: selected.timesWrong,
      timesCorrect: selected.timesCorrect,
    };
  }

  async getDeckStats(deckId: number) {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: { cards: true, sessions: true },
    });
    if (!deck) throw new Error('Deck not found');

    const totalCards = deck.cards.length;
    const totalAttempts = deck.cards.reduce((sum, c) => sum + c.timesCorrect + c.timesWrong, 0);
    const totalCorrect = deck.cards.reduce((sum, c) => sum + c.timesCorrect, 0);
    const accuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

    const worstCards = [...deck.cards]
      .filter(c => c.timesWrong > 0)
      .sort((a, b) => b.timesWrong - a.timesWrong)
      .slice(0, 5);

    return {
      totalCards,
      totalAttempts,
      totalCorrect,
      accuracy: Math.round(accuracy * 100) / 100,
      totalSessions: deck.sessions.length,
      worstCards: worstCards.map(c => ({
        id: c.id,
        term: c.term,
        timesWrong: c.timesWrong,
        timesCorrect: c.timesCorrect,
      })),
      recentSessions: deck.sessions.slice(0, 5).map(s => ({
        id: s.id,
        totalCards: s.totalCards,
        correctCards: s.correctCards,
        wrongCards: s.wrongCards,
        completedAt: s.completedAt,
      })),
    };
  }

  async createSession(deckId: number, data: { totalCards: number; correctCards: number; wrongCards: number; direction: string }) {
    return prisma.studySession.create({
      data: { ...data, deckId },
    });
  }

  async importCards(deckId: number, cards: { term: string; definition: string }[]) {
    const created = await prisma.card.createMany({
      data: cards.map(c => ({ ...c, deckId })),
    });
    return { count: created.count };
  }
}