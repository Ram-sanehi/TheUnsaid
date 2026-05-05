import { useState, useEffect, useCallback } from "react";

interface Bookmark {
  chapterId: string;
  timestamp: number;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("tgwfhe_bookmarks");
    if (saved) setBookmarks(JSON.parse(saved));
  }, []);

  const save = useCallback((bms: Bookmark[]) => {
    setBookmarks(bms);
    localStorage.setItem("tgwfhe_bookmarks", JSON.stringify(bms));
  }, []);

  const toggleBookmark = useCallback((chapterId: string) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.chapterId === chapterId);
      const next = exists
        ? prev.filter((b) => b.chapterId !== chapterId)
        : [...prev, { chapterId, timestamp: Date.now() }];
      localStorage.setItem("tgwfhe_bookmarks", JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (chapterId: string) => {
      return bookmarks.some((b) => b.chapterId === chapterId);
    },
    [bookmarks],
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
