import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAmbientSound, type SoundTrack } from '../hooks/useAmbientSound';

const TRACKS: { id: SoundTrack; label: string; icon: string }[] = [
  { id: 'off',        label: 'Silence',    icon: '○' },
  { id: 'rain',       label: 'Rain',       icon: '🌧' },
  { id: 'quiet_room', label: 'Quiet Room', icon: '◻' },
  { id: 'night',      label: 'Night',      icon: '🌙' },
];

export function AmbientSoundControl() {
  const { track, volume, changeTrack, changeVolume } = useAmbientSound();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '5rem', left: '1rem', zIndex: 60 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              marginBottom: '0.5rem',
              background: 'var(--surface)',
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: '12px',
              padding: '0.75rem',
              width: '160px',
            }}
          >
            {TRACKS.map(t => (
              <button
                key={t.id}
                onClick={() => changeTrack(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  width: '100%', padding: '0.4rem 0.5rem',
                  background: track === t.id ? 'rgba(201,168,76,0.1)' : 'none',
                  border: 'none', borderRadius: '6px', cursor: 'pointer',
                  color: track === t.id ? '#c9a84c' : 'var(--muted)',
                  fontFamily: "'Palatino Linotype', Georgia, serif",
                  fontSize: '0.8rem',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '0.9rem' }}>{t.icon}</span>
                {t.label}
              </button>
            ))}

            {track !== 'off' && (
              <div style={{ marginTop: '0.5rem', padding: '0 0.25rem' }}>
                <input
                  type="range" min={0} max={1} step={0.05}
                  value={volume}
                  onChange={e => changeVolume(parseFloat(e.target.value))}
                  style={{
                    width: '100%', accentColor: '#c9a84c',
                    cursor: 'pointer',
                  }}
                />
                <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--muted)', marginTop: '0.25rem' }}>
                  Volume
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(o => !o)}
        title="Ambient Sound"
        style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: track !== 'off' ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${track !== 'off' ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
          color: track !== 'off' ? '#c9a84c' : 'var(--muted)',
          fontSize: '0.9rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        {track === 'rain' ? '🌧' : track === 'night' ? '🌙' : track === 'quiet_room' ? '◻' : '♪'}
      </button>
    </div>
  );
}
