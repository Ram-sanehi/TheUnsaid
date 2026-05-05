import { useState, useRef, useEffect } from "react";

interface StickyNoteModalProps {
  selectedText: string;
  onSave: (noteText: string) => void;
  onClose: () => void;
}

export function StickyNoteModal({ selectedText, onSave, onClose }: StickyNoteModalProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
    }
    onClose();
  };

  return (
    <div
      className="sticky-note-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="sticky-note-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ marginBottom: "0.75rem" }}>
          <p
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#6B5A48",
              marginBottom: "4px",
            }}
          >
            Note for:
          </p>
          <p
            style={{
              fontFamily: "var(--font-quote)",
              fontStyle: "italic",
              fontSize: "14px",
              color: "#2C1810",
              opacity: 0.7,
              lineHeight: 1.5,
            }}
          >
            "{selectedText.slice(0, 100)}
            {selectedText.length > 100 ? "…" : ""}"
          </p>
        </div>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your note here..."
          maxLength={500}
        />

        <div
          style={{ display: "flex", gap: "8px", marginTop: "0.75rem", justifyContent: "flex-end" }}
        >
          <button
            onClick={onClose}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "13px",
              padding: "8px 16px",
              border: "1px solid rgba(44, 24, 16, 0.2)",
              borderRadius: "8px",
              background: "transparent",
              color: "#6B5A48",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "13px",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              background: "#8B6914",
              color: "#FEF9C3",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
