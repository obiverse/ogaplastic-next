/**
 * Hero scene: Animated water waves, rising water droplets,
 * glowing orbs, rotating gold arcs — brand-defining visuals.
 * Responds to scroll with parallax + fade.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, lerp } from "../scene";

// ── Water droplets (rising, like bubbles from a tank) ───────
interface Droplet {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  size: number;
  speed: number;
  wobbleAmp: number;
  wobbleFreq: number;
  phase: number;
  opacity: number;
}

const droplets: Droplet[] = Array.from({ length: 20 }, () => ({
  x: 0.15 + Math.random() * 0.7,
  y: Math.random(),
  size: 2 + Math.random() * 4,
  speed: 15 + Math.random() * 25,
  wobbleAmp: 8 + Math.random() * 15,
  wobbleFreq: 0.8 + Math.random() * 1.5,
  phase: Math.random() * TAU,
  opacity: 0.08 + Math.random() * 0.18,
}));

// ── Glowing orbs (ambient light sources) ────────────────────
interface Orb {
  x: number;
  y: number;
  baseRadius: number;
  pulseSpeed: number;
  phase: number;
  color: "gold" | "teal" | "white";
}

const orbs: Orb[] = [
  { x: 0.78, y: 0.25, baseRadius: 120, pulseSpeed: 0.4, phase: 0, color: "gold" },
  { x: 0.85, y: 0.72, baseRadius: 200, pulseSpeed: 0.3, phase: 1.2, color: "teal" },
  { x: 0.12, y: 0.15, baseRadius: 100, pulseSpeed: 0.5, phase: 2.4, color: "white" },
  { x: 0.35, y: 0.85, baseRadius: 80, pulseSpeed: 0.6, phase: 3.6, color: "teal" },
];

export const heroScene: SceneSkin = {
  id: "hero",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, scroll } = s;

    // Fade out as user scrolls past hero (0 → 0.15 scroll range)
    const scrollFade = clamp(1 - scroll / 0.15, 0, 1);
    if (scrollFade <= 0) return;

    const parallaxY = scroll * h * 0.3;
    const dt = s.delta / 1000;

    r.save();
    r.alpha = scrollFade;
    r.translate(0, -parallaxY);

    // ── 1. Warm gold glow behind text area ──────────────────
    const goldGlow = r.radialGradient(w * 0.22, h * 0.42, 0, w * 0.4, [
      [0, BRAND.goldAlpha(0.08 + Math.sin(time * 0.3) * 0.03)],
      [0.6, BRAND.goldAlpha(0.02)],
      [1, "transparent"],
    ]);
    r.rect(0, 0, w, h, { fill: goldGlow });

    // ── 2. Glowing orbs (pulsing ambient lights) ────────────
    for (const orb of orbs) {
      const pulse = Math.sin(time * orb.pulseSpeed + orb.phase);
      const radius = orb.baseRadius + pulse * orb.baseRadius * 0.2;
      const alpha = 0.06 + pulse * 0.03;

      const colorFn =
        orb.color === "gold"
          ? BRAND.goldAlpha
          : orb.color === "teal"
            ? BRAND.tealAlpha
            : BRAND.whiteAlpha;

      const gradient = r.radialGradient(
        orb.x * w,
        orb.y * h,
        0,
        radius,
        [
          [0, colorFn(alpha * 1.5)],
          [0.5, colorFn(alpha * 0.5)],
          [1, "transparent"],
        ]
      );
      r.circle(orb.x * w, orb.y * h, radius, { fill: gradient });
    }

    // ── 3. Rotating arc rings ───────────────────────────────
    // Outer ring — slow, gold tinted
    r.save();
    r.translate(w * 0.8, h * 0.35);
    r.rotate(time * 0.08);
    r.arc(0, 0, 180, 0, TAU * 0.6, {
      stroke: BRAND.goldAlpha(0.12),
      width: 1.5,
      cap: "round",
    });
    r.restore();

    // Mid ring — opposite direction
    r.save();
    r.translate(w * 0.8, h * 0.35);
    r.rotate(-time * 0.05);
    r.arc(0, 0, 240, TAU * 0.2, TAU * 0.7, {
      stroke: BRAND.whiteAlpha(0.08),
      width: 1,
      cap: "round",
    });
    r.restore();

    // Inner ring — fast, tight
    r.save();
    r.translate(w * 0.8, h * 0.35);
    r.rotate(time * 0.15);
    r.arc(0, 0, 120, 0, TAU * 0.4, {
      stroke: BRAND.goldAlpha(0.15),
      width: 2,
      cap: "round",
    });
    r.restore();

    // Bottom-left decorative arc
    r.save();
    r.translate(w * 0.08, h * 0.9);
    r.rotate(-time * 0.06);
    r.arc(0, 0, 160, 0, TAU * 0.5, {
      stroke: BRAND.whiteAlpha(0.06),
      width: 1,
      cap: "round",
    });
    r.restore();

    // ── 4. Water wave bands at bottom ───────────────────────
    const waveY = h * 0.88;
    const ctx = r.raw;

    // Wave layer 1 (back, slower, darker)
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y =
        waveY +
        Math.sin(x * 0.008 + time * 0.6) * 12 +
        Math.sin(x * 0.015 + time * 0.9) * 6;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = BRAND.tealDeepAlpha(0.25);
    ctx.fill();

    // Wave layer 2 (front, faster, lighter)
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y =
        waveY +
        8 +
        Math.sin(x * 0.01 + time * 1.2 + 1) * 10 +
        Math.sin(x * 0.02 + time * 0.7 + 2) * 5;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = BRAND.whiteAlpha(0.06);
    ctx.fill();

    // Wave layer 3 (front-most, subtle shimmer)
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 4) {
      const y =
        waveY +
        16 +
        Math.sin(x * 0.012 + time * 1.8 + 3) * 8 +
        Math.sin(x * 0.025 + time * 1.1) * 4;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    const waveGrad = r.linearGradient(0, waveY, 0, h, [
      [0, BRAND.goldAlpha(0.04)],
      [1, BRAND.tealDeepAlpha(0.15)],
    ]);
    ctx.fillStyle = waveGrad;
    ctx.fill();

    // ── 5. Rising water droplets ────────────────────────────
    for (const d of droplets) {
      d.y -= (d.speed * dt) / h;
      if (d.y < -0.05) {
        d.y = 1.05;
        d.x = 0.15 + Math.random() * 0.7;
      }

      const wobble = Math.sin(time * d.wobbleFreq + d.phase) * d.wobbleAmp;
      const dx = d.x * w + wobble;
      const dy = d.y * h;

      // Droplet with soft glow
      const glowGrad = r.radialGradient(dx, dy, 0, d.size * 3, [
        [0, BRAND.whiteAlpha(d.opacity * 0.8)],
        [0.4, BRAND.whiteAlpha(d.opacity * 0.3)],
        [1, "transparent"],
      ]);
      r.circle(dx, dy, d.size * 3, { fill: glowGrad });

      // Bright core
      r.circle(dx, dy, d.size * 0.6, {
        fill: BRAND.whiteAlpha(d.opacity * 2),
      });
    }

    // ── 6. Subtle grid lines (engineering/precision feel) ───
    r.save();
    r.alpha = 0.025;
    const gridSpacing = 60;
    for (let x = gridSpacing; x < w; x += gridSpacing) {
      r.line(x, 0, x, h, { stroke: BRAND.white, width: 0.5 });
    }
    for (let y = gridSpacing; y < h; y += gridSpacing) {
      r.line(0, y, w, y, { stroke: BRAND.white, width: 0.5 });
    }
    r.restore();

    // ── 7. Corner accent lines (premium framing) ────────────
    const cornerLen = 40;
    const cornerOff = 30;
    const cornerAlpha = 0.15 + Math.sin(time * 0.8) * 0.05;

    // Top-left
    r.line(cornerOff, cornerOff, cornerOff + cornerLen, cornerOff, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 2,
      cap: "round",
    });
    r.line(cornerOff, cornerOff, cornerOff, cornerOff + cornerLen, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 2,
      cap: "round",
    });

    // Bottom-right
    r.line(w - cornerOff, h - cornerOff, w - cornerOff - cornerLen, h - cornerOff, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 2,
      cap: "round",
    });
    r.line(w - cornerOff, h - cornerOff, w - cornerOff, h - cornerOff - cornerLen, {
      stroke: BRAND.goldAlpha(cornerAlpha),
      width: 2,
      cap: "round",
    });

    r.restore();
  },
};
