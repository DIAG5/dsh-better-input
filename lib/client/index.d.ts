import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
/** Required Client services: the slot registry, the Typert remote hub, and the
 * DSH locale runtime (so `t` seats resolve and our dictionary registers).
 * `remote.betterInput` is mounted by this plugin's own apply() via
 * `ctx.remote.$mount`, so it MUST NOT appear here — the outer inject gates
 * plugin activation and would deadlock waiting for itself. It is declared
 * only on the inner ctx.inject() below, which runs after the mount.
 * Settings reach the browser through `SettingsScopeBinder` (provided by
 * `@deepseek-ai/dsh-client-ui-settings`) and are read inside the settings
 * section slot itself, not via a top-level `settings` service here. */
export declare const inject: string[];
export declare function apply(ctx: ClientContext): Promise<() => Promise<void>>;
