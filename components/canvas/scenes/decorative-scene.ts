/**
 * Decorative scene: Subtle background arcs for Technology/Sustainability sections.
 * Extremely subtle — enhances without distracting.
 */
import type { CanvasRenderer } from "../renderer";
import type { SceneSkin, SceneState } from "../scene";
import { BRAND, TAU, lerp } from "../scene";

export const decorativeScene: SceneSkin = {
  id: "decorative",

  render(r: CanvasRenderer, s: SceneState): void {
    const { width: w, height: h, time, sectionProgress } = s;

    // Scale up as section enters view
    const scale = lerp(0.5, 1.0, sectionProgress);
    const opacity = sectionProgress * 0.06; // Max 6% opacity

    if (opacity <= 0.005) return; // Skip when invisible

    // Arc 1: large, bottom-right
    r.save();
    r.translate(w * 0.85, h * 0.7);
    r.scale(scale);
    r.rotate(time * 0.01);
    r.arc(0, 0, 200, 0, TAU * 0.6, {
      stroke: BRAND.tealAlpha(opacity),
      width: 1,
    });
    r.restore();

    // Arc 2: medium, top-left
    r.save();
    r.translate(w * 0.1, h * 0.25);
    r.scale(scale);
    r.rotate(-time * 0.008);
    r.arc(0, 0, 140, 0, TAU * 0.45, {
      stroke: BRAND.tealAlpha(opacity * 0.7),
      width: 1,
    });
    r.restore();

    // Arc 3: small accent
    r.save();
    r.translate(w * 0.5, h * 0.1);
    r.scale(scale);
    r.rotate(time * 0.015);
    r.arc(0, 0, 80, 0, TAU * 0.3, {
      stroke: BRAND.tealAlpha(opacity * 0.5),
      width: 1,
    });
    r.restore();
  },
};
