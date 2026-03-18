/**
 * Contact scene: Warm, conversion-focused ambient animation.
 * Gold-dominant palette (trust, premium) with converging flow particles,
 * pulsing connection dots, and gentle envelope/send motifs.
 * Designed to feel inviting — visitors are sharing contact details here.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Converging particles (flow toward form on right side) ───
interface FlowParticle {
  x: number; // 0-1 normalized
  y: number;
  speed: number;
  size: number;
  opacity: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
}

const FLOW_COUNT = 16;
const flowParticles: FlowParticle[] = Array.from(
  { length: FLOW_COUNT },
  () => ({
    x: Math.random() * 0.3, // start on left
    y: 0.15 + Math.random() * 0.7,
    speed: 8 + Math.random() * 15,
    size: 1.5 + Math.random() * 2.5,
    opacity: 0.06 + Math.random() * 0.1,
    wobbleAmp: 3 + Math.random() * 8,
    wobbleFreq: 0.5 + Math.random() * 1.2,
    phase: Math.random() * TAU,
  })
);

// ── Rising trust particles (gentle upward drift on left column) ──
interface TrustDot {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  phase: number;
}

const TRUST_COUNT = 10;
const trustDots: TrustDot[] = Array.from({ length: TRUST_COUNT }, () => ({
  x: 0.05 + Math.random() * 0.4,
  y: Math.random(),
  size: 1 + Math.random() * 2,
  speed: 6 + Math.random() * 12,
  opacity: 0.05 + Math.random() * 0.08,
  phase: Math.random() * TAU,
}));

// ── Pulsing connection nodes (map to contact info icons) ─────
const connectionNodes = [
  { x: 0.08, y: 0.35, color: "teal" as const }, // location icon
  { x: 0.08, y: 0.52, color: "teal" as const }, // phone icon
  { x: 0.08, y: 0.65, color: "gold" as const }, // email icon
];

export const contactScene: SceneSkin = {
  id: "contact",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2.5, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    const dm = isDarkMode() ? 1.5 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Warm gold glow behind form area (right half) ──────
    const glowX = w * 0.72;
    const glowY = h * 0.45;
    const glowRadius = Math.min(w, h) * 0.55;
    const glowPulse = 0.06 + Math.sin(time * 0.25) * 0.02;

    const goldGlow = r.radialGradient(glowX, glowY, 0, glowRadius, [
      [0, BRAND.goldAlpha(glowPulse * dm)],
      [0.4, BRAND.goldAlpha(glowPulse * 0.4 * dm)],
      [1, "transparent"],
    ]);
    r.rect(0, 0, w, h, { fill: goldGlow });

    // Secondary teal glow on left (contact info side)
    const tealGlowX = w * 0.18;
    const tealGlowY = h * 0.5;
    const tealPulse = 0.04 + Math.sin(time * 0.3 + 1) * 0.015;

    const tealGlow = r.radialGradient(
      tealGlowX,
      tealGlowY,
      0,
      glowRadius * 0.6,
      [
        [0, BRAND.tealAlpha(tealPulse * dm)],
        [0.5, BRAND.tealAlpha(tealPulse * 0.3 * dm)],
        [1, "transparent"],
      ]
    );
    r.rect(0, 0, w, h, { fill: tealGlow });

    // ── 2. Converging flow particles (left → right toward form) ──
    for (const p of flowParticles) {
      p.x += (p.speed * dt) / w;
      if (p.x > 0.95) {
        p.x = -0.05;
        p.y = 0.15 + Math.random() * 0.7;
      }

      const wobble =
        Math.sin(time * p.wobbleFreq + p.phase) * p.wobbleAmp;
      const px = p.x * w;
      const py = p.y * h + wobble;

      // Fade in near edges, brighten as they approach form
      const xFade = p.x < 0.1 ? p.x / 0.1 : p.x > 0.8 ? (1 - p.x) / 0.2 : 1;
      const alpha = p.opacity * xFade * dm;

      if (alpha > 0.005) {
        const grad = r.radialGradient(px, py, 0, p.size * 3, [
          [0, BRAND.goldAlpha(alpha * 1.2)],
          [0.5, BRAND.goldAlpha(alpha * 0.4)],
          [1, "transparent"],
        ]);
        r.circle(px, py, p.size * 3, { fill: grad });
        r.circle(px, py, p.size * 0.5, {
          fill: BRAND.goldAlpha(alpha * 2),
        });
      }
    }

    // ── 3. Rising trust particles (left column, gentle upward) ──
    for (const d of trustDots) {
      d.y -= (d.speed * dt) / h;
      if (d.y < -0.05) {
        d.y = 1.05;
        d.x = 0.05 + Math.random() * 0.4;
      }

      const wobble = Math.sin(time * 0.8 + d.phase) * 3;
      const dx = d.x * w + wobble;
      const dy = d.y * h;

      const grad = r.radialGradient(dx, dy, 0, d.size * 2.5, [
        [0, BRAND.whiteAlpha(d.opacity * dm)],
        [0.5, BRAND.whiteAlpha(d.opacity * 0.3 * dm)],
        [1, "transparent"],
      ]);
      r.circle(dx, dy, d.size * 2.5, { fill: grad });
    }

    // ── 4. Pulsing connection nodes (at contact info positions) ──
    for (let i = 0; i < connectionNodes.length; i++) {
      const node = connectionNodes[i];
      const nx = node.x * w;
      const ny = node.y * h;
      const pulse = Math.sin(time * 0.6 + i * 1.2);
      const nodeRadius = 20 + pulse * 5;
      const nodeAlpha = (0.08 + pulse * 0.03) * dm;

      const colorFn =
        node.color === "gold" ? BRAND.goldAlpha : BRAND.tealAlpha;

      // Outer glow ring
      const ringGrad = r.radialGradient(nx, ny, 0, nodeRadius, [
        [0, colorFn(nodeAlpha * 1.5)],
        [0.6, colorFn(nodeAlpha * 0.5)],
        [1, "transparent"],
      ]);
      r.circle(nx, ny, nodeRadius, { fill: ringGrad });

      // Core dot
      r.circle(nx, ny, 2.5, { fill: colorFn(nodeAlpha * 3) });

      // Connection line from node toward center (subtle link lines)
      if (i < connectionNodes.length - 1) {
        const next = connectionNodes[i + 1];
        r.line(nx, ny, next.x * w, next.y * h, {
          stroke: BRAND.tealAlpha(0.04 * dm),
          width: 0.5,
        });
      }
    }

    // ── 5. Envelope send motif (periodic arc sweep) ──────────
    // A subtle arc that sweeps from contact side toward form side
    const sweepCycle = time % 8; // 8-second cycle
    if (sweepCycle < 3) {
      const sweepT = sweepCycle / 3;
      const sweepAlpha = Math.sin(sweepT * Math.PI) * 0.06 * dm;
      const sweepX = w * (0.15 + sweepT * 0.6);
      const sweepY = h * 0.5 + Math.sin(sweepT * Math.PI) * -30;

      // Small moving arc — represents message in flight
      r.save();
      r.translate(sweepX, sweepY);
      r.rotate(sweepT * Math.PI * 0.5);
      r.arc(0, 0, 12, 0, TAU * 0.6, {
        stroke: BRAND.goldAlpha(sweepAlpha),
        width: 1.5,
        cap: "round",
      });
      r.restore();

      // Trail
      if (sweepT > 0.1) {
        const trailGrad = r.radialGradient(sweepX, sweepY, 0, 25, [
          [0, BRAND.goldAlpha(sweepAlpha * 0.5)],
          [1, "transparent"],
        ]);
        r.circle(sweepX, sweepY, 25, { fill: trailGrad });
      }
    }

    // ── 6. Soft decorative arcs (premium framing) ────────────
    // Top-right arc near form
    r.save();
    r.translate(w * 0.88, h * 0.12);
    r.rotate(time * 0.04);
    r.arc(0, 0, 80, 0, TAU * 0.4, {
      stroke: BRAND.goldAlpha(0.06 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // Bottom-left arc near contact info
    r.save();
    r.translate(w * 0.1, h * 0.88);
    r.rotate(-time * 0.03);
    r.arc(0, 0, 60, TAU * 0.2, TAU * 0.7, {
      stroke: BRAND.tealAlpha(0.05 * dm),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 7. Corner accents ────────────────────────────────────
    const cornerAlpha = vis * 0.1 * dm;
    const cLen = 25;
    const cOff = 18;

    // Top-left (gold)
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

    // Bottom-right (gold)
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
