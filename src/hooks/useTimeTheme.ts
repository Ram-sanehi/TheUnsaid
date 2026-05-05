import { useEffect } from "react";

export function useTimeTheme() {
  useEffect(() => {
    const apply = () => {
      const hour = new Date().getHours();
      const root = document.documentElement;

      if (hour >= 20 || hour < 6) {
        // Deep night: richer darkness
        root.style.setProperty("--bg", "#090d16");
        root.style.setProperty("--surface", "#0c1018");
        root.style.setProperty("--fg", "#EAE6DD");
      } else if (hour >= 6 && hour < 9) {
        // Early morning: slightly warmer
        root.style.setProperty("--bg", "#0f1218");
        root.style.setProperty("--surface", "#141820");
        root.style.setProperty("--fg", "#E2DDD5");
      } else {
        // Daytime: softer contrast
        root.style.setProperty("--bg", "#0d111a");
        root.style.setProperty("--surface", "#111520");
        root.style.setProperty("--fg", "#DDD9D0");
      }
    };

    apply();
    // Refresh every 10 minutes
    const interval = setInterval(apply, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}
