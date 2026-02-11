/**
 * Loading scene: Dramatic spinning arcs, pulsing rings, radial burst,
 * gold progress bar with glow. Logo is overlaid via HTML.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, easeInOut, clamp } from "../scene";

// Pre-allocate radial burst lines
const burstLines = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * TAU,
  length: 30 + Math.random() * 20,
  speed: 0.3 + Math.random() * 0.4,
  phase: Math.random() * TAU,
}));

export const loadingScene: SceneSkin = {
  id: "loading",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time } = s;
    const cx = w / 2;
    const cy = h / 2 - 10; // Logo center offset

    // ── 1. Pulsing background glow ──────────────────────────
    const breathe = 0.5 + Math.sin(time * 1.5) * 0.5;
    const bgGlow = r.radialGradient(cx, cy, 0, 200, [
      [0, BRAND.tealAlpha(0.08 * breathe)],
      [0.5, BRAND.tealAlpha(0.03 * breathe)],
      [1, "transparent"],
    ]);
    r.circle(cx, cy, 200, { fill: bgGlow });

    // ── 2. Radial burst lines (pulsing outward) ─────────────
    r.save();
    r.translate(cx, cy);
    for (const line of burstLines) {
      const pulse = Math.sin(time * line.speed + line.phase);
      const innerR = 55 + pulse * 5;
      const outerR = innerR + line.length * (0.5 + pulse * 0.5);
      const alpha = 0.04 + pulse * 0.03;

      const x1 = Math.cos(line.angle) * innerR;
      const y1 = Math.sin(line.angle) * innerR;
      const x2 = Math.cos(line.angle) * outerR;
      const y2 = Math.sin(line.angle) * outerR;

      r.line(x1, y1, x2, y2, {
        stroke: BRAND.whiteAlpha(alpha),
        width: 1,
        cap: "round",
      });
    }
    r.restore();

    // ── 3. Primary spinning arc (bold, gold) ────────────────
    const spin1 = time * Math.PI * 1.2;
    r.save();
    r.translate(cx, cy);
    r.rotate(spin1);
    r.arc(0, 0, 48, 0, TAU * 0.65, {
      stroke: BRAND.goldAlpha(0.5),
      width: 3,
      cap: "round",
    });
    r.restore();

    // ── 4. Counter-rotating arc (thinner, white) ────────────
    const spin2 = -time * Math.PI * 0.7;
    r.save();
    r.translate(cx, cy);
    r.rotate(spin2);
    r.arc(0, 0, 56, 0, TAU * 0.35, {
      stroke: BRAND.whiteAlpha(0.2),
      width: 1.5,
      cap: "round",
    });
    r.restore();

    // ── 5. Outer ring pulse ─────────────────────────────────
    const outerPulse = 0.06 + Math.sin(time * 2) * 0.04;
    r.circle(cx, cy, 70, {
      stroke: BRAND.whiteAlpha(outerPulse),
      width: 0.5,
    });

    // ── 6. Gold progress bar with glow ──────────────────────
    const barW = 180;
    const barH = 3;
    const barX = cx - barW / 2;
    const barY = cy + 75;
    const progress = clamp(easeInOut(time / 1.5), 0, 1);

    // Background bar
    r.roundRect(barX, barY, barW, barH, 1.5, {
      fill: BRAND.whiteAlpha(0.1),
    });

    // Fill bar with glow
    if (progress > 0) {
      const fillW = barW * progress;
      // Glow behind bar
      r.save();
      r.shadow(BRAND.gold, 8);
      r.roundRect(barX, barY, fillW, barH, 1.5, {
        fill: BRAND.gold,
      });
      r.restore();

      // Bright tip
      const tipX = barX + fillW;
      const tipGlow = r.radialGradient(tipX, barY + 1.5, 0, 8, [
        [0, BRAND.goldAlpha(0.6)],
        [1, "transparent"],
      ]);
      r.circle(tipX, barY + 1.5, 8, { fill: tipGlow });
    }
  },
};
