import { useState, useCallback, useEffect } from 'react';

export type ReactionType = string; // now open — any emoji key

export interface ReactionCategory {
  label: string;
  emojis: string[];
}

export const REACTION_CATEGORIES: ReactionCategory[] = [
  {
    label: 'Hearts',
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '🩷', '🩵', '🩶', '💔', '❤️‍🔥', '❤️‍🩹', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  },
  {
    label: 'Emotional',
    emojis: ['😭', '😢', '🥹', '🥺', '😔', '😞', '😟', '🫠', '😮‍💨', '😶‍🌫️', '💧', '🌧️'],
  },
  {
    label: 'Happy & Love',
    emojis: ['😍', '🥰', '😊', '😄', '🤩', '😁', '🫶', '🙏', '🤗', '💫', '✨', '🌟', '🌈'],
  },
  {
    label: 'Relatable',
    emojis: ['🤔', '😶', '💭', '😌', '😤', '🫁', '💯', '👀', '🙂', '😅', '🫡', '🤯'],
  },
  {
    label: 'Applause',
    emojis: ['👏', '🙌', '💪', '🫂', '🤝', '🌺', '🌸', '🍂', '🕯️', '📖', '🌙', '⭐'],
  },
];

// Flat lookup: emoji → label (same as emoji for display)
export const ALL_REACTIONS: string[] = REACTION_CATEGORIES.flatMap(c => c.emojis);

export interface Reaction {
  id: string;
  chapterId: string;
  paragraphIndex: number;
  type: string; // emoji character
  text: string;
  createdAt: number;
}

const STORAGE_KEY = 'tgwfhe_reactions';

function loadReactions(): Reaction[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (!s) return [];
    return JSON.parse(s).map((r: Reaction & { emoji?: string }) => ({
      ...r,
      type: r.type ?? r.emoji ?? '💛',
    }));
  } catch { return []; }
}

function saveReactions(reactions: Reaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reactions));
}

export function useReactions(chapterId: string) {
  const [reactions, setReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    setReactions(loadReactions().filter(r => r.chapterId === chapterId));
  }, [chapterId]);

  const toggleReaction = useCallback((type: string, paragraphIndex: number, text: string) => {
    const all = loadReactions();
    const existing = all.find(
      r => r.chapterId === chapterId && r.paragraphIndex === paragraphIndex && r.type === type
    );
    if (existing) {
      const filtered = all.filter(r => r.id !== existing.id);
      saveReactions(filtered);
      setReactions(filtered.filter(r => r.chapterId === chapterId));
    } else {
      const full: Reaction = {
        chapterId, paragraphIndex, type, text,
        id: crypto.randomUUID(), createdAt: Date.now(),
      };
      all.push(full);
      saveReactions(all);
      setReactions(all.filter(r => r.chapterId === chapterId));
    }
  }, [chapterId]);

  const removeReaction = useCallback((id: string) => {
    const all = loadReactions().filter(r => r.id !== id);
    saveReactions(all);
    setReactions(all.filter(r => r.chapterId === chapterId));
  }, [chapterId]);

  const getReactionsForParagraph = useCallback((paragraphIndex: number) => {
    return reactions.filter(r => r.paragraphIndex === paragraphIndex);
  }, [reactions]);

  const hasReacted = useCallback((paragraphIndex: number, type: string) => {
    return reactions.some(r => r.paragraphIndex === paragraphIndex && r.type === type);
  }, [reactions]);

  return { reactions, toggleReaction, removeReaction, getReactionsForParagraph, hasReacted };
}
