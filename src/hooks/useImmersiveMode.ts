import { useState, useCallback, useEffect } from "react";

const KEY = "tgwfhe_immersive";

export function useImmersiveMode() {
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "true") setImmersive(true);
  }, []);

  const toggleImmersive = useCallback(() => {
    setImmersive((prev) => {
      const next = !prev;
      localStorage.setItem(KEY, String(next));
      return next;
    });
  }, []);

  const exitImmersive = useCallback(() => {
    setImmersive(false);
    localStorage.setItem(KEY, "false");
  }, []);

  return { immersive, toggleImmersive, exitImmersive };
}
