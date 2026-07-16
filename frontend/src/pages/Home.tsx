import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const apps = [
    {
      id: 'memorama',
      name: 'Memorama',
      description: 'Estudia conceptos y vocabulario con repetición inteligente',
      icon: '🧠',
      color: '#06b6d4',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <h1 style={{
        color: '#e2e8f0',
        fontSize: 32,
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Proyecto 1
      </h1>
      <p style={{
        color: '#64748b',
        fontSize: 16,
        marginBottom: 40,
        textAlign: 'center',
      }}>
        Plataforma de aplicaciones de estudio
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
        maxWidth: 600,
        width: '100%',
      }}>
        {apps.map(app => (
          <div
            key={app.id}
            onClick={() => navigate(`/${app.id}`)}
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: `1px solid ${app.color}40`,
              borderRadius: 20,
              padding: 32,
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              textAlign: 'center',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${app.color}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 40 }}>{app.icon}</span>
            <h2 style={{ color: '#e2e8f0', fontSize: 20, marginTop: 12, marginBottom: 8 }}>{app.name}</h2>
            <p style={{ color: '#94a3b8', fontSize: 14, margin: 0 }}>{app.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}