import { useRef, useState, useCallback, useEffect } from 'react';

export type ScrollSpeed = 'slow' | 'medium' | 'fast';

const SPEED_PX_PER_SEC: Record<ScrollSpeed, number> = {
  slow:   18,
  medium: 35,
  fast:   65,
};

export function useAutoScroll(containerRef: React.RefObject<HTMLDivElement | null>, active: boolean) {
  const [scrolling, setScrolling] = useState(false);
  const [speed, setSpeed]         = useState<ScrollSpeed>('medium');

  // Internal refs — never cause re-renders
  const rafRef          = useRef<number | null>(null);
  const lastTimeRef     = useRef<number | null>(null);
  const accumRef        = useRef(0);           // fractional pixel accumulator
  const pausedRef       = useRef(false);
  const pauseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedRef        = useRef<ScrollSpeed>('medium');
  const scrollingRef    = useRef(false);

  // Keep refs in sync with state
  useEffect(() => { speedRef.current = speed; }, [speed]);
  useEffect(() => { scrollingRef.current = scrolling; }, [scrolling]);

  const stopRaf = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    lastTimeRef.current = null;
    accumRef.current = 0;
  }, []);

  const tick = useCallback((ts: number) => {
    const el = containerRef.current;
    if (!el) { rafRef.current = requestAnimationFrame(tick); return; }

    if (!pausedRef.current && lastTimeRef.current !== null) {
      const delta = ts - lastTimeRef.current;
      accumRef.current += (SPEED_PX_PER_SEC[speedRef.current] * delta) / 1000;

      // Only scroll whole pixels to avoid sub-pixel jitter
      const px = Math.floor(accumRef.current);
      if (px >= 1) {
        el.scrollTop += px;
        accumRef.current -= px;
      }

      // Stop at bottom
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) {
        setScrolling(false);
        return;
      }
    }

    lastTimeRef.current = ts;
    rafRef.current = requestAnimationFrame(tick);
  }, [containerRef]);

  // Start / stop rAF based on scrolling state
  useEffect(() => {
    const el = containerRef.current;
    if (scrolling) {
      // Disable CSS smooth scroll so rAF has full control
      if (el) el.style.scrollBehavior = 'auto';
      lastTimeRef.current = null;
      accumRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      stopRaf();
      // Restore CSS smooth scroll
      if (el) el.style.scrollBehavior = '';
    }
    return stopRaf;
  }, [scrolling, tick, stopRaf, containerRef]);

  // Stop when immersive mode exits
  useEffect(() => {
    if (!active) setScrolling(false);
  }, [active]);

  // Pause on user wheel / touch, auto-resume after 2s
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const pause = () => {
      if (!scrollingRef.current) return;
      pausedRef.current = true;
      lastTimeRef.current = null; // reset delta to avoid jump on resume
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => { pausedRef.current = false; }, 2000);
    };

    el.addEventListener('wheel',      pause, { passive: true });
    el.addEventListener('touchstart', pause, { passive: true });
    return () => {
      el.removeEventListener('wheel',      pause);
      el.removeEventListener('touchstart', pause);
    };
  }, [containerRef]);

  const toggle         = useCallback(() => setScrolling(s => !s), []);
  const setSpeedSynced = useCallback((s: ScrollSpeed) => {
    speedRef.current = s;
    setSpeed(s);
  }, []);

  return { scrolling, toggle, speed, setSpeed: setSpeedSynced };
}
