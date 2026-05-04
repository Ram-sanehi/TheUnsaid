import { useState, useCallback, useEffect } from 'react';

export interface Annotation {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  startOffset: number;
  endOffset: number;
  text: string;
  type: 'highlight' | 'underline';
  note?: string;
  visibility?: 'private' | 'public';
  createdAt: number;
}

const STORAGE_KEY = 'tgwfhe_annotations';

function loadAnnotations(): Annotation[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    const parsed = JSON.parse(s);
    // Ensure visibility defaults to private for old entries
    return parsed.map((a: Annotation) => ({ visibility: 'private', ...a }));
  } catch { return []; }
}

function saveAnnotations(anns: Annotation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anns));
}

export function useAnnotations(chapterId: string) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  useEffect(() => {
    setAnnotations(loadAnnotations().filter(a => a.chapterId === chapterId));
  }, [chapterId]);

  const allAnnotations = useCallback(() => loadAnnotations(), []);

  const addAnnotation = useCallback((ann: Omit<Annotation, 'id' | 'createdAt'>) => {
    const full: Annotation = {
      visibility: 'private',
      ...ann,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    const all = loadAnnotations();
    all.push(full);
    saveAnnotations(all);
    setAnnotations(all.filter(a => a.chapterId === chapterId));
    return full;
  }, [chapterId]);

  const addNoteToAnnotation = useCallback((id: string, note: string) => {
    const all = loadAnnotations();
    const idx = all.findIndex(a => a.id === id);
    if (idx >= 0) {
      all[idx].note = note;
      saveAnnotations(all);
      setAnnotations(all.filter(a => a.chapterId === chapterId));
    }
  }, [chapterId]);

  const toggleVisibility = useCallback((id: string) => {
    const all = loadAnnotations();
    const idx = all.findIndex(a => a.id === id);
    if (idx >= 0) {
      all[idx].visibility = all[idx].visibility === 'public' ? 'private' : 'public';
      saveAnnotations(all);
      setAnnotations(all.filter(a => a.chapterId === chapterId));
    }
  }, [chapterId]);

  const removeAnnotation = useCallback((id: string) => {
    const all = loadAnnotations().filter(a => a.id !== id);
    saveAnnotations(all);
    setAnnotations(all.filter(a => a.chapterId === chapterId));
  }, [chapterId]);

  return { annotations, addAnnotation, addNoteToAnnotation, toggleVisibility, removeAnnotation, allAnnotations };
}
