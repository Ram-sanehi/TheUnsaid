import { useState, useEffect, useCallback } from 'react';

export interface Highlight {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  text: string;
  color: 'yellow' | 'pink' | 'green';
  timestamp: number;
}

export interface StickyNote {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  text: string;
  noteText: string;
  rotation: number;
  timestamp: number;
}

export function useHighlights(chapterId: string) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);

  useEffect(() => {
    const savedH = localStorage.getItem('tgwfhe_highlights');
    if (savedH) setHighlights(JSON.parse(savedH));
    const savedN = localStorage.getItem('tgwfhe_notes');
    if (savedN) setNotes(JSON.parse(savedN));
  }, []);

  const addHighlight = useCallback((h: Omit<Highlight, 'id' | 'timestamp'>) => {
    setHighlights(prev => {
      const next = [...prev, { ...h, id: crypto.randomUUID(), timestamp: Date.now() }];
      localStorage.setItem('tgwfhe_highlights', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeHighlight = useCallback((id: string) => {
    setHighlights(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem('tgwfhe_highlights', JSON.stringify(next));
      return next;
    });
  }, []);

  const addNote = useCallback((n: Omit<StickyNote, 'id' | 'timestamp' | 'rotation'>) => {
    setNotes(prev => {
      const next = [...prev, { ...n, id: crypto.randomUUID(), rotation: Math.random() * 4 - 2, timestamp: Date.now() }];
      localStorage.setItem('tgwfhe_notes', JSON.stringify(next));
      return next;
    });
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id);
      localStorage.setItem('tgwfhe_notes', JSON.stringify(next));
      return next;
    });
  }, []);

  const chapterHighlights = highlights.filter(h => h.chapterId === chapterId);
  const chapterNotes = notes.filter(n => n.chapterId === chapterId);

  return { highlights: chapterHighlights, allHighlights: highlights, notes: chapterNotes, allNotes: notes, addHighlight, removeHighlight, addNote, removeNote };
}
