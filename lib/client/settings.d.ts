import type { SettingsController } from './settings-controller.js';
export type SettingsSectionProps = {
    readonly close: () => void;
    readonly settingsController: SettingsController;
};
/**
 * The BetterInput settings page. Renders the recognition and polishing
 * configuration; every field edits a local draft and saves on blur/change.
 */
export declare function BetterInputSettingsSection({ close, settingsController }: SettingsSectionProps): import("react").JSX.Element;
