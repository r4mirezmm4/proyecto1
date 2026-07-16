import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { memoramaService } from '../services/memoramaService';

export default function DeckCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'concept',
    sourceLanguage: '',
    targetLanguage: '',
    directionMode: 'normal',
    similarityThreshold: 0.7,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await memoramaService.createDeck(form);
    navigate('/memorama');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: 10,
    border: '1px solid #334155',
    background: '#1e293b',
    color: '#e2e8f0',
    fontSize: 14,
    boxSizing: 'border-box',
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: 600,
    display: 'block',
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#e2e8f0', fontSize: 24, marginBottom: 24 }}>Nuevo Mazo</h1>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Nombre</label>
        <input
          style={inputStyle}
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Ej: Vocabulario inglés"
        />

        <label style={labelStyle}>Descripción</label>
        <input
          style={inputStyle}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="Opcional"
        />

        <label style={labelStyle}>Tipo</label>
        <select
          style={inputStyle}
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="concept">Conceptos</option>
          <option value="language">Idioma</option>
        </select>

        {form.type === 'language' && (
          <>
            <label style={labelStyle}>Idioma origen</label>
            <input
              style={inputStyle}
              value={form.sourceLanguage}
              onChange={e => setForm({ ...form, sourceLanguage: e.target.value })}
              placeholder="es"
            />
            <label style={labelStyle}>Idioma destino</label>
            <input
              style={inputStyle}
              value={form.targetLanguage}
              onChange={e => setForm({ ...form, targetLanguage: e.target.value })}
              placeholder="en"
            />
          </>
        )}

        <label style={labelStyle}>Dirección</label>
        <select
          style={inputStyle}
          value={form.directionMode}
          onChange={e => setForm({ ...form, directionMode: e.target.value })}
        >
          <option value="normal">Normal (término → definición)</option>
          <option value="reverse">Inverso (definición → término)</option>
          <option value="mixed">Mixto (aleatorio)</option>
        </select>

        <label style={labelStyle}>Umbral de similitud ({(form.similarityThreshold * 100).toFixed(0)}%)</label>
        <input
          type="range"
          min="0.5"
          max="1"
          step="0.05"
          value={form.similarityThreshold}
          onChange={e => setForm({ ...form, similarityThreshold: Number(e.target.value) })}
          style={{ width: '100%', marginBottom: 24 }}
        />

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => navigate('/memorama')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: '1px solid #334155',
              background: 'transparent',
              color: '#94a3b8',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: 'none',
              background: '#06b6d4',
              color: '#0f172a',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Crear Mazo
          </button>
        </div>
      </form>
    </div>
  );
}