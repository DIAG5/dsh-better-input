/**
 * Plugin identity and update-check helpers. The Host reads the installed
 * package.json and queries the npm registry for the latest released version.
 * The browser never talks to the npm registry directly — the Host owns the
 * check and merely reports back a status plus the command the user runs to
 * update (DSH has no programmatic self-update API).
 *
 * Pattern follows the official `dsh-ears` plugin.
 */

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PLUGIN_LICENSE = 'MIT'
export const PLUGIN_REPOSITORY_URL = 'https://github.com/DIAG5/dsh-better-input'
export const PLUGIN_REPOSITORY_SLUG = '@DIAG5/dsh-better-input'
export const PLUGIN_PACKAGE_NAME = 'dsh-better-input'
/** Global-CLI form (works when `dsh` is installed globally). */
export const UPDATE_COMMAND = `dsh plugin --profile web update ${PLUGIN_PACKAGE_NAME}`
/** npx form (works without a global `dsh` CLI; DSH is pulled on demand). */
export const UPDATE_COMMAND_NPX = `npx -y @deepseek-ai/dsh plugin --profile web update ${PLUGIN_PACKAGE_NAME}`
export const NPM_LATEST_URL = `https://registry.npmjs.org/${PLUGIN_PACKAGE_NAME}/latest`

const CHECK_TIMEOUT_MS = 15_000
const MAX_REGISTRY_BYTES = 256 * 1024

export type AboutInfo = {
  readonly repository: string
  readonly repositorySlug: string
  readonly version: string
  readonly license: string
  readonly updateCommand: string
  readonly updateCommandNpx: string
}

export type UpdateCheckStatus = 'up-to-date' | 'update-available' | 'unpublished' | 'error'

export type UpdateCheckResult = {
  readonly status: UpdateCheckStatus
  readonly installed: string
  readonly latest: string | null
  readonly updateCommand: string
  readonly updateCommandNpx: string
}

export function readInstalledAboutInfo(packageJsonPath = resolvePackageJsonPath()): AboutInfo {
  const raw = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    version?: unknown
    license?: unknown
    repository?: unknown
  }
  const version = typeof raw.version === 'string' && raw.version.trim() !== '' ? raw.version.trim() : '0.0.0'
  const license = typeof raw.license === 'string' && raw.license.trim() !== '' ? raw.license.trim() : PLUGIN_LICENSE
  const repository = repositoryUrlFromPackage(raw.repository)
  return {
    repository,
    repositorySlug: repositorySlugFromUrl(repository),
    version,
    license,
    updateCommand: UPDATE_COMMAND,
    updateCommandNpx: UPDATE_COMMAND_NPX
  }
}

export function repositoryUrlFromPackage(value: unknown): string {
  const raw = typeof value === 'string'
    ? value
    : value !== null && typeof value === 'object' && 'url' in value && typeof value.url === 'string'
      ? value.url
      : ''
  const url = raw.trim().replace(/^git\+/, '').replace(/\.git$/, '')
  return url !== '' ? url : PLUGIN_REPOSITORY_URL
}

export function repositorySlugFromUrl(url: string): string {
  const match = /github\.com\/([^/]+\/[^/]+)/i.exec(url)
  return match === null ? PLUGIN_REPOSITORY_SLUG : `@${(match[1] ?? '').replace(/\.git$/, '')}`
}

export function resolvePackageJsonPath(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json')
}

/** Compare dotted numeric cores only. `1.2` equals `1.2.0`. Null if either is not a version. */
export function compareReleaseVersions(left: string, right: string): number | null {
  const a = parseReleaseVersion(left)
  const b = parseReleaseVersion(right)
  if (a === null || b === null) return null
  const length = Math.max(a.length, b.length)
  for (let index = 0; index < length; index += 1) {
    const delta = (a[index] ?? 0) - (b[index] ?? 0)
    if (delta > 0) return 1
    if (delta < 0) return -1
  }
  return 0
}

