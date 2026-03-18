/**
 * Interactive tank/bin visualization for the Order Builder.
 * Reads config from a mutable ref (product type + volume index).
 * Draws a simple 2D silhouette that scales with volume.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneState, SceneSkin } from "../scene";
import { lerp, clamp, BRAND, isDarkMode, TAU } from "../scene";

export interface OrderVizConfig {
  productType: "tank" | "bin" | "custom";
  volumeIndex: number;
  maxIndex: number; // length of price array - 1
}

// Volume → scale: smallest = 0.45, largest = 1.0
function volumeScale(index: number, max: number): number {
  if (max <= 0) return 0.7;
  return 0.45 + (index / max) * 0.55;
}

export function createOrderTankScene(
  configRef: React.MutableRefObject<OrderVizConfig>
): SceneSkin {
  let currentScale = 0.7;
  let targetScale = 0.7;

  // Ambient floating particles
  const particles = Array.from({ length: 8 }, () => ({
    x: Math.random(),
    y: Math.random(),
    speed: 0.02 + Math.random() * 0.03,
    size: 1 + Math.random() * 2,
    phase: Math.random() * TAU,
  }));

  return {
    id: "order-tank-viz",

    render(r: CanvasRenderer, state: SceneState) {
      const { width: w, height: h, time } = state;
      const dm = isDarkMode() ? 1.4 : 1;
      const config = configRef.current;

      // Update target scale
      targetScale = volumeScale(config.volumeIndex, config.maxIndex);
      // Smooth lerp toward target
      currentScale = lerp(currentScale, targetScale, 0.08);

      r.clear();

      // Background glow
      const glow = r.radialGradient(w / 2, h * 0.45, 0, w * 0.4, [
        [0, BRAND.tealAlpha(0.08 * dm)],
        [0.6, BRAND.tealAlpha(0.02 * dm)],
        [1, "transparent"],
      ]);
      r.circle(w / 2, h * 0.45, w * 0.4, { fill: glow });

      // Ambient particles
      r.alpha = 0.3 * dm;
      for (const p of particles) {
        p.y -= p.speed * (state.delta / 1000) * 0.3;
        if (p.y < -0.05) {
          p.y = 1.05;
          p.x = 0.2 + Math.random() * 0.6;
        }
        const wobble = Math.sin(time * 1.5 + p.phase) * 8;
        r.circle(p.x * w + wobble, p.y * h, p.size, {
          fill: BRAND.goldAlpha(0.4),
        });
      }
      r.alpha = 1;

      // Draw product silhouette
      const cx = w / 2;
      const baseY = h * 0.85;
      const maxH = h * 0.55;
      const maxW = w * 0.35;

      if (config.productType === "bin") {
        drawBin(r, cx, baseY, maxW * currentScale, maxH * currentScale, time, dm);
      } else {
        drawTank(r, cx, baseY, maxW * currentScale, maxH * currentScale, time, dm);
      }

      // Scale label
      const pct = Math.round(currentScale * 100);
      r.alpha = 0.5 * dm;
      r.text(`${pct}%`, cx, baseY + 20, {
        fill: BRAND.whiteAlpha(0.5),
        font: '11px "DM Sans", sans-serif',
        align: "center",
      });
      r.alpha = 1;
    },
  };
}

function drawTank(
  r: CanvasRenderer,
  cx: number,
  baseY: number,
  bodyW: number,
  bodyH: number,
  time: number,
  dm: number
) {
  const halfW = bodyW / 2;
  const domeH = bodyW * 0.25;
  const topY = baseY - bodyH;
  const legH = bodyH * 0.08;
  const legW = bodyW * 0.06;

  r.save();

  // Shadow
  r.alpha = 0.1 * dm;
  r.raw.beginPath();
  r.raw.ellipse(cx, baseY + 4, halfW * 0.9, 6, 0, 0, TAU);
  r.raw.fillStyle = "#000";
  r.raw.fill();
  r.alpha = 1;

  // Body gradient
  const bodyGrad = r.linearGradient(cx - halfW, 0, cx + halfW, 0, [
    [0, "#5A6A6E"],
    [0.3, "#8A9A9E"],
    [0.5, "#A8B8BC"],
    [0.7, "#8A9A9E"],
    [1, "#5A6A6E"],
  ]);

  // Body
  r.roundRect(cx - halfW, topY, bodyW, bodyH - legH, 4, { fill: bodyGrad });

  // Dome (top arc)
  r.raw.beginPath();
  r.raw.ellipse(cx, topY, halfW, domeH, 0, Math.PI, 0);
  r.raw.fillStyle = bodyGrad;
  r.raw.fill();

  // Inner white layer hint
  r.alpha = 0.15 * dm;
  r.roundRect(cx - halfW + 6, topY + domeH, bodyW - 12, bodyH - legH - domeH - 10, 2, {
    fill: "#fff",
  });
  r.alpha = 1;

  // Legs
  const legSpacing = bodyW * 0.3;
  for (let i = -1; i <= 1; i++) {
    r.rect(cx + i * legSpacing - legW / 2, baseY - legH, legW, legH, {
      fill: "#6A7A7E",
    });
  }

  // Lid / manhole
  r.raw.beginPath();
  r.raw.ellipse(cx, topY - domeH * 0.3, halfW * 0.25, domeH * 0.3, 0, Math.PI, 0);
  r.raw.fillStyle = "#7A8A8E";
  r.raw.fill();

  // Subtle pulse glow
  const pulse = 0.5 + Math.sin(time * 2) * 0.15;
  r.alpha = pulse * 0.12 * dm;
  const glowGrad = r.radialGradient(cx, topY + bodyH * 0.3, 0, bodyW, [
    [0, BRAND.goldAlpha(0.3)],
    [1, "transparent"],
  ]);
  r.circle(cx, topY + bodyH * 0.3, bodyW, { fill: glowGrad });
  r.alpha = 1;

  r.restore();
}

function drawBin(
  r: CanvasRenderer,
  cx: number,
  baseY: number,
  bodyW: number,
  bodyH: number,
  time: number,
  dm: number
) {
  const topW = bodyW;
  const botW = bodyW * 0.7;
  const lidH = bodyH * 0.1;
  const topY = baseY - bodyH;

  r.save();

  // Shadow
  r.alpha = 0.1 * dm;
  r.raw.beginPath();
  r.raw.ellipse(cx, baseY + 4, botW / 2 * 0.9, 5, 0, 0, TAU);
  r.raw.fillStyle = "#000";
  r.raw.fill();
  r.alpha = 1;

  // Body (trapezoid)
  const bodyGrad = r.linearGradient(cx - topW / 2, 0, cx + topW / 2, 0, [
    [0, "#4A7A4E"],
    [0.3, "#6A9A6E"],
    [0.5, "#8ABA8E"],
    [0.7, "#6A9A6E"],
    [1, "#4A7A4E"],
  ]);

  r.raw.beginPath();
  r.raw.moveTo(cx - topW / 2, topY + lidH);
  r.raw.lineTo(cx + topW / 2, topY + lidH);
  r.raw.lineTo(cx + botW / 2, baseY);
  r.raw.lineTo(cx - botW / 2, baseY);
  r.raw.closePath();
  r.raw.fillStyle = bodyGrad;
  r.raw.fill();

  // Lid
  r.roundRect(cx - topW / 2 - 4, topY, topW + 8, lidH, 4, {
    fill: "#5A8A5E",
  });

  // Handle
  r.raw.beginPath();
  r.raw.arc(cx, topY - 3, topW * 0.15, Math.PI, 0);
  r.raw.strokeStyle = "#5A8A5E";
  r.raw.lineWidth = 3;
  r.raw.stroke();

  // Pulse glow
  const pulse = 0.5 + Math.sin(time * 2) * 0.15;
  r.alpha = pulse * 0.1 * dm;
  const glowGrad = r.radialGradient(cx, topY + bodyH * 0.4, 0, bodyW, [
    [0, BRAND.goldAlpha(0.2)],
    [1, "transparent"],
  ]);
  r.circle(cx, topY + bodyH * 0.4, bodyW, { fill: glowGrad });
  r.alpha = 1;

  r.restore();
}
