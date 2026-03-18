/**
 * SceneSkin, SceneState, math utilities, and brand constants.
 *
 * Adapted from BeeClock's ClockSkin/ClockState for scroll-driven
 * corporate animations instead of clock rendering.
 */
import type { CanvasRenderer } from "./renderer";

// ── State ───────────────────────────────────────────────────

/** Data passed to a scene skin every frame */
export interface SceneState {
  /** Elapsed time in seconds since engine start */
  time: number;
  /** Frame delta in milliseconds */
  delta: number;
  /** Interpolation factor 0-1 between fixed ticks */
  alpha: number;
  /** Normalized page scroll position 0-1 */
  scroll: number;
  /** This section's visibility ratio 0-1 */
  sectionProgress: number;
  /** Global tick counter */
  tick: number;
  /** Canvas logical width (CSS pixels) */
  width: number;
  /** Canvas logical height (CSS pixels) */
  height: number;
}

// ── Skin Interface ──────────────────────────────────────────

/** Pluggable scene renderer — pure function: (renderer, state) → pixels */
export interface SceneSkin {
  readonly id: string;
  render(r: CanvasRenderer, state: SceneState): void;
  /** Called once when scene is mounted */
  init?(r: CanvasRenderer): void;
  /** Called when canvas is resized */
  onResize?(width: number, height: number): void;
}

// ── Registry ────────────────────────────────────────────────

export class SceneRegistry {
  private skins = new Map<string, SceneSkin>();

  register(skin: SceneSkin): void {
    this.skins.set(skin.id, skin);
  }

  get(id: string): SceneSkin | undefined {
    return this.skins.get(id);
  }

  list(): SceneSkin[] {
    return Array.from(this.skins.values());
  }
}

// ── Math Utilities ──────────────────────────────────────────

/** Convert degrees to radians */
export const deg2rad = (deg: number): number => deg * (Math.PI / 180);

/** Convert radians to degrees */
export const rad2deg = (rad: number): number => rad * (180 / Math.PI);

/** Full circle in radians */
export const TAU = Math.PI * 2;

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Clamp value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

/** Ease in-out (smooth start and end) */
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Ease out (smooth end) */
export const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Smooth step (Hermite interpolation) */
export const smoothStep = (t: number): number => t * t * (3 - 2 * t);

// ── Theme-aware color helper ────────────────────────────────

/** Read a CSS custom property value at runtime (for canvas scenes on themed surfaces) */
export function getThemedColor(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim() || fallback
  );
}

/** Check if dark mode is active (for canvas scenes on themed sections) */
export function isDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.getAttribute("data-theme") === "dark";
}

// ── Brand Colors (for canvas — CSS vars unavailable) ────────

export const BRAND = {
  teal: "#2B7A8C",
  tealDark: "#1D5A67",
  tealDeep: "#0F3D47",
  tealLight: "#3A9AAE",
  gold: "#D4A853",
  goldLight: "#E8C97A",
  logoGreen: "#149850",
  white: "#FFFFFF",
  tealAlpha: (a: number) => `rgba(43, 122, 140, ${a})`,
  tealDeepAlpha: (a: number) => `rgba(15, 61, 71, ${a})`,
  goldAlpha: (a: number) => `rgba(212, 168, 83, ${a})`,
  whiteAlpha: (a: number) => `rgba(255, 255, 255, ${a})`,
} as const;
