import axios from 'axios';

const api = axios.create({ baseURL: '/api/memorama' });

export interface Deck {
  id: number;
  name: string;
  description?: string;
  type: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  directionMode: string;
  similarityThreshold: number;
  _count?: { cards: number };
  createdAt: string;
}

export interface Card {
  id: number;
  deckId: number;
  term: string;
  definition: string;
  timesCorrect: number;
  timesWrong: number;
  lastReviewedAt?: string;
}

export interface DeckStats {
  totalCards: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  totalSessions: number;
  worstCards: { id: number; term: string; timesWrong: number; timesCorrect: number }[];
  recentSessions: { id: number; totalCards: number; correctCards: number; wrongCards: number; completedAt: string }[];
}

export const memoramaService = {
  getDecks: () => api.get<Deck[]>('/decks').then(r => r.data),
  getDeck: (id: number) => api.get<Deck & { cards: Card[] }>(`/decks/${id}`).then(r => r.data),
  createDeck: (data: Partial<Deck>) => api.post<Deck>('/decks', data).then(r => r.data),
  updateDeck: (id: number, data: Partial<Deck>) => api.put<Deck>(`/decks/${id}`, data).then(r => r.data),
  deleteDeck: (id: number) => api.delete(`/decks/${id}`),
  getCards: (deckId: number) => api.get<Card[]>(`/decks/${deckId}/cards`).then(r => r.data),
  createCard: (deckId: number, data: { term: string; definition: string }) =>
    api.post<Card>(`/decks/${deckId}/cards`, data).then(r => r.data),
  updateCard: (cardId: number, data: { term?: string; definition?: string }) =>
    api.put<Card>(`/cards/${cardId}`, data).then(r => r.data),
  deleteCard: (cardId: number) => api.delete(`/cards/${cardId}`),
  getNextCard: (deckId: number) =>
    api.get<Card | null>(`/decks/${deckId}/next-card`).then(r => r.data),
  checkAnswer: (cardId: number, answer: string) =>
    api.post<{ correct: boolean; similarity: number; definition?: string }>(`/cards/${cardId}/check`, { answer }).then(r => r.data),
  getDeckStats: (deckId: number) => api.get<DeckStats>(`/decks/${deckId}/stats`).then(r => r.data),
  createSession: (deckId: number, data: { totalCards: number; correctCards: number; wrongCards: number; direction: string }) =>
    api.post(`/decks/${deckId}/sessions`, data).then(r => r.data),
  importCards: (deckId: number, cards: { term: string; definition: string }[]) =>
    api.post(`/decks/${deckId}/import`, { cards }).then(r => r.data),
};