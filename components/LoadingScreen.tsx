"use client";

import { useEffect, useState } from "react";
import { LogoMonoWhite } from "@/components/ui/Logo";
import { AnimatedCanvas } from "@/components/canvas/AnimatedCanvas";
import { loadingScene } from "@/components/canvas/scenes/loading-scene";

export function LoadingScreen() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`loading-screen ${hidden ? "hidden" : ""}`}>
      {/* Canvas for spinning arc + progress bar */}
      <AnimatedCanvas
        skin={loadingScene}
        className="absolute inset-0"
        tickRate={2}
        pauseOffscreen={false}
      />

      {/* Logo + text overlaid on canvas */}
      <div className="loading-logo relative z-10">
        <LogoMonoWhite size={72} />
      </div>
      <div className="text-white/80 text-sm font-medium mt-4 tracking-widest uppercase relative z-10">
        OGA PLASTIC
      </div>
    </div>
  );
}
