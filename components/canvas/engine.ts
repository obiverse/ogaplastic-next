/**
 * AnimationEngine: Fixed-timestep game loop for React.
 *
 * Ported from BeeClock's Engine — stripped Angular signals/zones,
 * uses plain callbacks instead. Implements Glenn Fiedler's
 * "Fix Your Timestep" pattern.
 *
 * Architecture: RAF (60fps) → accumulator → fixed ticks → callbacks
 */

export interface EngineCallbacks {
  /** Called at fixed timestep intervals */
  onTick?: (tick: number) => void;
  /** Called every RAF frame with interpolation data */
  onFrame?: (tick: number, alpha: number, deltaMs: number) => void;
}

export class AnimationEngine {
  private rafId: number | null = null;
  private lastFrameTime = 0;
  private accumulator = 0;
  private tickCount = 0;
  private running = false;
  private tickRateMs: number;
  private callbacks: EngineCallbacks;

  /** Cap ticks per frame to prevent spiral-of-death on tab wake */
  private readonly MAX_TICKS_PER_FRAME = 5;

  constructor(tickRateMs = 1000, callbacks: EngineCallbacks = {}) {
    if (tickRateMs <= 0 || !Number.isFinite(tickRateMs)) {
      throw new Error(`tickRateMs must be positive finite, got: ${tickRateMs}`);
    }
    this.tickRateMs = tickRateMs;
    this.callbacks = callbacks;
  }

  get tick(): number {
    return this.tickCount;
  }

  get isRunning(): boolean {
    return this.running;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.tickCount = 0;
    this.accumulator = 0;
    this.lastFrameTime = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /**
   * Frame callback — runs at display refresh rate (~60fps).
   * Accumulator drains in fixed chunks; alpha interpolates between ticks.
   */
  private frame = (now: DOMHighResTimeStamp): void => {
    if (!this.running) return;

    const delta = now - this.lastFrameTime;
    this.lastFrameTime = now;
    this.accumulator += delta;

    // Fixed timestep with spiral-of-death protection
    let ticksThisFrame = 0;
    while (
      this.accumulator >= this.tickRateMs &&
      ticksThisFrame < this.MAX_TICKS_PER_FRAME
    ) {
      this.tickCount++;
      this.accumulator -= this.tickRateMs;
      ticksThisFrame++;
    }

    // Clamp accumulator if we hit the cap (drop excess time)
    if (this.accumulator > this.tickRateMs) {
      this.accumulator = this.tickRateMs;
    }

    // Notify tick changes
    if (ticksThisFrame > 0) {
      this.callbacks.onTick?.(this.tickCount);
    }

    // Notify every frame with interpolation data
    const alpha = this.accumulator / this.tickRateMs;
    this.callbacks.onFrame?.(this.tickCount, alpha, delta);

    this.rafId = requestAnimationFrame(this.frame);
  };
}
