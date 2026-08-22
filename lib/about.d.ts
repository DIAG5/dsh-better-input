/**
 * Plugin identity and update-check helpers. The Host reads the installed
 * package.json and queries the npm registry for the latest released version.
 * The browser never talks to the npm registry directly — the Host owns the
 * check and merely reports back a status plus the command the user runs to
 * update (DSH has no programmatic self-update API).
 *
 * Pattern follows the official `dsh-ears` plugin.
 */
export declare const PLUGIN_LICENSE = "MIT";
export declare const PLUGIN_REPOSITORY_URL = "https://github.com/DIAG5/dsh-better-input";
export declare const PLUGIN_REPOSITORY_SLUG = "@DIAG5/dsh-better-input";
export declare const PLUGIN_PACKAGE_NAME = "dsh-better-input";
/** Global-CLI form (works when `dsh` is installed globally). */
export declare const UPDATE_COMMAND = "dsh plugin --profile web update dsh-better-input";
/** npx form (works without a global `dsh` CLI; DSH is pulled on demand). */
export declare const UPDATE_COMMAND_NPX = "npx -y @deepseek-ai/dsh plugin --profile web update dsh-better-input";
export declare const NPM_LATEST_URL = "https://registry.npmjs.org/dsh-better-input/latest";
export type AboutInfo = {
    readonly repository: string;
    readonly repositorySlug: string;
    readonly version: string;
    readonly license: string;
    readonly updateCommand: string;
    readonly updateCommandNpx: string;
};
export type UpdateCheckStatus = 'up-to-date' | 'update-available' | 'unpublished' | 'error';
export type UpdateCheckResult = {
    readonly status: UpdateCheckStatus;
    readonly installed: string;
    readonly latest: string | null;
    readonly updateCommand: string;
    readonly updateCommandNpx: string;
};
export declare function readInstalledAboutInfo(packageJsonPath?: string): AboutInfo;
export declare function repositoryUrlFromPackage(value: unknown): string;
export declare function repositorySlugFromUrl(url: string): string;
export declare function resolvePackageJsonPath(): string;
/** Compare dotted numeric cores only. `1.2` equals `1.2.0`. Null if either is not a version. */
export declare function compareReleaseVersions(left: string, right: string): number | null;
export declare function interpretUpdateCheck(installed: string, latest: string): Exclude<UpdateCheckStatus, 'unpublished' | 'error'> | null;
export declare function fetchLatestPublishedVersion(options?: {
    readonly fetchImpl?: typeof fetch;
    readonly signal?: AbortSignal;
}): Promise<{
    status: 'ok';
    version: string;
} | {
    status: 'unpublished';
} | {
    status: 'error';
    message: string;
}>;
export declare function checkForPluginUpdate(options?: {
    readonly installed: string;
    readonly fetchImpl?: typeof fetch;
    readonly signal?: AbortSignal;
}): Promise<UpdateCheckResult>;
