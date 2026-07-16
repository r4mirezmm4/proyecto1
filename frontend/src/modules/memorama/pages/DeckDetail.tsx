import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';
import type { Deck, Card } from '../services/memoramaService';
import ProgressBar from '../components/ProgressBar';

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<(Deck & { cards: Card[] }) | null>(null);

  useEffect(() => {
    if (deckId) {
      memoramaService.getDeck(Number(deckId)).then(setDeck);
    }
  }, [deckId]);

  if (!deck) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#94a3b8' }}>Cargando...</p>
      </div>
    );
  }

  const totalCards = deck.cards.length;
  const masteredCards = deck.cards.filter(c => c.timesCorrect > c.timesWrong && c.timesCorrect > 0).length;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <button
        onClick={() => navigate('/memorama')}
        style={{
          background: 'transparent',
          color: '#94a3b8',
          border: 'none',
          fontSize: 14,
          cursor: 'pointer',
          marginBottom: 20,
          padding: 0,
        }}
      >
        ← Volver
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#e2e8f0', fontSize: 26, margin: 0 }}>{deck.name}</h1>
        {deck.description && <p style={{ color: '#64748b', marginTop: 8 }}>{deck.description}</p>}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        marginBottom: 32,
      }}>
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16 }}>
          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Total tarjetas</p>
          <p style={{ color: '#e2e8f0', fontSize: 24, margin: '4px 0 0' }}>{totalCards}</p>
        </div>
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 16 }}>
          <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Dominadas</p>
          <p style={{ color: '#06b6d4', fontSize: 24, margin: '4px 0 0' }}>{masteredCards}</p>
        </div>
      </div>

      <ProgressBar value={masteredCards} max={totalCards || 1} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 32 }}>
        <button
          onClick={() => navigate(`/memorama/${deckId}/play`)}
          disabled={totalCards === 0}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 12,
            border: 'none',
            background: totalCards > 0 ? '#06b6d4' : '#334155',
            color: totalCards > 0 ? '#0f172a' : '#64748b',
            fontSize: 16,
            fontWeight: 600,
            cursor: totalCards > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Jugar
        </button>
        <button
          onClick={() => navigate(`/memorama/${deckId}/edit`)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: '1px solid #334155',
            background: 'transparent',
            color: '#e2e8f0',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Editar tarjetas
        </button>
        <button
          onClick={() => navigate(`/memorama/${deckId}/stats`)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: '1px solid #334155',
            background: 'transparent',
            color: '#e2e8f0',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Estadísticas
        </button>
      </div>
    </div>
  );
}