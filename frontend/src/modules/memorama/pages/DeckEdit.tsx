import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';
import type { Deck, Card } from '../services/memoramaService';

export default function DeckEdit() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [csvText, setCsvText] = useState('');

  useEffect(() => {
    if (deckId) {
      memoramaService.getCards(Number(deckId)).then(setCards);
    }
  }, [deckId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim() || !definition.trim() || !deckId) return;
    if (editingId) {
      const updated = await memoramaService.updateCard(editingId, { term, definition });
      setCards(prev => prev.map(c => c.id === editingId ? updated : c));
      setEditingId(null);
    } else {
      const created = await memoramaService.createCard(Number(deckId), { term, definition });
      setCards(prev => [...prev, created]);
    }
    setTerm('');
    setDefinition('');
  };

  const handleEdit = (card: Card) => {
    setTerm(card.term);
    setDefinition(card.definition);
    setEditingId(card.id);
  };

  const handleDelete = async (id: number) => {
    await memoramaService.deleteCard(id);
    setCards(prev => prev.filter(c => c.id !== id));
  };

  const handleImportCsv = async () => {
    if (!csvText.trim() || !deckId) return;
    const lines = csvText.trim().split('\n');
    const parsed = lines.map(line => {
      const [term, definition] = line.split(',').map(s => s.trim());
      return { term, definition };
    }).filter(c => c.term && c.definition);

    if (parsed.length > 0) {
      await memoramaService.importCards(Number(deckId), parsed);
      const updated = await memoramaService.getCards(Number(deckId));
      setCards(updated);
      setCsvText('');
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: 8,
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#e2e8f0',
    fontSize: 14,
    boxSizing: 'border-box',
    flex: 1,
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 20px' }}>
      <button
        onClick={() => navigate(`/memorama/${deckId}`)}
        style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0 }}
      >
        ← Volver
      </button>

      <h1 style={{ color: '#e2e8f0', fontSize: 24, marginBottom: 24 }}>Editar tarjetas</h1>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <input
          style={inputStyle}
          value={term}
          onChange={e => setTerm(e.target.value)}
          placeholder="Término"
          required
        />
        <input
          style={inputStyle}
          value={definition}
          onChange={e => setDefinition(e.target.value)}
          placeholder="Definición"
          required
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: 'none',
            background: '#06b6d4',
            color: '#0f172a',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {editingId ? 'Actualizar' : 'Agregar'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setTerm(''); setDefinition(''); }}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: 14,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div style={{ marginBottom: 24 }}>
        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>Importar CSV (término,definición - uno por línea)</p>
        <textarea
          value={csvText}
          onChange={e => setCsvText(e.target.value)}
          rows={4}
          placeholder="casa,house&#10;perro,dog"
          style={{
            width: '100%',
            padding: 10,
            borderRadius: 8,
            border: '1px solid #334155',
            background: '#1e293b',
            color: '#e2e8f0',
            fontSize: 13,
            boxSizing: 'border-box',
            resize: 'vertical',
            fontFamily: 'monospace',
          }}
        />
        <button
          onClick={handleImportCsv}
          disabled={!csvText.trim()}
          style={{
            marginTop: 8,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid #f97316',
            background: 'transparent',
            color: '#f97316',
            fontSize: 13,
            fontWeight: 600,
            cursor: csvText.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Importar CSV
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.map(card => (
          <div key={card.id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#1e293b',
            borderRadius: 10,
            padding: '12px 16px',
            border: '1px solid #334155',
          }}>
            <div>
              <p style={{ color: '#e2e8f0', fontSize: 14, margin: 0 }}>{card.term}</p>
              <p style={{ color: '#64748b', fontSize: 12, margin: '2px 0 0' }}>{card.definition}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => handleEdit(card)}
                style={{
                  background: 'transparent',
                  color: '#06b6d4',
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(card.id)}
                style={{
                  background: 'transparent',
                  color: '#ef4444',
                  border: 'none',
                  fontSize: 13,
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center', padding: 24 }}>No hay tarjetas. Agrega tu primer concepto.</p>
        )}
      </div>
    </div>
  );
}