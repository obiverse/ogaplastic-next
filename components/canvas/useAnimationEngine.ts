"use client";

/**
 * useAnimationEngine: React hook that wires together
 * CanvasRenderer, AnimationEngine, scroll tracking, and SceneSkin.
 *
 * All animation state lives in refs — never triggers React re-renders.
 */

import { useEffect, useRef } from "react";
import { CanvasRenderer } from "./renderer";
import type { SceneSkin, SceneState } from "./scene";
import { AnimationEngine } from "./engine";
import { initWasm, createAnimationClock } from "@/lib/wasm";

export interface UseAnimationEngineOptions {
  /** Ticks per second (default: 1) */
  tickRate?: number;
  /** Auto-start on mount (default: true) */
  autoStart?: boolean;
  /** Pause rendering when off-screen (default: true) */
  pauseOffscreen?: boolean;
  /** Load WASM for tick events (default: false) */
  useWasm?: boolean;
}

export function useAnimationEngine(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  skin: SceneSkin,
  options: UseAnimationEngineOptions = {}
): void {
  const skinRef = useRef<SceneSkin>(skin);
  skinRef.current = skin;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion preference
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const opts = optionsRef.current;

    // Initialize renderer
    const renderer = new CanvasRenderer(canvas);
    skinRef.current.init?.(renderer);

    // Mutable state (refs, not React state)
    let elapsed = 0;
    let scrollPos = 0;
    let sectionProgress = 0;
    let isVisible = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let wasmClock: any = null;

    // WASM init (fire and forget)
    if (opts.useWasm) {
      initWasm().then(() => {
        wasmClock = createAnimationClock();
      });
    }

    // Scroll tracking
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollPos = scrollable > 0 ? window.scrollY / scrollable : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Section visibility via IntersectionObserver
    const section = canvas.closest("section") ?? canvas.parentElement;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        sectionProgress = entry.intersectionRatio;
        isVisible = entry.isIntersecting;
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );
    if (section) intersectionObserver.observe(section);

    // Resize handling
    const resizeObserver = new ResizeObserver(() => {
      renderer.resize();
      skinRef.current.onResize?.(renderer.width, renderer.height);
    });
    resizeObserver.observe(canvas.parentElement ?? canvas);

    // Engine
    const tickRate = opts.tickRate ?? 1;
    const engine = new AnimationEngine(tickRate * 1000, {
      onTick: () => {
        wasmClock?.tick();
      },
      onFrame: (tick, alpha, deltaMs) => {
        // Skip rendering when off-screen
        if (opts.pauseOffscreen !== false && !isVisible) return;

        elapsed += deltaMs / 1000;

        const state: SceneState = {
          time: elapsed,
          delta: deltaMs,
          alpha,
          scroll: scrollPos,
          sectionProgress,
          tick,
          width: renderer.width,
          height: renderer.height,
        };

        renderer.clear();
        skinRef.current.render(renderer, state);
      },
    });

    if (opts.autoStart !== false) engine.start();

    // Cleanup
    return () => {
      engine.stop();
      window.removeEventListener("scroll", onScroll);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      wasmClock?.free();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
