import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';
import type { Deck } from '../services/memoramaService';
import DeckCard from '../components/DeckCard';

export default function MemoramaMenu() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memoramaService.getDecks().then(data => {
      setDecks(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) {
      await memoramaService.deleteDeck(id);
      setDecks(prev => prev.filter(d => d.id !== id));
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#94a3b8' }}>Cargando mazos...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ color: '#e2e8f0', fontSize: 28, margin: 0 }}>Memorama</h1>
          <p style={{ color: '#64748b', marginTop: 4 }}>Tus mazos de estudio</p>
        </div>
        <button
          onClick={() => navigate('/memorama/crear')}
          style={{
            background: '#06b6d4',
            color: '#0f172a',
            border: 'none',
            padding: '12px 24px',
            borderRadius: 12,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#0891b2')}
          onMouseLeave={e => (e.currentTarget.style.background = '#06b6d4')}
        >
          + Nuevo Mazo
        </button>
      </div>

      {decks.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#1e293b',
          borderRadius: 16,
          border: '1px dashed #334155',
        }}>
          <p style={{ color: '#94a3b8', fontSize: 16, marginBottom: 16 }}>
            No tienes mazos todavía
          </p>
          <button
            onClick={() => navigate('/memorama/crear')}
            style={{
              background: 'transparent',
              color: '#06b6d4',
              border: '2px solid #06b6d4',
              padding: '10px 20px',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Crear tu primer mazo
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {decks.map(deck => (
            <div key={deck.id} style={{ position: 'relative' }}>
              <DeckCard
                id={deck.id}
                name={deck.name}
                description={deck.description}
                cardCount={deck._count?.cards || 0}
                type={deck.type}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(deck.id, deck.name);
                }}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: 'rgba(239,68,68,0.2)',
                  color: '#ef4444',
                  border: 'none',
                  borderRadius: 8,
                  padding: '4px 10px',
                  fontSize: 12,
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}