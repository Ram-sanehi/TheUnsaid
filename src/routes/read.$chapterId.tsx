import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { chapters, partTitles, type ContentBlock } from "../data/chapters";
import { useTheme, type ReadingTheme } from "../hooks/useTheme";
import { useBookmarks } from "../hooks/useBookmarks";
import { useAnnotations, type Annotation } from "../hooks/useAnnotations";
import { useReactions, REACTION_CATEGORIES } from "../hooks/useReactions";
import { useImmersiveMode } from "../hooks/useImmersiveMode";
import { useMemoryShelf } from "../hooks/useMemoryShelf";
import { useUnsaid } from "../hooks/useUnsaid";
import { useTimeTheme } from "../hooks/useTimeTheme";
import { useAutoScroll } from "../hooks/useAutoScroll";
import { getStageForProgress } from "../lib/emotionalStages";
import { TocDrawer } from "../components/TocDrawer";
import { AnnotationToolbar } from "../components/AnnotationToolbar";
import { AnnotationsPanel } from "../components/AnnotationsPanel";
import { MemoryShelf } from "../components/MemoryShelf";
import { QuoteShareModal } from "../components/QuoteShareModal";
import { AmbientSoundControl } from "../components/AmbientSoundControl";
import { BookFeedback } from "../components/BookFeedback";

/* ─── Route ──────────────────────────────────────────── */
export const Route = createFileRoute("/read/$chapterId")({
  head: ({ params }) => {
    const ch = chapters.find(c => c.id === params.chapterId);
    return { meta: [{ title: ch ? `${ch.title} — The Girl Who Forgot Her Earrings` : "Reading" }] };
  },
  component: ReadingPage,
});

/* ─── Part quotes ────────────────────────────────────── */
const PART_QUOTES: Record<number, string> = {
  1: 'Some people do not enter your life. They simply arrive, like rain you didn\'t expect.',
  2: 'The highest form of love is not possession. It is protection.',
  3: 'Words that rearrange the air around them.',
  4: 'Gratitude and grief are not opposites. They are neighbours.',
};

/* ─── Chapter transition quotes ──────────────────────── */
const TRANSITION_QUOTES = [
  'Some words sit in your chest for years before they learn how to become a sentence.',
  'She wasn\'t the ending. She was the ache that rewrote the beginning.',
  'And between the silence of two people, a whole story breathes.',
  'The things we don\'t say grow roots. They become forests.',
  'Every goodbye leaves a fingerprint that no hello can erase.',
  'Love doesn\'t disappear. It just changes the room it lives in.',
  'You carry people not in your hands, but in the pauses between your words.',
  'What is unsaid between two people could fill an ocean.',
  'Memory is not a photograph. It is a wound that glows in the dark.',
  'We don\'t lose people. We learn to carry them differently.',
  'Some chapters don\'t end. They just grow quieter.',
  'The space between two heartbeats holds more truth than any confession.',
  'She left a silence so loud, he spent years learning to unhear it.',
  'Not all stories end. Some just stop being told.',
];

/* ─── Render paragraph with annotations ──────────────── */
function AnnotatedText({ text, annotations, onNoteDotClick }: {
  text: string;
  annotations: Annotation[];
  onNoteDotClick: (ann: Annotation, e: React.MouseEvent) => void;
}) {
  if (!annotations.length) return <>{text}</>;

  // Sort by start offset
  const sorted = [...annotations].sort((a, b) => a.startOffset - b.startOffset);
  const parts: React.ReactNode[] = [];
  let cursor = 0;

  sorted.forEach((ann, i) => {
    const start = Math.max(0, Math.min(ann.startOffset, text.length));
    const end = Math.max(start, Math.min(ann.endOffset, text.length));

    if (start > cursor) {
      parts.push(<span key={`t-${i}`}>{text.slice(cursor, start)}</span>);
    }

    const slice = text.slice(start, end);
    const cls = ann.type === 'highlight' ? 'ann-highlight' : 'ann-underline';

    parts.push(
      <span key={`a-${i}`} className={cls}>{slice}
        {ann.note && (
          <span className="ann-note-dot" onClick={e => { e.stopPropagation(); onNoteDotClick(ann, e); }}>
            ●
          </span>
        )}
      </span>
    );
    cursor = end;
  });

  if (cursor < text.length) parts.push(<span key="tail">{text.slice(cursor)}</span>);
  return <>{parts}</>;
}

