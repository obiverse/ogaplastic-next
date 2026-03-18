/**
 * Products scene: Innovation and quality-focused ambient animation.
 * Concentric ripples (rotary moulding), orbiting quality dots,
 * engineering grid, and flowing material particles.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Floating material particles (left → right flow) ─────────
interface MaterialParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  color: "gold" | "teal";
  wobblePhase: number;
}

const MATERIAL_COUNT = 12;
const materialParticles: MaterialParticle[] = Array.from(
  { length: MATERIAL_COUNT },
  () => ({
    x: Math.random(),
    y: 0.1 + Math.random() * 0.8,
    speed: 5 + Math.random() * 10,
    size: 1.5 + Math.random() * 2,
    opacity: 0.05 + Math.random() * 0.05,
    color: Math.random() > 0.5 ? "gold" as const : "teal" as const,
    wobblePhase: Math.random() * TAU,
  })
);

// Ripple cycle duration
const RIPPLE_CYCLE = 6;

export const productsScene: SceneSkin = {
  id: "products",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2.5, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const dm = isDarkMode() ? 1.5 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Engineering grid ─────────────────────────────────
    r.save();
    r.alpha = vis * 0.025 * dm;
    const gridSpacing = 60;
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      r.line(x, 0, x, h, { stroke: BRAND.teal, width: 0.5 });
    }
    for (let y = gridSpacing; y < h; y += gridSpacing) {
      r.line(0, y, w, y, { stroke: BRAND.teal, width: 0.5 });
    }
    r.restore();

    // ── 2. Concentric ripples (rotary moulding expansion) ───
    const rippleCx = w * 0.3;
    const rippleCy = h * 0.5;
    const maxRadius = 200;

    for (let i = 0; i < 3; i++) {
      const cycleOffset = (i / 3) * RIPPLE_CYCLE;
      const rippleTime = (time + cycleOffset) % RIPPLE_CYCLE;
      const rippleT = rippleTime / RIPPLE_CYCLE;
      const radius = rippleT * maxRadius;
      const alpha = 0.06 * (1 - rippleT) * dm;

      if (alpha > 0.005) {
        r.arc(rippleCx, rippleCy, radius, 0, TAU, {
          stroke: BRAND.tealAlpha(alpha),
          width: 1,
          cap: "round",
        });
      }
    }

    // ── 3. Orbiting quality dots ────────────────────────────
    const orbitCx = w * 0.3;
    const orbitCy = h * 0.5;
    const orbitRx = 160;
    const orbitRy = 100;

    for (let i = 0; i < 6; i++) {
      const angle = time * 0.15 + (i * TAU) / 6;
      const ox = orbitCx + Math.cos(angle) * orbitRx;
      const oy = orbitCy + Math.sin(angle) * orbitRy;
      const dotAlpha = 0.1 * dm;

      // Glow
      const glow = r.radialGradient(ox, oy, 0, 8, [
        [0, BRAND.goldAlpha(dotAlpha * 1.5)],
        [0.5, BRAND.goldAlpha(dotAlpha * 0.4)],
        [1, "transparent"],
      ]);
      r.circle(ox, oy, 8, { fill: glow });

      // Core
      r.circle(ox, oy, 2, { fill: BRAND.goldAlpha(dotAlpha * 2.5) });
    }

    // ── 4. Floating material particles ──────────────────────
    for (const p of materialParticles) {
      p.x += (p.speed * dt) / w;
      if (p.x > 1.05) {
        p.x = -0.05;
        p.y = 0.1 + Math.random() * 0.8;
      }

      const wobble = Math.sin(time * 0.8 + p.wobblePhase) * 4;
      const px = p.x * w;
      const py = p.y * h + wobble;
      const colorFn = p.color === "gold" ? BRAND.goldAlpha : BRAND.tealAlpha;
      const alpha = p.opacity * dm;

      const grad = r.radialGradient(px, py, 0, p.size * 2.5, [
        [0, colorFn(alpha)],
        [0.5, colorFn(alpha * 0.3)],
        [1, "transparent"],
      ]);
      r.circle(px, py, p.size * 2.5, { fill: grad });
    }

    // ── 5. Rotating arcs (biaxial moulding reference) ───────
    r.save();
    r.translate(w * 0.75, h * 0.3);
    r.rotate(time * 0.05);
    r.arc(0, 0, 100, 0, TAU * 0.5, {
      stroke: BRAND.tealAlpha(0.06 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    r.save();
    r.translate(w * 0.75, h * 0.7);
    r.rotate(-time * 0.04);
    r.arc(0, 0, 100, TAU * 0.3, TAU * 0.8, {
      stroke: BRAND.tealAlpha(0.06 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 6. Corner accents (teal) ────────────────────────────
    const cornerAlpha = vis * 0.08 * dm;
    const cLen = 25;
    const cOff = 18;

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
