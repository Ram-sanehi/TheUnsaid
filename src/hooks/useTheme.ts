import { useState, useEffect, useCallback } from 'react';

export type ReadingTheme = 'night' | 'sepia' | 'cool' | 'amoled';

export const themeLabels: Record<ReadingTheme, { emoji: string; label: string }> = {
  night: { emoji: '🌙', label: 'Night' },
  sepia: { emoji: '📜', label: 'Sepia' },
  cool: { emoji: '🧊', label: 'Cool' },
  amoled: { emoji: '⬛', label: 'AMOLED' },
};

export function useTheme() {
  const [theme, setThemeState] = useState<ReadingTheme>('night');

  useEffect(() => {
    const saved = localStorage.getItem('tgwfhe_theme') as ReadingTheme | null;
    if (saved && ['night', 'sepia', 'cool', 'amoled'].includes(saved)) {
      setThemeState(saved);
      applyTheme(saved);
    }
  }, []);

  const setTheme = useCallback((t: ReadingTheme) => {
    setThemeState(t);
    localStorage.setItem('tgwfhe_theme', t);
    applyTheme(t);
  }, []);

  return { theme, setTheme };
}

function applyTheme(t: ReadingTheme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', t);
}
