interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
}

export default function ProgressBar({ value, max, color = '#06b6d4' }: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div style={{
      width: '100%',
      height: 8,
      background: '#1e293b',
      borderRadius: 4,
      overflow: 'hidden',
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        background: color,
        borderRadius: 4,
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}