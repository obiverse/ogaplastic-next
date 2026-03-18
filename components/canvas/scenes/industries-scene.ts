/**
 * Industries scene: Network constellation.
 * Pulsing nodes, flowing connection lines, central hub,
 * ambient floating dots — suggests interconnected trust.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, clamp, isDarkMode } from "../scene";

// ── Node positions (normalized 0-1, roughly matching card grid) ──
const NODES = [
  // Top row (2 hero cards) — wider spacing
  { x: 0.28, y: 0.28, phase: 0 },
  { x: 0.72, y: 0.28, phase: 1.2 },
  // Bottom row (4 standard cards)
  { x: 0.14, y: 0.7, phase: 2.4 },
  { x: 0.38, y: 0.7, phase: 3.6 },
  { x: 0.62, y: 0.7, phase: 4.8 },
  { x: 0.86, y: 0.7, phase: 0.6 },
];

// Connections between nodes (indices)
const EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [1, 4], [1, 5],
  [2, 3], [3, 4], [4, 5],
];

// Central hub
const HUB = { x: 0.5, y: 0.48 };

// Flowing particles along edges
interface FlowParticle {
  edge: number;
  t: number; // 0-1 position along edge
  speed: number;
}

const FLOW_COUNT = 12;
const flowParticles: FlowParticle[] = Array.from({ length: FLOW_COUNT }, (_, i) => ({
  edge: i % EDGES.length,
  t: Math.random(),
  speed: 0.08 + Math.random() * 0.12,
}));

// Ambient floating dots
interface FloatingDot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

const FLOAT_COUNT = 8;
const floatingDots: FloatingDot[] = Array.from({ length: FLOAT_COUNT }, () => ({
  x: Math.random(),
  y: Math.random(),
  vx: (Math.random() - 0.5) * 8,
  vy: (Math.random() - 0.5) * 8,
  size: 1 + Math.random() * 2,
  opacity: 0.04 + Math.random() * 0.06,
}));

export const industriesScene: SceneSkin = {
  id: "industries",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress, delta } = s;

    const vis = clamp(sectionProgress * 2, 0, 1);
    if (vis <= 0.01) return;

    const dt = delta / 1000;
    // Boost opacity in dark mode for visibility on darker surfaces
    const dm = isDarkMode() ? 1.6 : 1;

    r.save();
    r.alpha = vis;

    // ── 1. Connection lines ──────────────────────────────
    for (const [a, b] of EDGES) {
      const na = NODES[a];
      const nb = NODES[b];
      r.line(
        na.x * w, na.y * h,
        nb.x * w, nb.y * h,
        { stroke: BRAND.tealAlpha(vis * 0.05 * dm), width: 1 }
      );
    }

    // Hub connections (from hub to each node)
    for (const node of NODES) {
      r.line(
        HUB.x * w, HUB.y * h,
        node.x * w, node.y * h,
        { stroke: BRAND.tealAlpha(vis * 0.03 * dm), width: 0.5 }
      );
    }

    // ── 2. Flowing particles along edges ─────────────────
    for (const p of flowParticles) {
      p.t += p.speed * dt;
      if (p.t > 1) {
        p.t = 0;
        p.edge = (p.edge + 1) % EDGES.length;
      }

      const [a, b] = EDGES[p.edge];
      const na = NODES[a];
      const nb = NODES[b];
      const px = (na.x + (nb.x - na.x) * p.t) * w;
      const py = (na.y + (nb.y - na.y) * p.t) * h;

      // Fade at edges of travel
      const edgeFade = Math.sin(p.t * Math.PI);
      const alpha = vis * 0.15 * edgeFade * dm;

      r.circle(px, py, 2, { fill: BRAND.tealAlpha(alpha) });
    }

    // ── 3. Node points (pulsing) ─────────────────────────
    for (const node of NODES) {
      const pulse = Math.sin(time * 0.8 + node.phase);
      const radius = 4 + pulse * 1.5;
      const alpha = vis * (0.12 + pulse * 0.04) * dm;

      // Glow
      const grad = r.radialGradient(
        node.x * w, node.y * h, 0, radius * 4,
        [
          [0, BRAND.tealAlpha(alpha * 0.6)],
          [0.5, BRAND.tealAlpha(alpha * 0.2)],
          [1, "transparent"],
        ]
      );
      r.circle(node.x * w, node.y * h, radius * 4, { fill: grad });

      // Core dot
      r.circle(node.x * w, node.y * h, radius, {
        fill: BRAND.tealAlpha(alpha * 1.5),
      });
    }

    // ── 4. Central hub (gold accent) ─────────────────────
    const hubPulse = Math.sin(time * 0.5);
    const hubRadius = 6 + hubPulse * 2;
    const hubAlpha = vis * (0.15 + hubPulse * 0.05) * dm;

    const hubGrad = r.radialGradient(
      HUB.x * w, HUB.y * h, 0, hubRadius * 5,
      [
        [0, BRAND.goldAlpha(hubAlpha * 0.5)],
        [0.4, BRAND.goldAlpha(hubAlpha * 0.15)],
        [1, "transparent"],
      ]
    );
    r.circle(HUB.x * w, HUB.y * h, hubRadius * 5, { fill: hubGrad });
    r.circle(HUB.x * w, HUB.y * h, hubRadius, {
      fill: BRAND.goldAlpha(hubAlpha),
    });

    // ── 5. Ambient floating dots ─────────────────────────
    for (const dot of floatingDots) {
      dot.x += dot.vx * dt / w;
      dot.y += dot.vy * dt / h;

      // Wrap around
      if (dot.x < -0.05) dot.x = 1.05;
      if (dot.x > 1.05) dot.x = -0.05;
      if (dot.y < -0.05) dot.y = 1.05;
      if (dot.y > 1.05) dot.y = -0.05;

      r.circle(dot.x * w, dot.y * h, dot.size, {
        fill: BRAND.tealAlpha(dot.opacity * vis * dm),
      });
    }

    r.restore();
  },
};
