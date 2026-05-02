import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { GoldParticles } from "../components/GoldParticles";
import { chapters, partTitles } from "../data/chapters";
import { useEffect, useState, useRef } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Girl Who Forgot Her Earrings — Raj Vishwakarma" },
      { name: "description", content: "She forgot her earrings. He kept them forever. A deeply emotional Indian love story by Raj Vishwakarma." },
      { property: "og:title", content: "The Girl Who Forgot Her Earrings" },
      { property: "og:description", content: "She forgot her earrings. He kept them forever." },
    ],
  }),
  component: CoverPage,
});

function CoverPage() {
  const reduceMotion = useReducedMotion();
  const aboutRef = useRef<HTMLDivElement>(null);

  const ease = [0.22, 1, 0.36, 1] as const;
  const dur = reduceMotion ? 0 : 0.6;
  const stagger = reduceMotion ? 0 : 0.08;

  return (
    <div className="grain-overlay">
      {/* COVER SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden vignette">
        <GoldParticles />

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
          <motion.img
            src="/images/book-cover.jpg"
            alt="The Girl Who Forgot Her Earrings book cover"
            className="w-56 md:w-72 rounded shadow-2xl breathe"
            style={{ boxShadow: '0 30px 80px rgba(201, 168, 76, 0.15)' }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur * 1.5, ease }}
          />

          <motion.h1
            className="mt-10 text-3xl md:text-5xl font-bold italic leading-tight"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', color: 'var(--foreground)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease, delay: stagger * 2 }}
          >
            The Girl Who Forgot<br />Her Earrings
          </motion.h1>

          <motion.p
            className="mt-5 text-lg md:text-xl italic"
            style={{ fontFamily: 'var(--font-quote)', color: 'var(--gold)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease, delay: stagger * 4 }}
          >
            She forgot her earrings. He kept them forever.
          </motion.p>

          <motion.p
            className="mt-4 text-xs tracking-[0.25em] uppercase"
            style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease, delay: stagger * 6 }}
          >
            Raj Vishwakarma
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: dur, ease, delay: stagger * 8 }}
            className="mt-10"
          >
            <Link to="/chapters" className="btn-gold">
              Begin Reading
            </Link>
          </motion.div>
        </div>

        <motion.button
          onClick={() => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 bounce-arrow"
          style={{ color: 'var(--gold-muted)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          aria-label="Scroll to about section"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.button>
      </section>

      {/* ABOUT SECTION */}
      <section ref={aboutRef} className="relative py-24 px-6 md:px-12 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: dur, ease }}
          >
            <blockquote className="pull-quote text-xl md:text-2xl" style={{ border: 'none', padding: 0, background: 'none' }}>
              <span style={{ color: 'var(--gold-light)', fontFamily: 'var(--font-quote)' }}>
                "Some people do not enter your life. They simply arrive, like rain you didn't expect — unannounced, unhurried, and completely impossible to forget."
              </span>
            </blockquote>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: dur, ease, delay: stagger * 2 }}
          >
            <p style={{ fontFamily: 'var(--font-body)', lineHeight: 1.9, color: 'var(--muted-foreground)', fontSize: '1rem' }}>
              A deeply emotional Indian love story about Aarav and Palak — meeting at a wedding, 
              falling in love through small gestures, and learning that some things we keep 
              are the most important things we'll ever hold.
            </p>
          </motion.div>
        </div>

        {/* Character cards */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:gap-6 max-w-md mx-auto">
          {[
            { name: 'Aarav', line: 'An architect who keeps things carefully', icon: '🏠' },
            { name: 'Palak', line: 'A designer who leaves pieces of herself behind', icon: '✦' },
          ].map((char, i) => (
            <motion.div
              key={char.name}
              className="chapter-card rounded-lg p-5 text-center"
              style={{ backgroundColor: 'var(--card)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: dur, ease, delay: stagger * (i + 1) }}
            >
              <span className="text-2xl">{char.icon}</span>
              <h3 className="mt-2 text-lg font-bold italic" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-light)' }}>
                {char.name}
              </h3>
              <p className="mt-1 text-xs" style={{ fontFamily: 'var(--font-ui)', color: 'var(--muted-foreground)' }}>
                {char.line}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA to chapters */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/chapters" className="btn-gold">
            Explore Chapters
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
