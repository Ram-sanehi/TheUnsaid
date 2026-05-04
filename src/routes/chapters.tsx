import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { chapters, partColors, partTitles } from "../data/chapters";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/chapters")({
  head: () => ({
    meta: [
      { title: "Chapters — The Girl Who Forgot Her Earrings" },
      { name: "description", content: "Browse all chapters of the novel by Raj Vishwakarma." },
      { property: "og:title", content: "Chapters — The Girl Who Forgot Her Earrings" },
      { property: "og:description", content: "Browse all 15 chapters across 4 parts of this deeply emotional Indian love story." },
    ],
  }),
  component: ChaptersPage,
});

function ChaptersPage() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const dur = reduceMotion ? 0 : 0.6;

  let lastPart = -1;

  return (
    <div className="grain-overlay vignette min-h-screen">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs tracking-widest uppercase mb-12"
          style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
        >
          ← Home
        </Link>

        <motion.h1
          className="text-3xl md:text-4xl font-bold italic mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease }}
        >
          Table of Contents
        </motion.h1>

        <div className="ornament-divider mb-8">✦</div>

        <div className="space-y-4">
          {chapters.map((ch, i) => {
            const showPartHeader = ch.part !== lastPart;
            lastPart = ch.part;

            return (
              <div key={ch.id}>
                {showPartHeader && (
                  <motion.div
                    className="py-6 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: dur }}
                  >
                    <p
                      className="text-xs tracking-[0.3em] uppercase"
                      style={{ fontFamily: 'var(--font-ui)', color: partColors[ch.part] }}
                    >
                      {partTitles[ch.part]}
                    </p>
                    <p className="mt-1 italic text-sm" style={{ fontFamily: 'var(--font-quote)', color: 'var(--muted-foreground)' }}>
                      {ch.partTitle}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: dur, ease, delay: (i % 5) * 0.08 }}
                >
                  <Link
                    to="/read/$chapterId"
                    params={{ chapterId: ch.id }}
                    className="chapter-card block rounded-lg p-5 md:p-6"
                    style={{
                      backgroundColor: 'var(--card)',
                      borderLeftWidth: '3px',
                      borderLeftColor: partColors[ch.part],
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase"
                        style={{ fontFamily: 'var(--font-ui)', color: partColors[ch.part] }}
                      >
                        {ch.chapterNumber === 0 ? 'Prologue' : `Chapter ${ch.chapterNumber}`}
                      </span>
                      <span
                        className="text-[10px] tracking-wider"
                        style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
                      >
                        {ch.readTimeMinutes} min read
                      </span>
                    </div>

                    <h2
                      className="text-lg md:text-xl font-bold italic"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--foreground)' }}
                    >
                      {ch.title}
                    </h2>

                    <p
                      className="mt-2 text-sm leading-relaxed line-clamp-2"
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)' }}
                    >
                      {ch.teaser}
                    </p>
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
