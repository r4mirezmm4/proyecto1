import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';
import type { DeckStats as DeckStatsType } from '../services/memoramaService';
import ProgressBar from '../components/ProgressBar';

export default function DeckStats() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DeckStatsType | null>(null);

  useEffect(() => {
    if (deckId) {
      memoramaService.getDeckStats(Number(deckId)).then(setStats);
    }
  }, [deckId]);

  if (!stats) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <p style={{ color: '#94a3b8' }}>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 20px' }}>
      <button
        onClick={() => navigate(`/memorama/${deckId}`)}
        style={{ background: 'transparent', color: '#94a3b8', border: 'none', fontSize: 14, cursor: 'pointer', marginBottom: 20, padding: 0 }}
      >
        ← Volver
      </button>

      <h1 style={{ color: '#e2e8f0', fontSize: 24, marginBottom: 24 }}>Estadísticas</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <StatBox label="Total tarjetas" value={stats.totalCards} />
        <StatBox label="Sesiones" value={stats.totalSessions} />
        <StatBox label="Intentos totales" value={stats.totalAttempts} />
        <StatBox label="Precisión" value={`${stats.accuracy}%`} accent />
      </div>

      <div style={{ marginBottom: 32 }}>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>Progreso general</p>
        <ProgressBar value={stats.totalCorrect} max={stats.totalAttempts || 1} color="#22c55e" />
      </div>

      {stats.worstCards.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ color: '#e2e8f0', fontSize: 16, marginBottom: 12 }}>Tarjetas con más errores</h3>
          {stats.worstCards.map(card => (
            <div key={card.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#1e293b',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 8,
              border: '1px solid #334155',
            }}>
              <span style={{ color: '#e2e8f0', fontSize: 14 }}>{card.term}</span>
              <span style={{ color: '#ef4444', fontSize: 13 }}>{card.timesWrong} errores</span>
            </div>
          ))}
        </div>
      )}

      {stats.recentSessions.length > 0 && (
        <div>
          <h3 style={{ color: '#e2e8f0', fontSize: 16, marginBottom: 12 }}>Últimas sesiones</h3>
          {stats.recentSessions.map(session => (
            <div key={session.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#1e293b',
              borderRadius: 10,
              padding: '10px 16px',
              marginBottom: 6,
              border: '1px solid #334155',
            }}>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>
                {new Date(session.completedAt).toLocaleDateString()}
              </span>
              <span style={{ color: '#e2e8f0', fontSize: 13 }}>
                {session.correctCards}/{session.totalCards} correctas
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: 16 }}>
      <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>{label}</p>
      <p style={{ color: accent ? '#06b6d4' : '#e2e8f0', fontSize: 20, margin: '4px 0 0', fontWeight: 600 }}>{value}</p>
    </div>
  );
}