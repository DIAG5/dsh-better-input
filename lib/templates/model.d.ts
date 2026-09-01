/**
 * Prompt template data model shared by the host store and the Typert layer.
 * A template is a plain text snippet the user stores once and later inserts
 * from the input box via the `/` trigger source.
 */
export type BetterInputTemplate = {
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly content: string;
    readonly tags: readonly string[];
    readonly createdAt: number;
    readonly updatedAt: number;
};
export type TemplateInput = {
    readonly id?: string;
    readonly name: string;
    readonly description?: string;
    readonly content: string;
    readonly tags?: readonly string[];
};
export declare const MAX_TEMPLATE_COUNT = 200;
export declare const MAX_TEMPLATE_NAME_LENGTH = 60;
export declare const MAX_TEMPLATE_DESCRIPTION_LENGTH = 200;
export declare const MAX_TEMPLATE_CONTENT_LENGTH = 8000;
export declare const MAX_TEMPLATE_TAGS = 8;
export declare const MAX_TEMPLATE_TAG_LENGTH = 20;
/** Trim, drop empties, dedupe case-insensitively, cap count and length. */
export declare function normalizeTags(tags: readonly string[]): string[];
export declare function validateTemplateInput(input: TemplateInput): void;
