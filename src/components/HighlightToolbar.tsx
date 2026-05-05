import { useEffect, useRef } from "react";

interface HighlightToolbarProps {
  position: { x: number; y: number };
  onHighlight: (color: "yellow" | "pink" | "green" | "underline") => void;
  onNote: () => void;
  onClose: () => void;
}

export function HighlightToolbar({
  position,
  onHighlight,
  onNote,
  onClose,
}: HighlightToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to avoid immediate close from selection event
    const timeout = setTimeout(() => {
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
    }, 100);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onClose]);

  return (
    <div ref={ref} className="highlight-toolbar" style={{ left: position.x, top: position.y - 50 }}>
      <button
        onClick={() => onHighlight("yellow")}
        title="Yellow highlight"
        aria-label="Yellow highlight"
      >
        🟡
      </button>
      <button
        onClick={() => onHighlight("pink")}
        title="Pink highlight"
        aria-label="Pink highlight"
      >
        🩷
      </button>
      <button
        onClick={() => onHighlight("green")}
        title="Green highlight"
        aria-label="Green highlight"
      >
        🟢
      </button>
      <button
        onClick={() => onHighlight("underline")}
        title="Underline"
        aria-label="Underline"
        style={{ fontSize: 14, textDecoration: "underline" }}
      >
        U
      </button>
      <button onClick={onNote} title="Add note" aria-label="Add note">
        📝
      </button>
    </div>
  );
}
