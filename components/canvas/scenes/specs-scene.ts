/**
 * Specs scene: Engineering precision and blueprint aesthetic.
 * Dense grid, dimension lines that draw in, tolerance arcs,
 * cross-hair markers — the most technical scene.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Dimension line definitions ──────────────────────────────
const dimensions = [
  { y: 0.2, xStart: 0.1, xEnd: 0.4 },
  { y: 0.4, xStart: 0.55, xEnd: 0.85 },
  { y: 0.6, xStart: 0.08, xEnd: 0.35 },
  { y: 0.8, xStart: 0.6, xEnd: 0.9 },
];

// ── Cross-hair positions ────────────────────────────────────
const crosshairs = [
  { x: 0.15, y: 0.3 },
  { x: 0.5, y: 0.7 },
  { x: 0.85, y: 0.5 },
];

// ── Floating spec particles ─────────────────────────────────
interface SpecDot {
  x: number;
  y: number;
  speed: number;
  size: number;
  phase: number;
}

const SPEC_DOT_COUNT = 6;
const specDots: SpecDot[] = Array.from({ length: SPEC_DOT_COUNT }, () => ({
  x: Math.random(),
  y: Math.random(),
  speed: 3 + Math.random() * 5,
  size: 1 + Math.random(),
  phase: Math.random() * TAU,
}));

export const specsScene: SceneSkin = {
  id: "specs",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2.5, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const dm = isDarkMode() ? 1.5 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Blueprint grid (dense, strongest of all scenes) ──
    r.save();
    r.alpha = vis * 0.035 * dm;
    const gridSpacing = 40;
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      r.line(x, 0, x, h, { stroke: BRAND.teal, width: 0.5 });
    }
    for (let y = gridSpacing; y < h; y += gridSpacing) {
      r.line(0, y, w, y, { stroke: BRAND.teal, width: 0.5 });
    }
    r.restore();

    // ── 2. Dimension lines (draw in with sectionProgress) ───
    const drawProgress = clamp(sectionProgress * 3 - 0.5, 0, 1);
    const dimAlpha = 0.06 * dm;

    for (let i = 0; i < dimensions.length; i++) {
      const dim = dimensions[i];
      const delay = i * 0.15;
      const lineT = clamp((drawProgress - delay) / (1 - delay), 0, 1);
      if (lineT <= 0) continue;

      const y = dim.y * h;
      const x1 = dim.xStart * w;
      const x2 = dim.xStart * w + (dim.xEnd - dim.xStart) * w * lineT;
      const capH = 8;

      // Main dimension line
      r.line(x1, y, x2, y, {
        stroke: BRAND.tealAlpha(dimAlpha),
        width: 0.8,
        cap: "round",
      });

      // Start cap
      r.line(x1, y - capH / 2, x1, y + capH / 2, {
        stroke: BRAND.tealAlpha(dimAlpha),
        width: 0.8,
        cap: "round",
      });

      // End cap (only when fully drawn)
      if (lineT > 0.95) {
        r.line(x2, y - capH / 2, x2, y + capH / 2, {
          stroke: BRAND.tealAlpha(dimAlpha),
          width: 0.8,
          cap: "round",
        });

        // Measurement dot at center
        const midX = (x1 + x2) / 2;
        r.circle(midX, y, 2, {
          fill: BRAND.tealAlpha(dimAlpha * 1.5),
        });
      }
    }

    // ── 3. Tolerance arcs ───────────────────────────────────
    const arcCx = w * 0.8;
    const arcCy = h * 0.4;

    // Inner arc (gold, precision)
    r.save();
    r.translate(arcCx, arcCy);
    r.rotate(time * 0.04);
    r.arc(0, 0, 50, 0, TAU * 0.55, {
      stroke: BRAND.goldAlpha(0.06 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // Outer arc (teal, tolerance band)
    r.save();
    r.translate(arcCx, arcCy);
    r.rotate(-time * 0.03);
    r.arc(0, 0, 80, TAU * 0.2, TAU * 0.7, {
      stroke: BRAND.tealAlpha(0.04 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 4. Cross-hair markers ───────────────────────────────
    for (let i = 0; i < crosshairs.length; i++) {
      const ch = crosshairs[i];
      const cx = ch.x * w;
      const cy = ch.y * h;
      const pulse = Math.sin(time * 0.5 + i * 1.5);
      const chAlpha = (0.06 + pulse * 0.02) * dm;
      const armLen = 12;

      // Horizontal arm
      r.line(cx - armLen, cy, cx + armLen, cy, {
        stroke: BRAND.tealAlpha(chAlpha),
        width: 0.8,
        cap: "round",
      });
      // Vertical arm
      r.line(cx, cy - armLen, cx, cy + armLen, {
        stroke: BRAND.tealAlpha(chAlpha),
        width: 0.8,
        cap: "round",
      });
      // Center dot
      r.circle(cx, cy, 1.5, {
        fill: BRAND.tealAlpha(chAlpha * 2),
      });
    }

    // ── 5. Floating spec particles ──────────────────────────
    for (const d of specDots) {
      d.y -= (d.speed * dt) / h;
      if (d.y < -0.05) {
        d.y = 1.05;
        d.x = Math.random();
      }

      const dx = d.x * w + Math.sin(time * 0.5 + d.phase) * 2;
      const dy = d.y * h;

      r.circle(dx, dy, d.size, {
        fill: BRAND.whiteAlpha(0.04 * dm),
      });
    }

    // ── 6. Corner accents (teal, longest = most technical) ──
    const cornerAlpha = vis * 0.08 * dm;
    const cLen = 30;
    const cOff = 15;

    r.line(cOff, cOff, cOff + cLen, cOff, {
      stroke: BRAND.tealAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(cOff, cOff, cOff, cOff + cLen, {
      stroke: BRAND.tealAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.line(w - cOff, h - cOff, w - cOff - cLen, h - cOff, {
      stroke: BRAND.tealAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(w - cOff, h - cOff, w - cOff, h - cOff - cLen, {
      stroke: BRAND.tealAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.restore();
  },
};
