import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateQuoteImage, downloadQuoteImage } from "../lib/quoteCanvas";

interface QuoteShareModalProps {
  text: string;
  chapterTitle: string;
  onClose: () => void;
}

export function QuoteShareModal({ text, chapterTitle, onClose }: QuoteShareModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const url = await generateQuoteImage(text, chapterTitle);
      setPreviewUrl(url);
    } finally {
      setLoading(false);
    }
  }, [text, chapterTitle]);

  const download = useCallback(() => {
    if (previewUrl) downloadQuoteImage(previewUrl);
  }, [previewUrl]);

  // Generate on mount
  if (!previewUrl && !loading) generate();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 500,
          background: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: "var(--surface)",
            borderRadius: "16px",
            padding: "1.5rem",
            maxWidth: "420px",
            width: "100%",
            border: "1px solid rgba(201,168,76,0.15)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              color: "var(--muted)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Share as Card
          </p>

          {/* Preview */}
          <div
            style={{
              borderRadius: "8px",
              overflow: "hidden",
              marginBottom: "1rem",
              aspectRatio: "1/1",
              background: "#0d111a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Generating…</span>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Quote card preview"
                style={{ width: "100%", display: "block" }}
              />
            ) : null}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={download}
              disabled={!previewUrl}
              style={{
                flex: 1,
                background: previewUrl ? "rgba(201,168,76,0.12)" : "transparent",
                border: "1px solid rgba(201,168,76,0.35)",
                borderRadius: "999px",
                color: "#c9a84c",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: "italic",
                fontSize: "0.85rem",
                padding: "0.55rem 1rem",
                cursor: previewUrl ? "pointer" : "not-allowed",
                transition: "background 0.2s",
              }}
            >
              ↓ Download PNG
            </button>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "999px",
                color: "var(--muted)",
                fontFamily: "'Palatino Linotype', Georgia, serif",
                fontSize: "0.8rem",
                padding: "0.55rem 1rem",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
