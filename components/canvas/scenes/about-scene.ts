/**
 * About scene: Warm, trust-building ambient animation.
 * Values constellation web, heritage particles, gold warmth.
 * Organic and inviting — this is the company's story.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Values constellation nodes (mapped to card positions) ────
const valueNodes = [
  { x: 0.58, y: 0.28 },
  { x: 0.82, y: 0.28 },
  { x: 0.58, y: 0.52 },
  { x: 0.82, y: 0.52 },
  { x: 0.70, y: 0.76 },
];

// ── Edges between adjacent value nodes ───────────────────────
const edges = [
  [0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 4],
];

// ── Rising heritage particles ────────────────────────────────
interface HeritageDot {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

const HERITAGE_COUNT = 8;
const heritageDots: HeritageDot[] = Array.from(
  { length: HERITAGE_COUNT },
  () => ({
    x: 0.05 + Math.random() * 0.35,
    y: Math.random(),
    size: 1 + Math.random() * 2,
    speed: 5 + Math.random() * 10,
    opacity: 0.04 + Math.random() * 0.04,
    phase: Math.random() * TAU,
  })
);

export const aboutScene: SceneSkin = {
  id: "about",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2.5, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const dm = isDarkMode() ? 1.5 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Warm gold glow (image side) ──────────────────────
    const glowPulse = 0.06 + Math.sin(time * 0.2) * 0.02;
    const goldGlow = r.radialGradient(w * 0.25, h * 0.45, 0, Math.min(w, h) * 0.5, [
      [0, BRAND.goldAlpha(glowPulse * dm)],
      [0.5, BRAND.goldAlpha(glowPulse * 0.3 * dm)],
      [1, "transparent"],
    ]);
    r.rect(0, 0, w, h, { fill: goldGlow });

    // ── 2. Values constellation ─────────────────────────────
    // Connection web
    for (const [a, b] of edges) {
      const na = valueNodes[a];
      const nb = valueNodes[b];
      r.line(na.x * w, na.y * h, nb.x * w, nb.y * h, {
        stroke: BRAND.tealAlpha(0.03 * dm),
        width: 0.5,
      });
    }

    // Pulsing nodes
    for (let i = 0; i < valueNodes.length; i++) {
      const node = valueNodes[i];
      const nx = node.x * w;
      const ny = node.y * h;
      const pulse = Math.sin(time * 0.6 + i * 1.2);
      const nodeRadius = 18 + pulse * 4;
      const nodeAlpha = (0.06 + pulse * 0.02) * dm;

      // Glow
      const glow = r.radialGradient(nx, ny, 0, nodeRadius, [
        [0, BRAND.tealAlpha(nodeAlpha * 1.5)],
        [0.6, BRAND.tealAlpha(nodeAlpha * 0.4)],
        [1, "transparent"],
      ]);
      r.circle(nx, ny, nodeRadius, { fill: glow });

      // Core
      r.circle(nx, ny, 2.5, { fill: BRAND.tealAlpha(nodeAlpha * 3) });
    }

    // ── 3. Rising heritage particles ────────────────────────
    for (const d of heritageDots) {
      d.y -= (d.speed * dt) / h;
      if (d.y < -0.05) {
        d.y = 1.05;
        d.x = 0.05 + Math.random() * 0.35;
      }

      const wobble = Math.sin(time * 0.7 + d.phase) * 3;
      const dx = d.x * w + wobble;
      const dy = d.y * h;

      const grad = r.radialGradient(dx, dy, 0, d.size * 2.5, [
        [0, BRAND.whiteAlpha(d.opacity * dm)],
        [0.5, BRAND.whiteAlpha(d.opacity * 0.3 * dm)],
        [1, "transparent"],
      ]);
      r.circle(dx, dy, d.size * 2.5, { fill: grad });
    }

    // ── 4. Slow rotating arc (heritage/timelessness) ────────
    r.save();
    r.translate(w * 0.12, h * 0.8);
    r.rotate(time * 0.03);
    r.arc(0, 0, 70, 0, TAU * 0.45, {
      stroke: BRAND.goldAlpha(0.05 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 5. Corner accents (gold) ────────────────────────────
    const cornerAlpha = vis * 0.08 * dm;
    const cLen = 20;
    const cOff = 15;

    r.line(cOff, cOff, cOff + cLen, cOff, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(cOff, cOff, cOff, cOff + cLen, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.line(w - cOff, h - cOff, w - cOff - cLen, h - cOff, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(w - cOff, h - cOff, w - cOff, h - cOff - cLen, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.restore();
  },
};
