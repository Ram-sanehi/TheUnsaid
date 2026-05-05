import { chapters } from "../data/chapters";
import { useEffect, useState } from "react";

interface ReadingStatsProps {
  onClose: () => void;
}

export function ReadingStats({ onClose }: ReadingStatsProps) {
  const [stats, setStats] = useState({
    pagesRead: 0,
    totalPages: chapters.length,
    timeRemaining: 0,
    highlightCount: 0,
    noteCount: 0,
    lastHighlight: "",
  });

  useEffect(() => {
    let pagesRead = 0;
    let wordsRemaining = 0;

    chapters.forEach((ch) => {
      const progress = localStorage.getItem(`reading-progress-${ch.id}`);
      if (progress && Number(progress) > 50) {
        pagesRead++;
      } else {
        wordsRemaining += ch.wordCount;
      }
    });

    const highlights = JSON.parse(localStorage.getItem("tgwfhe_highlights") || "[]");
    const notes = JSON.parse(localStorage.getItem("tgwfhe_notes") || "[]");

    const avgWpm = 238;
    const timeRemaining = Math.ceil(wordsRemaining / avgWpm);

    const lastHighlight =
      highlights.length > 0 ? highlights[highlights.length - 1].text?.slice(0, 80) || "" : "";

    setStats({
      pagesRead,
      totalPages: chapters.length,
      timeRemaining,
      highlightCount: highlights.length,
      noteCount: notes.length,
      lastHighlight,
    });
  }, []);

  return (
    <div
      className="sticky-note-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          margin: "0 1rem",
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "2rem",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 201,
          animation: "toolbar-pop 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              fontStyle: "italic",
              color: "var(--foreground)",
            }}
          >
            Reading Stats
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--muted-foreground)",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            ✕
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">
              {stats.pagesRead}/{stats.totalPages}
            </div>
            <div className="stat-label">Chapters Read</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {stats.timeRemaining}
              <span style={{ fontSize: "0.6em" }}>m</span>
            </div>
            <div className="stat-label">Time Remaining</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.highlightCount}</div>
            <div className="stat-label">Highlights</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.noteCount}</div>
            <div className="stat-label">Sticky Notes</div>
          </div>
        </div>

        {stats.lastHighlight && (
          <div
            style={{
              marginTop: "1.25rem",
              padding: "0.75rem 1rem",
              background: "rgba(var(--accent-rgb), 0.06)",
              borderRadius: "8px",
              borderLeft: "3px solid var(--gold)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--muted-foreground)",
                marginBottom: "4px",
              }}
            >
              Last Highlight
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                fontStyle: "italic",
                color: "var(--foreground)",
                lineHeight: 1.6,
                opacity: 0.8,
              }}
            >
              "{stats.lastHighlight}
              {stats.lastHighlight.length >= 80 ? "…" : ""}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
