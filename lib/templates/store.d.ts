/**
 * Host-side JSON file storage for prompt templates.
 *
 * Location: `~/.dsh/better-input/templates.json`. The plugin ships as a flat
 * bundle under node_modules, so anything stored next to the package would be
 * wiped on update — the only durable, dependency-free location is the user's
 * home directory (Node builtins only).
 *
 * Writes are serialized through a promise chain and performed atomically
 * (temp file + rename). A corrupt file is quarantined aside once with a
 * warning instead of failing every subsequent call.
 */
import { type BetterInputTemplate, type TemplateInput } from './model.js';
export declare function defaultTemplatesFilePath(): string;
export declare class TemplateStore {
    private readonly filePath;
    private cache;
    private persistChain;
    constructor(filePath?: string);
    list(): Promise<readonly BetterInputTemplate[]>;
    save(input: TemplateInput): Promise<BetterInputTemplate>;
    remove(id: string): Promise<boolean>;
    private load;
    private quarantineCorruptFile;
    private persist;
    private writeAtomic;
}
