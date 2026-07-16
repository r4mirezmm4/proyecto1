import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';
import type { Deck, Card } from '../services/memoramaService';
import ProgressBar from '../components/ProgressBar';

export default function DeckPlay() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ correct: boolean; similarity: number; definition?: string } | null>(null);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });
  const [finished, setFinished] = useState(false);
  const [deck, setDeck] = useState<{ name: string; directionMode: string } | null>(null);

  const loadNextCard = useCallback(async () => {
    if (!deckId) return;
    const card = await memoramaService.getNextCard(Number(deckId));
    setCurrentCard(card);
    setAnswer('');
    setResult(null);
    if (!card) {
      setFinished(true);
    }
  }, [deckId]);

  useEffect(() => {
    if (deckId) {
      memoramaService.getDeck(Number(deckId)).then(d => {
        setDeck(d);
        loadNextCard();
      });
    }
  }, [deckId, loadNextCard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard || !answer.trim()) return;
    const res = await memoramaService.checkAnswer(currentCard.id, answer);
    setResult(res);
    setStats(prev => ({
      correct: prev.correct + (res.correct ? 1 : 0),
      wrong: prev.wrong + (res.correct ? 0 : 1),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    loadNextCard();
  };

  const handleFinish = async () => {
    if (deckId) {
      await memoramaService.createSession(Number(deckId), {
        totalCards: stats.total,
        correctCards: stats.correct,
        wrongCards: stats.wrong,
        direction: deck?.directionMode || 'normal',
      });
    }
    navigate(`/memorama/${deckId}`);
  };

  if (finished) {
    const accuracy = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : '0';
    return (
      <div style={{ maxWidth: 500, margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ color: '#06b6d4', fontSize: 28, marginBottom: 16 }}>¡Completado!</h1>
        <div style={{
          background: '#1e293b',
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
        }}>
          <p style={{ color: '#e2e8f0', fontSize: 20 }}>Precisión: {accuracy}%</p>
          <p style={{ color: '#94a3b8', marginTop: 8 }}>Correctas: {stats.correct} | Incorrectas: {stats.wrong}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleFinish}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: '#06b6d4',
              color: '#0f172a',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Finalizar
          </button>
          <button
            onClick={() => {
              setFinished(false);
              setStats({ correct: 0, wrong: 0, total: 0 });
              loadNextCard();
            }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: 12,
              border: '1px solid #334155',
              background: 'transparent',
              color: '#e2e8f0',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Jugar otra vez
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#64748b', fontSize: 13 }}>Progreso</span>
          <span style={{ color: '#64748b', fontSize: 13 }}>{stats.total} respondidas</span>
        </div>
        <ProgressBar value={stats.correct} max={stats.total || 1} color="#22c55e" />
      </div>

      {currentCard && !result && (
        <form onSubmit={handleSubmit}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid #334155',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>Término</p>
            <h2 style={{ color: '#e2e8f0', fontSize: 24, margin: 0 }}>{currentCard.term}</h2>
          </div>

          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Escribe la definición..."
            autoFocus
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: '1px solid #334155',
              background: '#1e293b',
              color: '#e2e8f0',
              fontSize: 15,
              boxSizing: 'border-box',
              marginBottom: 16,
            }}
          />

          <button
            type="submit"
            disabled={!answer.trim()}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 12,
              border: 'none',
              background: answer.trim() ? '#06b6d4' : '#334155',
              color: answer.trim() ? '#0f172a' : '#64748b',
              fontSize: 15,
              fontWeight: 600,
              cursor: answer.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Comprobar
          </button>
        </form>
      )}

      {result && (
        <div style={{
          background: result.correct ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${result.correct ? '#22c55e' : '#ef4444'}`,
          borderRadius: 16,
          padding: 24,
          textAlign: 'center',
        }}>
          <h3 style={{
            color: result.correct ? '#22c55e' : '#ef4444',
            fontSize: 20,
            margin: 0,
          }}>
            {result.correct ? 'Correcto' : 'Incorrecto'}
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>
            Similitud: {result.similarity}%
          </p>
          {result.definition && (
            <div style={{ marginTop: 16 }}>
              <p style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>Definición correcta:</p>
              <p style={{ color: '#e2e8f0', fontSize: 15 }}>{result.definition}</p>
            </div>
          )}
          <button
            onClick={handleNext}
            style={{
              marginTop: 20,
              padding: '12px 32px',
              borderRadius: 10,
              border: 'none',
              background: '#06b6d4',
              color: '#0f172a',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}