/* ─── Main ───────────────────────────────────────────── */
function ReadingPage() {
  const { chapterId } = Route.useParams();
  const ch = chapters.find(c => c.id === chapterId);
  if (!ch) return <div style={{ color: 'var(--fg)', padding: '2rem' }}>Chapter not found.</div>;
  return <Reader key={ch.id} ch={ch} />;
}

function Reader({ ch }: { ch: typeof chapters[0] }) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { annotations, addAnnotation, addNoteToAnnotation, removeAnnotation, allAnnotations } = useAnnotations(ch.id);
  const { reactions, toggleReaction, getReactionsForParagraph, hasReacted } = useReactions(ch.id);
  const { immersive, toggleImmersive, exitImmersive } = useImmersiveMode();
  const { addToShelf, isOnShelf } = useMemoryShelf();
  const { marks: unsaidMarks, toggleUnsaid, isMarked: isUnsaidMarked } = useUnsaid(ch.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrolling: autoScrolling, toggle: toggleAutoScroll, speed: autoScrollSpeed, setSpeed: setAutoScrollSpeed } = useAutoScroll(scrollRef, immersive);
  useTimeTheme();
  const bookmarked = isBookmarked(ch.id);

  const [fontSize, setFontSize] = useState(17);
  const [showToc, setShowToc] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showMemoryShelf, setShowMemoryShelf] = useState(false);
  const [showPartDivider, setShowPartDivider] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [noteInput, setNoteInput] = useState<{ text: string; pIdx: number; start: number; end: number } | null>(null);
  const [noteText, setNoteText] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<{ ann: Annotation; x: number; y: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const [shareText, setShareText] = useState<string | null>(null);
  const [expandedReactions, setExpandedReactions] = useState<number | null>(null);
  const emotionalStage = getStageForProgress(progress);

  // Next chapter
  const chIdx = chapters.findIndex(c => c.id === ch.id);
  const nextCh = chIdx < chapters.length - 1 ? chapters[chIdx + 1] : null;
  const transitionQuote = TRANSITION_QUOTES[chIdx % TRANSITION_QUOTES.length];

  const goToNextChapter = useCallback(() => {
    if (!nextCh) return;
    setShowTransition(true);
    setTimeout(() => {
      navigate({ to: '/read/$chapterId', params: { chapterId: nextCh.id } });
    }, 4000);
  }, [nextCh, navigate]);

  // Mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 769);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Font size persistence
  useEffect(() => {
    const s = localStorage.getItem('tgwfhe_fontSize');
    if (s) setFontSize(Number(s));
  }, []);

  const changeFontSize = useCallback((d: number) => {
    setFontSize(prev => {
      const n = Math.max(14, Math.min(21, prev + d));
      localStorage.setItem('tgwfhe_fontSize', String(n));
      return n;
    });
  }, []);

  // Part divider
  useEffect(() => {
    if (chIdx === 0) return;
    const prev = chapters[chIdx - 1];
    if (prev && prev.part !== ch.part) {
      setShowPartDivider(true);
      const t = setTimeout(() => setShowPartDivider(false), 3200);
      return () => clearTimeout(t);
    }
  }, [ch.id]);



  // Scroll-based progress
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = el.scrollHeight > el.clientHeight
      ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 100;
    setProgress(p);
    localStorage.setItem(`reading-progress-${ch.id}`, String(Math.round(p)));
    localStorage.setItem('tgwfhe_currentChapter', ch.id);
  }, [ch.id]);

  // Restore scroll position
  useEffect(() => {
    const saved = localStorage.getItem(`reading-progress-${ch.id}`);
    if (saved && scrollRef.current) {
      const pct = Number(saved) / 100;
      const el = scrollRef.current;
      requestAnimationFrame(() => {
        el.scrollTop = pct * (el.scrollHeight - el.clientHeight);
      });
    }
  }, [ch.id]);

  const handleTocNavigate = useCallback((cid: string) => {
    if (cid === '/') {
      navigate({ to: '/' });
    } else {
      navigate({ to: '/read/$chapterId', params: { chapterId: cid } });
    }
    setShowToc(false);
  }, [navigate]);

  // Annotation handlers
  const handleHighlight = useCallback((text: string, pIdx: number, start: number, end: number) => {
    addAnnotation({ chapterId: ch.id, paragraphIndex: pIdx, startOffset: start, endOffset: end, text, type: 'highlight' });
  }, [ch.id, addAnnotation]);

  const handleUnderline = useCallback((text: string, pIdx: number, start: number, end: number) => {
    addAnnotation({ chapterId: ch.id, paragraphIndex: pIdx, startOffset: start, endOffset: end, text, type: 'underline' });
  }, [ch.id, addAnnotation]);

  const handleAddNote = useCallback((text: string, pIdx: number, start: number, end: number) => {
    setNoteInput({ text, pIdx, start, end });
    setNoteText('');
  }, []);

  const saveNote = useCallback(() => {
    if (!noteInput) return;
    addAnnotation({
      chapterId: ch.id, paragraphIndex: noteInput.pIdx,
      startOffset: noteInput.start, endOffset: noteInput.end,
      text: noteInput.text, type: 'highlight', note: noteText.trim() || undefined,
    });
    setNoteInput(null); setNoteText('');
  }, [noteInput, noteText, ch.id, addAnnotation]);

  const handleNoteDotClick = useCallback((ann: Annotation, e: React.MouseEvent) => {
    setActiveTooltip(prev => prev?.ann.id === ann.id ? null : { ann, x: e.clientX, y: e.clientY });
  }, []);

  const handleReact = useCallback((emoji: string, text: string, pIdx: number) => {
    toggleReaction(emoji, pIdx, text);
  }, [toggleReaction]);

  const themeIcon = { night: '🌙', warm: '☀️', cool: '🧊', sepia: '📜' }[theme];

  return (
    <div className={`reader-root${immersive ? ' immersive' : ''}`} data-theme={theme} onClick={() => { setActiveTooltip(null); setExpandedReactions(null); }}>
      {/* Part divider */}
      <AnimatePresence>
        {showPartDivider && (
          <motion.div
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }} onClick={() => setShowPartDivider(false)}
          >
            <div className="part-divider">
              <p className="part-num">{partTitles[ch.part] ?? `Part ${ch.part}`}</p>
              <h2 className="part-title-text">{ch.partTitle}</h2>
              <hr className="part-hr" />
              <p className="part-quote">"{PART_QUOTES[ch.part] ?? ''}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chapter transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 300,
              background: 'var(--bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.15rem',
                lineHeight: 1.9,
                color: 'var(--fg)',
                textAlign: 'center',
                maxWidth: '520px',
                fontStyle: 'italic',
                opacity: 0.85,
              }}
            >
              "{transitionQuote}"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top toolbar — hidden in immersive mode */}
      {!immersive && (
        <div className="reader-toolbar" onClick={e => e.stopPropagation()} style={{ justifyContent: 'center' }}>
          <div className="toolbar-actions">
            <button className="tb-btn" onClick={() => changeFontSize(-1)} aria-label="Smaller">A<sup style={{fontSize:'0.6em'}}>−</sup></button>
            <button className="tb-btn" onClick={() => changeFontSize(1)} aria-label="Larger">A<sup style={{fontSize:'0.6em'}}>+</sup></button>
            <button className={`tb-btn ${bookmarked ? 'active' : ''}`} onClick={() => toggleBookmark(ch.id)}>🔖</button>
            <button className="tb-btn" onClick={() => setShowMemoryShelf(true)} title="Memory Shelf">◫</button>
            <button className="tb-btn" onClick={() => setShowAnnotations(true)} title="Annotations">✎</button>
            <button className="tb-btn" onClick={() => setShowToc(true)}>☰</button>
            <button
              className={`tb-btn ${immersive ? 'active' : ''}`}
              onClick={toggleImmersive}
              title="Immersive Mode"
              style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}
            >⊙</button>
          </div>
        </div>
      )}

      {bookmarked && <div className="bookmark-ribbon" style={{ position: 'absolute', top: 0, right: 20, zIndex: 51 }} />}

      {/* Scrollable card */}
      <div className="reader-card-wrapper">
        <div className="reader-card">
          {/* Cinematic blobs INSIDE the card - subtle ambient glow */}
          <div className="card-blob-layer" aria-hidden>
            <div className="ink-bloom" />
          </div>

          {/* Scrollable text content */}
          <div className="card-scroll" ref={scrollRef} onScroll={handleScroll}>
            <div className="card-chapter-header">
              <span className="card-chapter-label">
                {ch.chapterNumber === 0 ? 'Prologue' : ch.chapterNumber === 14 ? 'Epilogue' : `Chapter ${ch.chapterNumber}`}
              </span>
              <h1 className="card-chapter-title">{ch.title}</h1>
              <div className="chapter-rule" />
            </div>

            {ch.content.map((b, i) => {
              if (b.type === 'divider') return <div key={i} className="scene-break">✦</div>;

              const isDropCap = i === 0 && b.type === 'paragraph';
              const paraReactions = getReactionsForParagraph(i);
              const isPullquote = b.type === 'pullquote';
              const unsaid = isUnsaidMarked(i);

              return (
                <div
                  key={i}
                  className={`para-with-reactions${unsaid ? ' unsaid-marked' : ''}`}
                  style={{ animationDelay: `${Math.min(i * 0.15, 2)}s` }}
                >
                  {isPullquote ? (
                    <div style={{ position: 'relative' }}>
                      <blockquote
                        className="pull-quote pause-moment"
                        style={{ fontSize }}
                        data-paragraph-index={i}
                      >
                        {b.text}
                      </blockquote>
                      {/* Share pullquote */}
                      <button
                        className="quote-share-btn"
                        onClick={e => { e.stopPropagation(); setShareText(b.text ?? ''); }}
                        title="Share as card"
                      >↗</button>
                    </div>
                  ) : (
                    <p
                      className={`body-text${isDropCap ? ' drop-cap' : ''}`}
                      style={{ fontSize }}
                      data-paragraph-index={i}
                    >
                      {b.text}
                    </p>
                  )}

                  {/* Reaction pills — shown only if reacted */}
                  {paraReactions.length > 0 && (
                    <div className="reaction-pills" onClick={e => e.stopPropagation()}>
                      {paraReactions.map(r => (
                        <span
                          key={r.id}
                          className="reaction-pill"
                          onClick={() => toggleReaction(r.type, i, b.text ?? '')}
                          title="Tap to remove"
                        >
                          {r.type}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="card-chapter-end">✦ ✦ ✦</div>

            {/* Feedback — only on last chapter */}
            {ch.id === 'chapter-14' && <BookFeedback />}

            {/* Next Chapter CTA */}
            {nextCh && (
              <div style={{ textAlign: 'center', padding: '0 0 3rem' }}>
                <button className="cover-begin-btn" onClick={goToNextChapter}>
                  Next Chapter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Annotation toolbar */}
      <AnnotationToolbar
        onHighlight={handleHighlight}
        onUnderline={handleUnderline}
        onAddNote={handleAddNote}
        onSave={(text, _pIdx) => addToShelf({ contentType: 'highlight', text, context: ch.title, chapterId: ch.id })}
        onReact={handleReact}
      />

      {/* Note tooltip */}
      {activeTooltip && (
        <div className="note-tooltip" style={{
          left: Math.max(8, Math.min(activeTooltip.x - 140, window.innerWidth - 288)),
          top: Math.max(8, activeTooltip.y - 80),
        }} onClick={e => e.stopPropagation()}>
          <div className="note-tooltip-arrow" />
          {activeTooltip.ann.note}
        </div>
      )}

      {/* Note input modal */}
      {noteInput && (
        <div className="note-input-modal" onClick={() => setNoteInput(null)}>
          <div className="note-input-card" onClick={e => e.stopPropagation()}>
            <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--accent)', marginBottom: '0.5rem' }}>
              Add Note
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', fontStyle: 'italic', marginBottom: '0.75rem', lineHeight: 1.5 }}>
              "{noteInput.text.length > 80 ? noteInput.text.slice(0, 80) + '…' : noteInput.text}"
            </p>
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Write your note…"
              autoFocus
            />
            <div className="note-input-actions">
              <button className="note-btn-cancel" onClick={() => setNoteInput(null)}>Cancel</button>
              <button className="note-btn-save" onClick={saveNote}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar — hidden in immersive mode */}
      {!immersive && (
        <div className="reader-bottom" onClick={e => e.stopPropagation()}>
          <span className="page-label" style={{ color: emotionalStage.color, transition: 'color 1.5s ease' }}>
            {emotionalStage.label}
          </span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%`, background: emotionalStage.color, transition: 'width 0.3s, background 1.5s ease' }} />
          </div>
        </div>
      )}

      {/* Immersive mode floating controls */}
      {immersive && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(10,12,20,0.9)',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '999px',
            padding: '0.45rem 1rem',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Play/Pause */}
          <button
            onClick={toggleAutoScroll}
            style={{
              background: autoScrolling ? 'rgba(201,168,76,0.15)' : 'none',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '50%',
              width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#c9a84c', fontSize: '1rem',
              transition: 'all 0.2s',
            }}
            title={autoScrolling ? 'Pause scroll' : 'Start auto-scroll'}
          >
            {autoScrolling ? '⏸' : '▶'}
          </button>

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          {/* Speed buttons */}
          {(['slow', 'medium', 'fast'] as const).map(s => (
            <button
              key={s}
              onClick={() => setAutoScrollSpeed(s)}
              style={{
                background: autoScrollSpeed === s ? 'rgba(201,168,76,0.15)' : 'none',
                border: 'none',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                cursor: 'pointer',
                color: autoScrollSpeed === s ? '#c9a84c' : 'rgba(255,255,255,0.35)',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                fontFamily: "'Palatino Linotype', Georgia, serif",
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {s}
            </button>
          ))}

          {/* Divider */}
          <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

          {/* Exit */}
          <button
            onClick={exitImmersive}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', color: 'rgba(255,255,255,0.3)',
              fontSize: '0.7rem', fontFamily: "'Palatino Linotype', Georgia, serif",
              letterSpacing: '0.1em',
              transition: 'color 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
            onMouseOut={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            exit
          </button>
        </motion.div>
      )}

      {/* Ambient Sound */}
      <AmbientSoundControl />

      {/* ToC */}
      {showToc && <TocDrawer currentChapterId={ch.id} onNavigate={handleTocNavigate} onClose={() => setShowToc(false)} />}

      {/* Annotations panel */}
      {showAnnotations && <AnnotationsPanel annotations={annotations} onClose={() => setShowAnnotations(false)} onRemove={removeAnnotation} />}

      {/* Memory Shelf */}
      {showMemoryShelf && <MemoryShelf onClose={() => setShowMemoryShelf(false)} />}

      {/* Quote Share */}
      {shareText && (
        <QuoteShareModal
          text={shareText}
          chapterTitle={ch.title}
          onClose={() => setShareText(null)}
        />
      )}
    </div>
  );
}
