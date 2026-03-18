/**
 * Pricing scene: Premium convergence animation.
 * Gold-dominant particles converging toward center,
 * progress rings, floating gold dust — luxury feel.
 * On teal gradient background, so uses white + gold accents.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Converging particles (spawn at edges, flow to center) ───
interface ConvergeParticle {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  angle: number; // direction toward center
}

const CONVERGE_COUNT = 14;
const convergeParticles: ConvergeParticle[] = Array.from(
  { length: CONVERGE_COUNT },
  () => spawnEdgeParticle()
);

function spawnEdgeParticle(): ConvergeParticle {
  // Spawn on a random edge
  const edge = Math.floor(Math.random() * 4);
  let x: number, y: number;
  switch (edge) {
    case 0: x = Math.random(); y = -0.05; break;      // top
    case 1: x = 1.05; y = Math.random(); break;       // right
    case 2: x = Math.random(); y = 1.05; break;       // bottom
    default: x = -0.05; y = Math.random(); break;     // left
  }
  const angle = Math.atan2(0.5 - y, 0.5 - x);
  return {
    x,
    y,
    speed: 15 + Math.random() * 10,
    size: 2 + Math.random() * 1.5,
    opacity: 0.06 + Math.random() * 0.06,
    angle,
  };
}

// ── Floating gold dust ──────────────────────────────────────
interface GoldDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const DUST_COUNT = 10;
const goldDust: GoldDust[] = Array.from({ length: DUST_COUNT }, () => ({
  x: Math.random(),
  y: Math.random(),
  vx: (Math.random() - 0.5) * 3,
  vy: (Math.random() - 0.5) * 3,
  size: 0.8 + Math.random() * 1.2,
  opacity: 0.03 + Math.random() * 0.03,
}));

export const pricingScene: SceneSkin = {
  id: "pricing",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2.5, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const dm = isDarkMode() ? 1.3 : 1; // Less boost — already on dark bg

    r.save();
    r.alpha = vis;

    // ── 1. Central spotlight glow ───────────────────────────
    const spotPulse = 0.04 + Math.sin(time * 0.2) * 0.01;
    const spotGlow = r.radialGradient(w * 0.5, h * 0.5, 0, Math.min(w, h) * 0.4, [
      [0, BRAND.whiteAlpha(spotPulse * dm)],
      [0.5, BRAND.whiteAlpha(spotPulse * 0.3 * dm)],
      [1, "transparent"],
    ]);
    r.rect(0, 0, w, h, { fill: spotGlow });

    // ── 2. Progress rings (concentric arcs) ─────────────────
    const ringCx = w * 0.5;
    const ringCy = h * 0.5;

    // Outer ring — slow, white
    r.save();
    r.translate(ringCx, ringCy);
    r.rotate(time * 0.02);
    r.arc(0, 0, 250, 0, TAU * 0.5, {
      stroke: BRAND.whiteAlpha(0.04 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // Inner ring — faster, gold, opposite direction
    r.save();
    r.translate(ringCx, ringCy);
    r.rotate(-time * 0.04);
    r.arc(0, 0, 180, TAU * 0.2, TAU * 0.7, {
      stroke: BRAND.goldAlpha(0.06 * dm),
      width: 1.5,
      cap: "round",
    });
    r.restore();

    // ── 3. Converging particles ─────────────────────────────
    for (let i = 0; i < convergeParticles.length; i++) {
      const p = convergeParticles[i];

      // Move toward center
      p.x += (Math.cos(p.angle) * p.speed * dt) / w;
      p.y += (Math.sin(p.angle) * p.speed * dt) / h;

      // Check if reached center area
      const distToCenter = Math.sqrt(
        Math.pow(p.x - 0.5, 2) + Math.pow(p.y - 0.5, 2)
      );
      if (distToCenter < 0.05) {
        const newP = spawnEdgeParticle();
        convergeParticles[i] = newP;
        continue;
      }

      const px = p.x * w;
      const py = p.y * h;

      // Fade based on distance (brighter near center)
      const fadeAlpha = p.opacity * (1 - distToCenter * 0.8) * dm;

      if (fadeAlpha > 0.005) {
        const grad = r.radialGradient(px, py, 0, p.size * 3, [
          [0, BRAND.goldAlpha(fadeAlpha * 1.5)],
          [0.5, BRAND.goldAlpha(fadeAlpha * 0.4)],
          [1, "transparent"],
        ]);
        r.circle(px, py, p.size * 3, { fill: grad });
        r.circle(px, py, p.size * 0.5, {
          fill: BRAND.goldAlpha(fadeAlpha * 2.5),
        });
      }
    }

    // ── 4. Floating gold dust ───────────────────────────────
    for (const d of goldDust) {
      d.x += (d.vx * dt) / w;
      d.y += (d.vy * dt) / h;

      // Wrap around
      if (d.x < -0.05) d.x = 1.05;
      if (d.x > 1.05) d.x = -0.05;
      if (d.y < -0.05) d.y = 1.05;
      if (d.y > 1.05) d.y = -0.05;

      r.circle(d.x * w, d.y * h, d.size, {
        fill: BRAND.goldAlpha(d.opacity * dm),
      });
    }

    // ── 5. Corner accents (white — section bg is teal) ──────
    const cornerAlpha = vis * 0.1 * dm;
    const cLen = 25;
    const cOff = 18;

    r.line(cOff, cOff, cOff + cLen, cOff, {
      stroke: BRAND.whiteAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(cOff, cOff, cOff, cOff + cLen, {
      stroke: BRAND.whiteAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.line(w - cOff, h - cOff, w - cOff - cLen, h - cOff, {
      stroke: BRAND.whiteAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });
    r.line(w - cOff, h - cOff, w - cOff, h - cOff - cLen, {
      stroke: BRAND.whiteAlpha(cornerAlpha),
      width: 1.5,
      cap: "round",
    });

    r.restore();
  },
};
