import { useEffect } from 'react';

export type ReadingTheme = 'night';

export function useTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'night');
    localStorage.setItem('tgwfhe_theme', 'night');
  }, []);

  return { theme: 'night' as ReadingTheme, setTheme: (_: ReadingTheme) => {} };
}
