"use client";

import { useRef } from "react";
import { useAnimationEngine } from "./useAnimationEngine";
import type { SceneSkin } from "./scene";

interface AnimatedCanvasProps {
  skin: SceneSkin;
  className?: string;
  /** Ticks per second for the engine (default: 1) */
  tickRate?: number;
  /** Load WASM for tick events (default: false) */
  useWasm?: boolean;
  /** Pause when canvas is off-screen (default: true) */
  pauseOffscreen?: boolean;
}

export function AnimatedCanvas({
  skin,
  className = "",
  tickRate = 1,
  useWasm = false,
  pauseOffscreen = true,
}: AnimatedCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationEngine(canvasRef, skin, {
    tickRate,
    useWasm,
    pauseOffscreen,
  });

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
      aria-hidden="true"
    />
  );
}
