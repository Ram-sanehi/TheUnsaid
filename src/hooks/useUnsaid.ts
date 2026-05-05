import { useState, useCallback, useEffect } from "react";

export interface UnsaidMark {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  text: string;
  createdAt: number;
}

const KEY = "tgwfhe_unsaid";

function load(): UnsaidMark[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function save(marks: UnsaidMark[]) {
  localStorage.setItem(KEY, JSON.stringify(marks));
}

export function useUnsaid(chapterId: string) {
  const [marks, setMarks] = useState<UnsaidMark[]>([]);

  useEffect(() => {
    setMarks(load().filter((m) => m.chapterId === chapterId));
  }, [chapterId]);

  const isMarked = useCallback(
    (paragraphIndex: number) => {
      return load().some((m) => m.chapterId === chapterId && m.paragraphIndex === paragraphIndex);
    },
    [chapterId],
  );

  const toggleUnsaid = useCallback(
    (paragraphIndex: number, text: string) => {
      const all = load();
      const existing = all.find(
        (m) => m.chapterId === chapterId && m.paragraphIndex === paragraphIndex,
      );
      if (existing) {
        const next = all.filter((m) => m.id !== existing.id);
        save(next);
        setMarks(next.filter((m) => m.chapterId === chapterId));
      } else {
        const mark: UnsaidMark = {
          id: crypto.randomUUID(),
          chapterId,
          paragraphIndex,
          text,
          createdAt: Date.now(),
        };
        all.push(mark);
        save(all);
        setMarks(all.filter((m) => m.chapterId === chapterId));
      }
    },
    [chapterId],
  );

  const getAllUnsaid = useCallback(() => load(), []);

  return { marks, isMarked, toggleUnsaid, getAllUnsaid };
}
