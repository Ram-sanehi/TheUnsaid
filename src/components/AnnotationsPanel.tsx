import { motion, AnimatePresence } from 'framer-motion';
import { type Annotation } from '../hooks/useAnnotations';
import { chapters } from '../data/chapters';

interface AnnotationsPanelProps {
  annotations: Annotation[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export function AnnotationsPanel({ annotations, onClose, onRemove }: AnnotationsPanelProps) {
  const sorted = [...annotations].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <AnimatePresence>
      <div key="ann-overlay" className="toc-overlay" onClick={onClose} />
      <motion.div
        key="ann-sheet"
        className="toc-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="toc-handle" />
        <p className="toc-heading">Annotations</p>

        {sorted.length === 0 && (
          <p style={{
            textAlign: 'center', color: 'var(--muted)', fontStyle: 'italic',
            fontSize: '0.85rem', padding: '2rem 1rem',
          }}>
            No annotations yet. Select text while reading to highlight or add notes.
          </p>
        )}

        {sorted.map(ann => {
          const ch = chapters.find(c => c.id === ann.chapterId);
          return (
            <div key={ann.id} style={{
              padding: '0.75rem 0.5rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
            }}>
              {/* Type indicator */}
              <span style={{
                width: 4, minHeight: 24, borderRadius: 2, flexShrink: 0, marginTop: 2,
                background: ann.type === 'highlight' ? '#c9a96e' : 'transparent',
                borderBottom: ann.type === 'underline' ? '2px solid #c9a96e' : 'none',
              }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Location */}
                <p style={{
                  fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--accent)', opacity: 0.7, marginBottom: '0.25rem',
                }}>
                  {ch?.title ?? ann.chapterId} · ¶{ann.paragraphIndex + 1}
                </p>

                {/* Highlighted text */}
                <p style={{
                  fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--fg)',
                  fontStyle: 'italic',
                  background: ann.type === 'highlight' ? 'rgba(201,169,110,0.15)' : 'none',
                  textDecoration: ann.type === 'underline' ? 'underline' : 'none',
                  textDecorationColor: '#c9a96e',
                  padding: ann.type === 'highlight' ? '0.15rem 0.3rem' : 0,
                  borderRadius: 3,
                }}>
                  "{ann.text.length > 120 ? ann.text.slice(0, 120) + '…' : ann.text}"
                </p>

                {/* Note */}
                {ann.note && (
                  <div style={{
                    marginTop: '0.4rem', padding: '0.4rem 0.6rem',
                    background: 'rgba(201,169,110,0.08)',
                    border: '1px solid rgba(201,169,110,0.2)',
                    borderRadius: 6, fontSize: '0.78rem',
                    color: 'var(--fg)', lineHeight: 1.5,
                  }}>
                    {ann.note}
                  </div>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={() => onRemove(ann.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--muted)', fontSize: '0.7rem', opacity: 0.5,
                  transition: 'opacity 0.15s', flexShrink: 0, minHeight: 44, minWidth: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Remove annotation"
              >
                ✕
              </button>
            </div>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
