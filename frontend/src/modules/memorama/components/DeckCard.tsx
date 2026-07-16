import { useNavigate } from 'react-router-dom';

interface DeckCardProps {
  id: number;
  name: string;
  description?: string;
  cardCount: number;
  type: string;
}

export default function DeckCard({ id, name, description, cardCount, type }: DeckCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/memorama/${id}`)}
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: 16,
        padding: '24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,182,212,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ color: '#e2e8f0', margin: 0, fontSize: 18 }}>{name}</h3>
        <span style={{
          background: type === 'language' ? '#06b6d4' : '#f97316',
          color: '#0f172a',
          padding: '4px 12px',
          borderRadius: 20,
          fontSize: 12,
          fontWeight: 600,
        }}>
          {type === 'language' ? 'Idioma' : 'Conceptos'}
        </span>
      </div>
      {description && <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>{description}</p>}
      <p style={{ color: '#64748b', marginTop: 16, fontSize: 13 }}>{cardCount} tarjetas</p>
    </div>
  );
}