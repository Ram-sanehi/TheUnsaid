import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { chapters, partTitles } from "../data/chapters";
import { useState, useEffect } from "react";
import { useTheme } from "../hooks/useTheme";

export const Route = createFileRoute("/chapters")({
  head: () => ({
    meta: [
      { title: "Chapters — The Girl Who Forgot Her Earrings" },
      { name: "description", content: "Browse all chapters of the novel by Raj Vishwakarma." },
    ],
  }),
  component: ChaptersPage,
});

function ChaptersPage() {
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();
  const dur = reduceMotion ? 0 : 0.5;
  const ease = [0.22, 1, 0.36, 1] as const;

  const [readProgress, setReadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const progress: Record<string, number> = {};
    chapters.forEach(ch => {
      const saved = localStorage.getItem(`reading-progress-${ch.id}`);
      if (saved) progress[ch.id] = Number(saved);
    });
    setReadProgress(progress);
  }, []);

  let lastPart = -1;

  return (
    <div data-theme={theme} style={{
      minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)',
      transition: 'background 0.4s, color 0.4s',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>

        <Link
          to="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
            color: 'var(--muted)', textDecoration: 'none', marginBottom: '2.5rem',
            fontFamily: "'Palatino Linotype', Georgia, serif",
          }}
        >
          ← Home
        </Link>

        <motion.h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
            fontStyle: 'italic', color: 'var(--fg)', marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease }}
        >
          Contents
        </motion.h1>

        <div style={{
          textAlign: 'center', color: 'var(--accent)', fontSize: '0.9rem',
          marginBottom: '2rem', opacity: 0.6,
        }}>✦</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {/* Cover Page entry */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease }}
          >
            <Link
              to="/"
              style={{
                display: 'block', padding: '1rem 1.25rem',
                background: 'var(--surface)', borderRadius: '8px',
                borderLeft: `3px solid var(--accent)`,
                textDecoration: 'none', color: 'var(--fg)',
                transition: 'background 0.15s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 8%, var(--surface))')}
              onMouseOut={e => (e.currentTarget.style.background = 'var(--surface)')}
            >
              <div style={{ marginBottom: '0.35rem' }}>
                <span style={{
                  fontSize: '0.6rem', letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const, color: 'var(--accent)', opacity: 0.8,
                }}>
                  Front Matter
                </span>
              </div>
              <h2 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 600,
              }}>
                Cover Page
              </h2>
            </Link>
          </motion.div>
          {chapters.map((ch, i) => {
            const showPartHeader = ch.part !== lastPart;
            lastPart = ch.part;
            const progress = readProgress[ch.id] ?? 0;
            const isRead = progress >= 95;

            return (
              <div key={ch.id}>
                {showPartHeader && (
                  <motion.div
                    style={{ padding: '1.5rem 0 0.5rem', textAlign: 'center' }}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: dur }}
                  >
                    <p style={{
                      fontSize: '0.65rem', letterSpacing: '0.35em',
                      textTransform: 'uppercase' as const, color: 'var(--accent)', opacity: 0.7,
                      fontVariant: 'small-caps',
                    }}>
                      {partTitles[ch.part]}
                    </p>
                    <p style={{
                      fontStyle: 'italic', fontSize: '0.85rem', color: 'var(--muted)',
                      marginTop: '0.2rem',
                    }}>
                      {ch.partTitle}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: dur, ease, delay: (i % 5) * 0.06 }}
                >
                  <Link
                    to="/read/$chapterId"
                    params={{ chapterId: ch.id }}
                    style={{
                      display: 'block', padding: '1rem 1.25rem',
                      background: 'var(--surface)', borderRadius: '8px',
                      borderLeft: `3px solid var(--accent)`,
                      textDecoration: 'none', color: 'var(--fg)',
                      transition: 'background 0.15s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'color-mix(in srgb, var(--accent) 8%, var(--surface))')}
                    onMouseOut={e => (e.currentTarget.style.background = 'var(--surface)')}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      marginBottom: '0.35rem',
                    }}>
                      <span style={{
                        fontSize: '0.6rem', letterSpacing: '0.2em',
                        textTransform: 'uppercase' as const, color: 'var(--accent)', opacity: 0.8,
                      }}>
                        {ch.chapterNumber === 0 ? 'Prologue' : ch.chapterNumber === 14 ? 'Epilogue' : `Chapter ${ch.chapterNumber}`}
                      </span>
                      <span style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: 'var(--muted)' }}>
                        {ch.readTimeMinutes} min
                      </span>
                    </div>

                    <h2 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '1.05rem', fontStyle: 'italic', fontWeight: 600,
                    }}>
                      {ch.title}
                    </h2>

                    <p style={{
                      marginTop: '0.4rem', fontSize: '0.82rem', lineHeight: 1.55,
                      color: 'var(--muted)',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      {ch.teaser}
                    </p>

                    {progress > 0 && (
                      <div style={{
                        marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}>
                        <div style={{
                          flex: 1, height: 2, borderRadius: 1,
                          background: 'var(--border)',
                        }}>
                          <div style={{
                            height: '100%', borderRadius: 1,
                            background: 'var(--accent)',
                            width: `${Math.min(100, progress)}%`,
                            transition: 'width 0.3s',
                          }} />
                        </div>
                        <span style={{ fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em' }}>
                          {isRead ? '✓' : `${Math.round(progress)}%`}
                        </span>
                      </div>
                    )}
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
