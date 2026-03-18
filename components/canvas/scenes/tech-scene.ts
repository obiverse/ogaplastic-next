/**
 * Tech scene: Animated rotational moulding visualization.
 * Biaxial rotating arcs, heat particles, layer build-up cycle,
 * precision grid, and measurement ticks.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, lerp, isDarkMode } from "../scene";

// ── Heat particles (radiating outward from center) ───────
interface Particle {
  angle: number;
  dist: number;
  speed: number;
  size: number;
  opacity: number;
}

const PARTICLE_COUNT = 14;
const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
  angle: Math.random() * TAU,
  dist: 20 + Math.random() * 40,
  speed: 30 + Math.random() * 50,
  size: 1.5 + Math.random() * 2.5,
  opacity: 0.15 + Math.random() * 0.2,
}));

// Layer build-up cycle duration (seconds)
const CYCLE_DURATION = 10;

export const techScene: SceneSkin = {
  id: "tech",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    // Fade in as section enters view
    const vis = clamp(sectionProgress * 2, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const cx = w * 0.75;
    const cy = h * 0.45;
    // Boost opacity in dark mode for visibility on darker surfaces
    const dm = isDarkMode() ? 1.6 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Precision grid (engineering-drawing feel) ──────
    r.save();
    r.alpha = vis * 0.04 * dm;
    const gridSpacing = 50;
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      r.line(x, 0, x, h, { stroke: BRAND.teal, width: 0.5 });
    }
    for (let y = gridSpacing; y < h; y += gridSpacing) {
      r.line(0, y, w, y, { stroke: BRAND.teal, width: 0.5 });
    }
    r.restore();

    // ── 2. Biaxial rotation frame ────────────────────────
    // Outer ring — slow clockwise
    r.save();
    r.translate(cx, cy);
    r.rotate(time * 0.06);
    r.arc(0, 0, 180, 0, TAU * 0.65, {
      stroke: BRAND.tealAlpha(vis * 0.1 * dm),
      width: 1.5,
      cap: "round",
    });
    r.restore();

    // Inner ring — faster counter-clockwise
    r.save();
    r.translate(cx, cy);
    r.rotate(-time * 0.1);
    r.arc(0, 0, 120, TAU * 0.15, TAU * 0.15 + TAU * 0.55, {
      stroke: BRAND.tealAlpha(vis * 0.12 * dm),
      width: 1.5,
      cap: "round",
    });
    r.restore();

    // Tertiary ring — very slow, opposite direction
    r.save();
    r.translate(cx, cy);
    r.rotate(time * 0.03);
    r.arc(0, 0, 240, TAU * 0.3, TAU * 0.3 + TAU * 0.4, {
      stroke: BRAND.tealAlpha(vis * 0.05 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 3. Layer build-up cycle (double-layer) ───────────
    const cycleTime = time % CYCLE_DURATION;
    const layerCx = cx;
    const layerCy = cy;

    // Phase timing: 0-4s inner, 4-8s outer, 8-10s pulse+fade
    const innerT = clamp(cycleTime / 4, 0, 1);
    const outerT = clamp((cycleTime - 4) / 4, 0, 1);
    const pulseT = clamp((cycleTime - 8) / 2, 0, 1);
    const fadeOut = 1 - pulseT * pulseT; // Quadratic fade

    // Inner layer (white — food-grade)
    if (innerT > 0) {
      const iRadius = lerp(0, 40, innerT);
      const iAlpha = vis * 0.15 * fadeOut;
      const pulse = 1 + (pulseT > 0 ? Math.sin(pulseT * TAU * 2) * 0.08 : 0);
      r.arc(layerCx, layerCy, iRadius * pulse, 0, TAU * innerT, {
        stroke: BRAND.whiteAlpha(iAlpha),
        width: 4,
        cap: "round",
      });
    }

    // Outer layer (teal-tinted UV shell)
    if (outerT > 0) {
      const oRadius = lerp(40, 80, outerT);
      const oAlpha = vis * 0.14 * fadeOut;
      const pulse = 1 + (pulseT > 0 ? Math.sin(pulseT * TAU * 2) * 0.08 : 0);
      r.arc(layerCx, layerCy, oRadius * pulse, 0, TAU * outerT, {
        stroke: BRAND.tealAlpha(oAlpha),
        width: 4,
        cap: "round",
      });
    }

    // ── 4. Measurement ticks ─────────────────────────────
    if (outerT > 0.5) {
      const tickAlpha = vis * 0.08 * fadeOut;
      const tickRadius = 95;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * TAU;
        const x1 = layerCx + Math.cos(angle) * tickRadius;
        const y1 = layerCy + Math.sin(angle) * tickRadius;
        const x2 = layerCx + Math.cos(angle) * (tickRadius + 8);
        const y2 = layerCy + Math.sin(angle) * (tickRadius + 8);
        r.line(x1, y1, x2, y2, {
          stroke: BRAND.tealAlpha(tickAlpha),
          width: 1,
          cap: "round",
        });
      }
    }

    // ── 5. Heat particles ────────────────────────────────
    for (const p of particles) {
      p.dist += p.speed * dt;
      if (p.dist > 280) {
        p.dist = 20 + Math.random() * 30;
        p.angle = Math.random() * TAU;
      }

      const fadeDist = clamp(1 - (p.dist - 60) / 220, 0, 1);
      const px = cx + Math.cos(p.angle) * p.dist;
      const py = cy + Math.sin(p.angle) * p.dist;
      const alpha = p.opacity * fadeDist * vis;

      if (alpha > 0.01) {
        const grad = r.radialGradient(px, py, 0, p.size * 2.5, [
          [0, BRAND.goldAlpha(alpha)],
          [0.5, BRAND.goldAlpha(alpha * 0.4)],
          [1, "transparent"],
        ]);
        r.circle(px, py, p.size * 2.5, { fill: grad });
        r.circle(px, py, p.size * 0.5, { fill: BRAND.goldAlpha(alpha * 2) });
      }
    }

    // ── 6. Subtle corner accents ─────────────────────────
    const cornerAlpha = vis * 0.08 * dm;
    const cLen = 30;
    const cOff = 20;

    // Top-left
    r.line(cOff, cOff, cOff + cLen, cOff, { stroke: BRAND.tealAlpha(cornerAlpha), width: 1, cap: "round" });
    r.line(cOff, cOff, cOff, cOff + cLen, { stroke: BRAND.tealAlpha(cornerAlpha), width: 1, cap: "round" });

    // Bottom-right
    r.line(w - cOff, h - cOff, w - cOff - cLen, h - cOff, { stroke: BRAND.tealAlpha(cornerAlpha), width: 1, cap: "round" });
    r.line(w - cOff, h - cOff, w - cOff, h - cOff - cLen, { stroke: BRAND.tealAlpha(cornerAlpha), width: 1, cap: "round" });

    r.restore();
  },
};
