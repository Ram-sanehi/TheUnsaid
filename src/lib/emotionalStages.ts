/* ─── Emotional Stage Mapping ────────────────────────── */

export interface EmotionalStage {
  label: string;
  threshold: number; // 0–100
  color: string;
}

export const EMOTIONAL_STAGES: EmotionalStage[] = [
  { label: 'Calm',        threshold: 0,   color: '#8fa8a0' },
  { label: 'Falling',     threshold: 20,  color: '#a89880' },
  { label: 'Heavy',       threshold: 45,  color: '#c9a84c' },
  { label: 'Breaking',    threshold: 68,  color: '#d4846a' },
  { label: 'Letting go',  threshold: 85,  color: '#b5a9d4' },
];

export function getStageForProgress(pct: number): EmotionalStage {
  let stage = EMOTIONAL_STAGES[0];
  for (const s of EMOTIONAL_STAGES) {
    if (pct >= s.threshold) stage = s;
  }
  return stage;
}
