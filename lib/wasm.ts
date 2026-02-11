/**
 * WASM loader — singleton async init for BeeClock WASM module.
 *
 * SSR-safe: guards against server-side execution.
 * Graceful fallback: if WASM fails, engine uses JS-only timing.
 *
 * Uses dynamic import() with a string variable to bypass TypeScript
 * module resolution (the JS glue file is in public/wasm/).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

let wasmReady = false;
let wasmPromise: Promise<void> | null = null;
let WasmClockBuilderCtor: any = null;

/** Initialize the WASM module. Idempotent and SSR-safe. */
export async function initWasm(): Promise<void> {
  if (typeof window === "undefined") return; // SSR guard
  if (wasmReady) return;
  if (wasmPromise) return wasmPromise;

  wasmPromise = (async () => {
    try {
      // Use a variable to prevent TS from resolving the module at compile time
      const jsPath = "/wasm/beeclock.js";
      const wasmModule = await (Function("p", "return import(p)")(
        jsPath
      ) as Promise<any>);
      // Initialize WASM — pass explicit path to .wasm binary
      await wasmModule.default("/wasm/beeclock_bg.wasm");
      WasmClockBuilderCtor = wasmModule.WasmClockBuilder;
      wasmReady = true;
    } catch (error) {
      console.warn(
        "WASM load failed, animations will use JS-only timing:",
        error
      );
      wasmPromise = null; // Allow retry
    }
  })();

  return wasmPromise;
}

/** Check if WASM module is loaded and ready */
export function isWasmReady(): boolean {
  return wasmReady;
}

/**
 * Create a WASM clock configured for animation timing.
 * Partitions cycle at useful animation intervals:
 * - beat: 60 beats per cycle (1 per tick at 1Hz)
 * - phrase: 8 phrases (color shifts every 8 beats)
 * - cycle: 4 cycles (longer pattern changes)
 *
 * Returns null if WASM is not loaded.
 */
export function createAnimationClock(): any | null {
  if (!wasmReady || !WasmClockBuilderCtor) return null;

  try {
    const builder = new WasmClockBuilderCtor();
    builder.set_partition_order("lsf");
    builder.partition("beat", BigInt(60));
    builder.partition("phrase", BigInt(8));
    builder.partition("cycle", BigInt(4));
    return builder.build();
  } catch (error) {
    console.warn("Failed to create animation clock:", error);
    return null;
  }
}
