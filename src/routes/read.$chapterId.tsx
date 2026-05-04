import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import { chapters, partColors, partTitles, type Chapter, type ContentBlock } from "../data/chapters";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme, themeLabels, type ReadingTheme } from "../hooks/useTheme";
import { useBookmarks } from "../hooks/useBookmarks";
import { useHighlights } from "../hooks/useHighlights";

export const Route = createFileRoute("/read/$chapterId")({
  head: ({ params }) => {
    const ch = chapters.find((c) => c.id === params.chapterId);
    return {
      meta: [
        { title: ch ? `${ch.title} — The Girl Who Forgot Her Earrings` : "Reading" },
        { name: "description", content: ch?.teaser || "" },
      ],
    };
  },
  component: ReadingPage,
});

function ReadingPage() {
  const { chapterId } = Route.useParams();
  const ch = chapters.find((c) => c.id === chapterId);

  if (!ch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold italic" style={{ fontFamily: 'var(--font-display)' }}>Chapter not found</h1>
          <Link to="/chapters" className="btn-gold mt-6 inline-block">Back to Chapters</Link>
        </div>
      </div>
    );
  }

  return <ReaderContent ch={ch} />;
}

function ReaderContent({ ch }: { ch: Chapter }) {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const dur = reduceMotion ? 0 : 0.6;

  const chapterIndex = chapters.indexOf(ch);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const [progress, setProgress] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const lastScrollY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { highlights, notes, allHighlights, allNotes, addHighlight, removeHighlight, addNote, removeNote } = useHighlights(ch.id);

  const bookmarked = isBookmarked(ch.id);

  const { scrollYProgress } = useScroll();
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest * 100);
  });

  // Scroll direction for toolbar
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY;
      if (y < 100) {
        setToolbarVisible(true);
      } else if (y > lastScrollY.current + 5) {
        setToolbarVisible(false);
        setShowThemePanel(false);
      } else if (y < lastScrollY.current - 5) {
        setToolbarVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Save progress
  useEffect(() => {
    if (progress > 5) {
      localStorage.setItem(`reading-progress-${ch.id}`, String(Math.round(progress)));
      localStorage.setItem('tgwfhe_currentChapter', ch.id);
    }
  }, [progress, ch.id]);

  // Font size persistence
  useEffect(() => {
    const saved = localStorage.getItem('tgwfhe_fontSize');
    if (saved) setFontSize(Number(saved));
  }, []);

  const changeFontSize = useCallback((delta: number) => {
    setFontSize((prev) => {
      const next = Math.max(14, Math.min(28, prev + delta));
      localStorage.setItem('tgwfhe_fontSize', String(next));
      return next;
    });
  }, []);

  // Chapter entrance
  const [showContent, setShowContent] = useState(false);
  const isDiagnosis = ch.id === 'chapter-9';
  useEffect(() => {
    setShowContent(false);
    const t = setTimeout(() => setShowContent(true), reduceMotion ? 0 : (isDiagnosis ? 1500 : 600));
    window.scrollTo(0, 0);
    return () => clearTimeout(t);
  }, [ch.id, reduceMotion, isDiagnosis]);

  const isFirstParagraph = (idx: number) => {
    for (let i = 0; i <= idx; i++) {
      if (ch.content[i].type === 'paragraph') return i === idx;
    }
    return false;
  };

  // Special treatments
  const isEpilogue = ch.id === 'chapter-14';
  const isWedding = ch.id === 'chapter-1';
  const isPrologue = ch.id === 'prologue';
  const isLastDay = ch.id === 'chapter-13';

  return (
    <div className="grain-overlay vignette min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Wedding petals */}
      {isWedding && !reduceMotion && <FallingPetals />}

      {/* Bookmark ribbon */}
      {bookmarked && <div className="bookmark-ribbon fixed" style={{ top: 0, right: 24, zIndex: 51 }} />}

      {/* Sticky toolbar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 frosted"
        initial={{ y: 0 }}
        animate={{ y: toolbarVisible ? 0 : -80 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-12">
          <Link
            to="/chapters"
            className="text-xs tracking-wider truncate max-w-[30%]"
            style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
          >
            ← {ch.title}
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => changeFontSize(-2)}
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)', fontSize: '11px' }}
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={() => changeFontSize(2)}
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)', fontSize: '14px' }}
              aria-label="Increase font size"
            >
              A+
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setShowThemePanel(p => !p)}
              className="w-8 h-8 flex items-center justify-center rounded text-sm"
              aria-label="Change theme"
            >
              🎨
            </button>

            {/* Bookmark */}
            <button
              onClick={() => {
                toggleBookmark(ch.id);
                if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
              }}
              className="w-8 h-8 flex items-center justify-center rounded text-sm"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? '🔖' : '📑'}
            </button>

            {/* Notes panel */}
            <button
              onClick={() => setShowNotesPanel(p => !p)}
              className="w-8 h-8 flex items-center justify-center rounded text-sm relative"
              aria-label="Notes & highlights"
            >
              📝
              {(highlights.length + notes.length) > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] flex items-center justify-center"
                  style={{ background: 'var(--gold)', color: 'var(--background)' }}>
                  {highlights.length + notes.length}
                </span>
              )}
            </button>

            {prevChapter && (
              <Link to="/read/$chapterId" params={{ chapterId: prevChapter.id }}
                className="w-8 h-8 flex items-center justify-center" style={{ color: 'var(--gold-muted)' }}
                aria-label="Previous chapter">‹</Link>
            )}
            {nextChapter && (
              <Link to="/read/$chapterId" params={{ chapterId: nextChapter.id }}
                className="w-8 h-8 flex items-center justify-center" style={{ color: 'var(--gold-muted)' }}
                aria-label="Next chapter">›</Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[2px]" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>

        {/* Theme panel dropdown */}
        <AnimatePresence>
          {showThemePanel && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-14 rounded-lg p-3 z-50"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <div className="flex gap-2">
                {(Object.keys(themeLabels) as ReadingTheme[]).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); setShowThemePanel(false); }}
                    className={`theme-btn ${theme === t ? 'active' : ''}`}
                    title={themeLabels[t].label}
                  >
                    {themeLabels[t].emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Notes/Highlights Panel */}
      <AnimatePresence>
        {showNotesPanel && (
          <NotesPanel
            highlights={highlights}
            notes={notes}
            onClose={() => setShowNotesPanel(false)}
            onRemoveHighlight={removeHighlight}
            onRemoveNote={removeNote}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div ref={contentRef} className="pt-20 pb-32 px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Chapter header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: isDiagnosis ? (showContent ? 1 : 0) : 1 }}
            transition={{ duration: isDiagnosis ? 1.5 : dur, ease }}
          >
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-ui)', color: partColors[ch.part] }}>
              {partTitles[ch.part]}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold italic" style={{ fontFamily: 'var(--font-display)' }}>
              {ch.chapterNumber === 0 ? 'Prologue' : ch.chapterNumber === 14 ? 'Epilogue' : `Chapter ${ch.chapterNumber}`}
            </h1>
            <h2 className="mt-2 text-xl md:text-2xl italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}>
              {ch.title}
            </h2>
            <div className="ornament-divider mt-6">✦</div>
          </motion.div>

          {/* Story content */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: isDiagnosis ? 2 : dur * 1.5 }}
            >
              {ch.content.map((block, idx) => {
                if (block.type === 'divider') {
                  return <div key={idx} className="ornament-divider">✦</div>;
                }

                if (block.type === 'pullquote') {
                  const isTrembling = isDiagnosis && idx === ch.content.findIndex(b => b.type === 'pullquote');
                  return (
                    <motion.blockquote
                      key={idx}
                      className={`pull-quote ${isTrembling && !reduceMotion ? 'tremble' : ''}`}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                    >
                      {block.text}
                    </motion.blockquote>
                  );
                }

                const isFirst = isFirstParagraph(idx);
                const isLastParagraphs = isLastDay && idx > ch.content.length - 6;
                const noteForParagraph = notes.find(n => n.paragraphIndex === idx);

                return (
                  <div key={idx} className="relative">
                    {isPrologue && isFirst ? (
                      <PrologueStagger block={block} fontSize={fontSize} reduceMotion={reduceMotion} />
                    ) : (
                      <p
                        className={isFirst ? 'drop-cap' : ''}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: `${fontSize}px`,
                          lineHeight: isLastParagraphs ? 2.1 : 1.9,
                          marginBottom: '1.5em',
                          color: 'var(--foreground)',
                        }}
                      >
                        {block.text}
                      </p>
                    )}
                    {noteForParagraph && (
                      <span className="absolute -right-2 top-0 cursor-pointer text-sm" title={noteForParagraph.noteText}>
                        📝
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Epilogue final line */}
              {isEpilogue && (
                <motion.div
                  className="text-center mt-20 mb-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 3, delay: 0.5 }}
                >
                  <p className="text-2xl md:text-3xl italic"
                    style={{ fontFamily: 'var(--font-quote)', color: 'var(--foreground)' }}>
                    She was listening.
                  </p>
                  <div className="ornament-divider mt-8">✦</div>
                  <p className="text-xs tracking-[0.3em] uppercase mt-4"
                    style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}>
                    The End
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Chapter end navigation */}
          <div className="mt-16">
            <div className="ornament-divider">❧</div>

            {nextChapter && (
              <div className="text-center mt-8">
                <p className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}>
                  Next Chapter
                </p>
                <p className="text-xl italic mb-6"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}>
                  {nextChapter.title}
                </p>
                <Link to="/read/$chapterId" params={{ chapterId: nextChapter.id }} className="btn-gold">
                  Continue →
                </Link>
              </div>
            )}

            {!nextChapter && !isEpilogue && (
              <div className="text-center mt-8">
                <Link to="/chapters" className="btn-gold">
                  Back to Chapters
                </Link>
              </div>
            )}

            {isEpilogue && (
              <div className="text-center mt-8">
                <p className="text-sm italic mb-6"
                  style={{ fontFamily: 'var(--font-quote)', color: 'var(--muted-foreground)' }}>
                  Thank you for reading.
                </p>
                <Link to="/chapters" className="btn-gold">
                  Return to Chapters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mobile-nav md:hidden">
        <div className="flex items-center justify-around py-2">
          {[
            { to: '/' as const, label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { to: '/chapters' as const, label: 'Chapters', icon: 'M4 6h16M4 12h16M4 18h7' },
          ].map((item) => (
            <Link key={item.label} to={item.to}
              className="flex flex-col items-center gap-1 py-1 px-4 min-h-[44px] justify-center"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
              activeProps={{ style: { color: 'var(--gold)' } }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] tracking-wider">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={() => toggleBookmark(ch.id)}
            className="flex flex-col items-center gap-1 py-1 px-4 min-h-[44px] justify-center"
            style={{ color: bookmarked ? 'var(--gold)' : 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-[10px] tracking-wider">Bookmark</span>
          </button>
          <button
            onClick={() => setShowThemePanel(p => !p)}
            className="flex flex-col items-center gap-1 py-1 px-4 min-h-[44px] justify-center"
            style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
          >
            <span className="text-lg">🎨</span>
            <span className="text-[10px] tracking-wider">Theme</span>
          </button>
        </div>

        {/* Mobile theme panel */}
        <AnimatePresence>
          {showThemePanel && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-0 right-0 p-4"
              style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}
            >
              <div className="flex justify-center gap-3">
                {(Object.keys(themeLabels) as ReadingTheme[]).map(t => (
                  <button key={t} onClick={() => { setTheme(t); setShowThemePanel(false); }}
                    className={`theme-btn ${theme === t ? 'active' : ''}`}
                    style={{ width: 48, height: 48, fontSize: 18 }}
                    title={themeLabels[t].label}>
                    <span>{themeLabels[t].emoji}</span>
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-xs" style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}>
                {themeLabels[theme].label}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function PrologueStagger({ block, fontSize, reduceMotion }: { block: ContentBlock; fontSize: number; reduceMotion: boolean | null }) {
  return (
    <motion.p
      className="drop-cap"
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: `${fontSize}px`,
        lineHeight: 1.9,
        marginBottom: '1.5em',
        color: 'var(--foreground)',
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 1.2 }}
    >
      {block.text}
    </motion.p>
  );
}

function FallingPetals() {
  const petals = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    delay: Math.random() * 3,
    duration: 6 + Math.random() * 4,
    size: 8 + Math.random() * 6,
  }));

  return (
    <>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}%`,
            top: '-20px',
            width: p.size,
            height: p.size,
            borderRadius: '50% 0 50% 50%',
            background: `hsl(${30 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${60 + Math.random() * 15}%)`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        />
      ))}
    </>
  );
}

function NotesPanel({ highlights, notes, onClose, onRemoveHighlight, onRemoveNote }: {
  highlights: any[];
  notes: any[];
  onClose: () => void;
  onRemoveHighlight: (id: string) => void;
  onRemoveNote: (id: string) => void;
}) {
  return (
    <motion.div
      className="fixed inset-y-0 right-0 w-80 max-w-full z-[60] overflow-y-auto"
      style={{ background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold italic" style={{ fontFamily: 'var(--font-display)' }}>
            Notes & Highlights
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-lg"
            style={{ color: 'var(--muted-foreground)' }}>✕</button>
        </div>

        {highlights.length === 0 && notes.length === 0 && (
          <p className="text-sm italic" style={{ fontFamily: 'var(--font-quote)', color: 'var(--muted-foreground)' }}>
            No notes or highlights yet. Select text while reading to add them.
          </p>
        )}

        {highlights.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-ui)', color: 'var(--gold-muted)' }}>
              Highlights ({highlights.length})
            </h4>
            {highlights.map(h => (
              <div key={h.id} className="mb-3 p-3 rounded" style={{ background: 'var(--card)' }}>
                <p className={`text-sm highlight-${h.color}`} style={{ fontFamily: 'var(--font-body)' }}>
                  {h.text}
                </p>
                <button onClick={() => onRemoveHighlight(h.id)}
                  className="text-[10px] mt-1" style={{ color: 'var(--muted-foreground)' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {notes.length > 0 && (
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-ui)', color: 'var(--gold-muted)' }}>
              Sticky Notes ({notes.length})
            </h4>
            {notes.map(n => (
              <div key={n.id} className="sticky-note mb-3"
                style={{ transform: `rotate(${n.rotation}deg)` }}>
                <p className="text-sm" style={{ color: '#2C1810' }}>{n.noteText}</p>
                <p className="text-[10px] mt-2" style={{ color: '#6B5A48' }}>
                  "{n.text?.slice(0, 50)}..."
                </p>
                <button onClick={() => onRemoveNote(n.id)}
                  className="text-[10px] mt-1" style={{ color: '#8B6914' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
