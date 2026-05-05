import { useState, useCallback, useEffect } from "react";

export type ShelfContentType = "highlight" | "note";

export interface ShelfItem {
  id: string;
  contentType: ShelfContentType;
  text: string;
  context: string; // chapter title
  chapterId: string;
  createdAt: number;
  optionalTag?: string;
}

const KEY = "tgwfhe_shelf";

function load(): ShelfItem[] {
  try {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function save(items: ShelfItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function useMemoryShelf() {
  const [items, setItems] = useState<ShelfItem[]>([]);

  useEffect(() => {
    setItems(load().sort((a, b) => b.createdAt - a.createdAt));
  }, []);

  const addToShelf = useCallback((item: Omit<ShelfItem, "id" | "createdAt">) => {
    const full: ShelfItem = { ...item, id: crypto.randomUUID(), createdAt: Date.now() };
    const all = load();
    // Avoid duplicates by text
    if (all.some((i) => i.text === item.text)) return;
    all.unshift(full);
    save(all);
    setItems(all);
    return full;
  }, []);

  const removeFromShelf = useCallback((id: string) => {
    const next = load().filter((i) => i.id !== id);
    save(next);
    setItems(next);
  }, []);

  const isOnShelf = useCallback((text: string) => {
    return load().some((i) => i.text === text);
  }, []);

  const getAllItems = useCallback(() => load(), []);

  return { items, addToShelf, removeFromShelf, isOnShelf, getAllItems };
}