export function interpretUpdateCheck(installed: string, latest: string): Exclude<UpdateCheckStatus, 'unpublished' | 'error'> | null {
  const order = compareReleaseVersions(latest, installed)
  if (order === null) return null
  return order > 0 ? 'update-available' : 'up-to-date'
}

export async function fetchLatestPublishedVersion(options: {
  readonly fetchImpl?: typeof fetch
  readonly signal?: AbortSignal
} = {}): Promise<{ status: 'ok'; version: string } | { status: 'unpublished' } | { status: 'error'; message: string }> {
  const fetchImpl = options.fetchImpl ?? fetch
  const timeout = new AbortController()
  const timer = setTimeout(() => timeout.abort(new Error('Update check timed out')), CHECK_TIMEOUT_MS)
  const forwardAbort = () => timeout.abort(options.signal?.reason)
  options.signal?.addEventListener('abort', forwardAbort, { once: true })
  try {
    const response = await fetchImpl(NPM_LATEST_URL, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: timeout.signal
    })
    if (response.status === 404) return { status: 'unpublished' }
    const body = await readBoundedText(response)
    if (!response.ok) return { status: 'error', message: `npm registry returned HTTP ${response.status}` }
    let parsed: unknown
    try {
      parsed = JSON.parse(body)
    } catch {
      return { status: 'error', message: 'npm registry returned invalid JSON' }
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { status: 'error', message: 'npm registry returned no version' }
    }
    const version = (parsed as { version?: unknown }).version
    if (typeof version !== 'string' || version.trim() === '') return { status: 'error', message: 'npm registry returned no version' }
    return { status: 'ok', version: version.trim() }
  } catch (error) {
    if (options.signal?.aborted) throw error
    const message = error instanceof Error && error.message.trim() !== '' ? error.message : 'Update check failed'
    return { status: 'error', message }
  } finally {
    clearTimeout(timer)
    options.signal?.removeEventListener('abort', forwardAbort)
  }
}

export async function checkForPluginUpdate(options: {
  readonly installed: string
  readonly fetchImpl?: typeof fetch
  readonly signal?: AbortSignal
} = { installed: '' }): Promise<UpdateCheckResult> {
  const installed = options.installed
  const updateCommand = UPDATE_COMMAND
  const updateCommandNpx = UPDATE_COMMAND_NPX
  const latest = await fetchLatestPublishedVersion(options)
  if (latest.status === 'unpublished') return { status: 'unpublished', installed, latest: null, updateCommand, updateCommandNpx }
  if (latest.status === 'error') return { status: 'error', installed, latest: null, updateCommand, updateCommandNpx }
  const status = interpretUpdateCheck(installed, latest.version)
  if (status === null) return { status: 'error', installed, latest: latest.version, updateCommand, updateCommandNpx }
  return { status, installed, latest: latest.version, updateCommand, updateCommandNpx }
}

function parseReleaseVersion(value: string): number[] | null {
  const core = value.trim().split('-')[0]?.split('+')[0] ?? ''
  if (core === '') return null
  const parts = core.split('.')
  if (parts.some((part) => part === '' || !/^\d+$/.test(part))) return null
  return parts.map((part) => Number(part))
}

async function readBoundedText(response: Response): Promise<string> {
  const contentLength = Number(response.headers.get('content-length') ?? '')
  if (Number.isFinite(contentLength) && contentLength > MAX_REGISTRY_BYTES) throw new Error('npm registry response is too large')
  if (response.body === null) {
    const body = await response.text()
    if (new TextEncoder().encode(body).byteLength > MAX_REGISTRY_BYTES) throw new Error('npm registry response is too large')
    return body
  }
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const next = await reader.read()
      if (next.done) break
      total += next.value.byteLength
      if (total > MAX_REGISTRY_BYTES) {
        await reader.cancel()
        throw new Error('npm registry response is too large')
      }
      chunks.push(next.value)
    }
  } finally {
    reader.releaseLock()
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}