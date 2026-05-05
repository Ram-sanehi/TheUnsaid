import { motion, AnimatePresence } from "framer-motion";
import { useMemoryShelf } from "../hooks/useMemoryShelf";

interface MemoryShelfProps {
  onClose: () => void;
}

export function MemoryShelf({ onClose }: MemoryShelfProps) {
  const { items, removeFromShelf } = useMemoryShelf();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 400,
          background: "rgba(0,0,0,0.75)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(380px, 92vw)",
            background: "var(--surface)",
            borderLeft: "1px solid rgba(201,168,76,0.12)",
            overflowY: "auto",
            padding: "2rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "'Palatino Linotype', Georgia, serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "0.25rem",
                }}
              >
                the quiet shelf
              </p>
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: "1.3rem",
                  fontStyle: "italic",
                  color: "var(--fg)",
                  fontWeight: 400,
                }}
              >
                Memory Shelf
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--muted)",
                fontSize: "1.2rem",
              }}
            >
              ✕
            </button>
          </div>

          {/* Divider */}
          <div
            style={{ height: "1px", background: "rgba(201,168,76,0.15)", marginBottom: "0.5rem" }}
          />

          {/* Empty state */}
          {items.length === 0 && (
            <p
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.9rem",
                color: "var(--muted)",
                textAlign: "center",
                padding: "3rem 0",
                opacity: 0.6,
              }}
            >
              Nothing saved yet.
              <br />
              <span style={{ fontSize: "0.8rem" }}>Highlight a passage and tap "Keep this"</span>
            </p>
          )}

          {/* Items */}
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(201,168,76,0.1)",
                borderLeft: `3px solid ${item.contentType === "highlight" ? "#c9a84c" : "#D6A5B2"}`,
                borderRadius: "8px",
                padding: "1rem",
                position: "relative",
              }}
            >
              {/* Type badge */}
              <span
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: item.contentType === "highlight" ? "#c9a84c" : "#D6A5B2",
                  opacity: 0.7,
                  display: "block",
                  marginBottom: "0.4rem",
                }}
              >
                {item.contentType === "highlight" ? "✦ Highlight" : "✎ Note"}
              </span>

              {/* Text */}
              <p
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                  color: "var(--fg)",
                  margin: "0 0 0.6rem",
                }}
              >
                "{item.text}"
              </p>

              {/* Context */}
              <p
                style={{
                  fontSize: "0.65rem",
                  color: "var(--muted)",
                  fontFamily: "'Palatino Linotype', Georgia, serif",
                  letterSpacing: "0.05em",
                }}
              >
                — {item.context}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeFromShelf(item.id)}
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--muted)",
                  fontSize: "0.7rem",
                  opacity: 0.5,
                  transition: "opacity 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseOut={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                ✕
              </button>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
