/**
 * Settings section for the prompt template library: list saved templates,
 * create/edit through an inline form, and delete with a two-step confirm.
 * Mirrors the settings section conventions (framework-injected `t` + local
 * frame/field components + dsw CSS variables).
 */
import type { TranslateNS } from '@deepseek-ai/dsh-client-ui-slots';
import type { TemplatesController } from './templates-controller.js';
/** The framework-injected `t` seat for the BetterInput namespace. */
type Translate = TranslateNS<'better-input'>;
export type TemplatesSectionProps = {
    readonly close: () => void;
    readonly t: Translate;
    readonly templatesController: TemplatesController;
};
export declare function TemplatesSection({ t, templatesController }: TemplatesSectionProps): import("react").JSX.Element;
export {};
