// BSya Grow theme — "Sunny" palette, "Playful" vibe (fixed for the real app).
// Mirrors the prototype's ThemeCtx output so styling stays pixel-faithful.

export const C = {
  sky: "#29B5E8",
  skyDeep: "#0E92C2",
  skySoft: "#E8F7FD",
  yellow: "#FFD93D",
  yellowDeep: "#F5B800",
  ink: "#0B2740",
  ink2: "#36506B",
  muted: "#7A8FA3",
  line: "#E4EEF5",
  bg: "#F4FAFD",
  ok: "#22B57A",
  white: "#fff",
} as const;

export const F = '"Nunito", system-ui, sans-serif';

// Playful vibe → radius scale 1.0. Kept as a function to match prototype call sites.
export const r = (base: number) => Math.max(2, base * 1.0);
