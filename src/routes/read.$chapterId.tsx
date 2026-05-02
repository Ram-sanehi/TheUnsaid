import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion, useMotionValueEvent, useScroll } from "framer-motion";
import { chapters, partColors, partTitles } from "../../data/chapters";
import { useState, useEffect, useRef, useCallback } from "react";

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

  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const dur = reduceMotion ? 0 : 0.6;

  const chapterIndex = chapters.indexOf(ch);
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const [progress, setProgress] = useState(0);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const lastScrollY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);

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
      localStorage.setItem('last-chapter', ch.id);
    }
  }, [progress, ch.id]);

  // Font size persistence
  useEffect(() => {
    const saved = localStorage.getItem('reader-font-size');
    if (saved) setFontSize(Number(saved));
  }, []);

  const changeFontSize = useCallback((delta: number) => {
    setFontSize((prev) => {
      const next = Math.max(14, Math.min(28, prev + delta));
      localStorage.setItem('reader-font-size', String(next));
      return next;
    });
  }, []);

  // Chapter entrance animation
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    setShowContent(false);
    const t = setTimeout(() => setShowContent(true), reduceMotion ? 0 : 600);
    window.scrollTo(0, 0);
    return () => clearTimeout(t);
  }, [chapterId, reduceMotion]);

  const isFirstParagraph = (idx: number) => {
    for (let i = 0; i <= idx; i++) {
      if (ch.content[i].type === 'paragraph') return i === idx;
    }
    return false;
  };

  return (
    <div className="grain-overlay min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sticky toolbar */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 frosted"
        initial={{ y: 0 }}
        animate={{ y: toolbarVisible ? 0 : -60 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 h-12">
          <Link
            to="/chapters"
            className="text-xs tracking-wider truncate max-w-[40%]"
            style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
          >
            ← {ch.title}
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => changeFontSize(-2)}
              className="w-8 h-8 flex items-center justify-center rounded"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)', fontSize: '12px' }}
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

            {prevChapter && (
              <Link
                to="/read/$chapterId"
                params={{ chapterId: prevChapter.id }}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: 'var(--gold-muted)' }}
                aria-label="Previous chapter"
              >
                ‹
              </Link>
            )}
            {nextChapter && (
              <Link
                to="/read/$chapterId"
                params={{ chapterId: nextChapter.id }}
                className="w-8 h-8 flex items-center justify-center"
                style={{ color: 'var(--gold-muted)' }}
                aria-label="Next chapter"
              >
                ›
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-[2px]" style={{ backgroundColor: 'rgba(201,168,76,0.1)' }}>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </motion.header>

      {/* Content */}
      <div ref={contentRef} className="pt-20 pb-32 px-6">
        <div className="max-w-[680px] mx-auto">
          {/* Chapter header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur, ease }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-ui)', color: partColors[ch.part] }}
            >
              {partTitles[ch.part]}
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold italic"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {ch.chapterNumber === 0 ? 'Prologue' : `Chapter ${ch.chapterNumber}`}
            </h1>
            <h2
              className="mt-2 text-xl md:text-2xl italic"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}
            >
              {ch.title}
            </h2>
            <div className="ornament-divider mt-6">✦</div>
          </motion.div>

          {/* Story content */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: dur * 1.5 }}
            >
              {ch.content.map((block, idx) => {
                if (block.type === 'divider') {
                  return (
                    <div key={idx} className="ornament-divider">✦</div>
                  );
                }

                if (block.type === 'pullquote') {
                  return (
                    <blockquote key={idx} className="pull-quote">
                      {block.text}
                    </blockquote>
                  );
                }

                const isFirst = isFirstParagraph(idx);

                return (
                  <p
                    key={idx}
                    className={isFirst ? 'drop-cap' : ''}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: `${fontSize}px`,
                      lineHeight: 1.9,
                      marginBottom: '1.5em',
                      color: 'var(--foreground)',
                    }}
                  >
                    {block.text}
                  </p>
                );
              })}
            </motion.div>
          )}

          {/* Chapter end */}
          <div className="mt-16">
            <div className="ornament-divider">❧</div>

            {nextChapter && (
              <div className="text-center mt-8">
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
                >
                  Next Chapter
                </p>
                <p
                  className="text-xl italic mb-6"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}
                >
                  {nextChapter.title}
                </p>
                <Link
                  to="/read/$chapterId"
                  params={{ chapterId: nextChapter.id }}
                  className="btn-gold"
                >
                  Continue →
                </Link>
              </div>
            )}

            {!nextChapter && (
              <div className="text-center mt-8">
                <p className="text-lg italic" style={{ fontFamily: 'var(--font-quote)', color: 'var(--gold-light)' }}>
                  More chapters coming soon...
                </p>
                <Link to="/chapters" className="btn-gold mt-6 inline-block">
                  Back to Chapters
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
            <Link
              key={item.label}
              to={item.to}
              className="flex flex-col items-center gap-1 py-1 px-4 min-h-[44px] justify-center"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-ui)' }}
              activeProps={{ style: { color: 'var(--gold)' } }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <span className="text-[10px] tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
