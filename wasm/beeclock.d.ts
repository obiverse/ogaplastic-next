/* tslint:disable */
/* eslint-disable */

export class WasmClock {
    free(): void;
    [Symbol.dispose](): void;
    constructor();
    partition_moduli_raw(out: Uint32Array): void;
    raw_pulse_words(): number;
    raw_snapshot_len(): number;
    snapshot(): any;
    snapshot_raw(out: Uint32Array): void;
    tick(): any;
    tick_raw(snapshot_out: Uint32Array, pulse_bits_out: Uint32Array): void;
}

export class WasmClockBuilder {
    free(): void;
    [Symbol.dispose](): void;
    build(): WasmClock;
    constructor();
    partition(name: string, modulus: bigint): void;
    pulse_condition(name: string, condition: any): void;
    pulse_every(name: string, period: bigint): void;
    set_partition_order(order: string): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_wasmclock_free: (a: number, b: number) => void;
    readonly wasmclock_new: () => [number, number, number];
    readonly wasmclock_tick: (a: number) => any;
    readonly wasmclock_snapshot: (a: number) => any;
    readonly wasmclock_raw_snapshot_len: (a: number) => number;
    readonly wasmclock_raw_pulse_words: (a: number) => number;
    readonly wasmclock_snapshot_raw: (a: number, b: any) => [number, number];
    readonly wasmclock_tick_raw: (a: number, b: any, c: any) => [number, number];
    readonly wasmclock_partition_moduli_raw: (a: number, b: any) => [number, number];
    readonly __wbg_wasmclockbuilder_free: (a: number, b: number) => void;
    readonly wasmclockbuilder_new: () => number;
    readonly wasmclockbuilder_set_partition_order: (a: number, b: number, c: number) => [number, number];
    readonly wasmclockbuilder_partition: (a: number, b: number, c: number, d: bigint) => void;
    readonly wasmclockbuilder_pulse_every: (a: number, b: number, c: number, d: bigint) => void;
    readonly wasmclockbuilder_pulse_condition: (a: number, b: number, c: number, d: any) => [number, number];
    readonly wasmclockbuilder_build: (a: number) => [number, number, number];
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
