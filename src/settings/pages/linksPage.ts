/*
 * Better Paste - Plugin for Obsidian
 * Copyright (c) 2026 Johan Sanneblad
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { LINK_REMOVALS_UPDATED, SHIPPED_PARAM_REMOVALS, TRACKING_PARAMS } from '../constants';
import { DEFAULT_SETTINGS } from '../defaults';
import { findInvalidRemovalRules } from '../normalize';
import { buildUrlCleanupOptions, cleanUrl } from '../../transforms/urlCleanup';
import { aliases, format, localeTag, plural, strings } from '../../i18n';
import { BUILT_IN_LINK_REMOVALS_URL } from '../../urls';
import { LIST_KEY_SUFFIX, SETTINGS_CLASS } from './context';
import type { SettingsPageContext } from './context';

/** The two halves of the example address, which read the same in every language. */
const CLEANING_EXAMPLE_KEPT = 'https://example.com/article';
const CLEANING_EXAMPLE_REMOVED = '?utm_source=newsletter&fbclid=9c2a41';

/**
 * Shows the rule by example, with the part that gets removed struck through.
 *
 * Built with plain DOM calls and guarded, because the settings definitions are also read
 * outside a browser by the tests.
 */
function cleaningExample(): string | DocumentFragment {
    const lead = strings.settings.links.cleaningDesc;

    if (typeof createFragment === 'undefined') {
        return format(strings.settings.plainFallback, {
            description: lead,
            example: `${CLEANING_EXAMPLE_KEPT}${CLEANING_EXAMPLE_REMOVED}`
        });
    }

    return createFragment(fragment => {
        fragment.appendText(lead);
        const example = fragment.createDiv({ cls: 'better-paste-example' });
        example.createSpan({ text: CLEANING_EXAMPLE_KEPT });
        example.createSpan({ cls: 'better-paste-example-removed', text: CLEANING_EXAMPLE_REMOVED });
    });
}

/** Renders a translated description whose blank line separates two paragraphs. */
function paragraphDescription(text: string): string | DocumentFragment {
    if (typeof createFragment === 'undefined') return text;

    return createFragment(fragment => {
        text.split('\n\n').forEach((paragraph, index) => {
            if (index > 0) {
                fragment.createEl('br');
                fragment.createEl('br');
            }
            fragment.appendText(paragraph);
        });
    });
}

/** Sample URL shown in the tester before the user types their own. */
const URL_SAMPLE = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=news&_bhlid=abc123';

/** Placeholder for the removal list, which is a rule rather than a sentence. */
const REMOVAL_PLACEHOLDER = 'fbclid\nexample.com | source, ref';

/** Contribution page. The rule text stays in the fragment until the user submits the form. */
const CONTRIBUTION_URL = 'https://betterpaste.md/contribute/';

/** Website locale folders corresponding to the plugin's BCP 47 locale tags. */
const CONTRIBUTION_LOCALES = new Set([
    'ar',
    'de',
    'es',
    'fa',
    'fr',
    'id',
    'it',
    'ja',
    'ko',
    'nl',
    'pl',
    'pt',
    'pt-br',
    'ru',
    'th',
    'tr',
    'uk',
    'vi',
    'zh-cn',
    'zh-tw'
]);

/** How many invalid rules the validation message names before it stops listing them. */
const INVALID_RULES_SHOWN = 3;

/** Shows the catalog date in the same language as the settings around it. */
function formatRemovalDate(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;
    return parsed.toLocaleDateString(localeTag, { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Builds the private browser handoff. The removal text is kept in the fragment. */
export function linkRemovalContributionUrl(removals: readonly string[], version: string, language = localeTag): string {
    const normalized = language.toLowerCase();
    const websiteLocale = normalized === 'pt-pt' ? 'pt' : normalized;
    const localizedBase = CONTRIBUTION_LOCALES.has(websiteLocale)
        ? CONTRIBUTION_URL.replace('/contribute/', `/${websiteLocale}/contribute/`)
        : CONTRIBUTION_URL;
    const suggested = removals.filter(line => !line.trim().startsWith('!'));
    const fragment = new URLSearchParams({ rules: suggested.join('\n'), version });
    return `${localizedBase}#${fragment.toString()}`;
}

/** Rows shown directly under the Links heading on the landing page. */
export function createLinkLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().linkEnabled;

    const text = strings.settings.links;

    return [
        {
            name: text.titlesName,
            desc: text.titlesDesc,
            aliases: aliases(source => source.settings.links.titlesAliases),
            control: { type: 'toggle', key: 'linkTitles', defaultValue: DEFAULT_SETTINGS.linkTitles }
        },
        {
            name: text.cleaningName,
            desc: cleaningExample(),
            aliases: aliases(source => source.settings.links.cleaningAliases),
            control: { type: 'toggle', key: 'linkEnabled', defaultValue: DEFAULT_SETTINGS.linkEnabled }
        },
        {
            type: 'page',
            name: text.removalsName,
            desc: text.removalsDesc,
            visible: enabled,
            displayValue: () =>
                plural(
                    text.rulesCount,
                    context.settings().linkRemovals.filter(line => line.trim().length > 0 && !line.trim().startsWith('#')).length
                ),
            // A removal that will not parse is only reported on the page that holds it, so the
            // link has to carry the warning back to the landing page
            status: () => (findInvalidRemovalRules(context.settings().linkRemovals.join('\n')).length > 0 ? 'warning' : null),
            items: createRemovalsPageDefinitions(context)
        }
    ];
}

/** Built-in and user-defined removals, plus a tester and contribution handoff. */
function createRemovalsPageDefinitions(context: SettingsPageContext): SettingDefinitionItem[] {
    // Wrapped in a group so styles.css can reach the textarea: only a group carries a class
    return [
        {
            type: 'group',
            cls: SETTINGS_CLASS,
            items: [
                {
                    name: strings.settings.links.builtInName,
                    desc: format(strings.settings.links.builtInDesc, {
                        date: formatRemovalDate(LINK_REMOVALS_UPDATED),
                        trackingCount: TRACKING_PARAMS.length,
                        siteCount: SHIPPED_PARAM_REMOVALS.length
                    }),
                    render: setting => {
                        setting.addButton(button =>
                            button.setButtonText(strings.settings.links.builtInButton).onClick(() => {
                                window.open(BUILT_IN_LINK_REMOVALS_URL);
                            })
                        );
                    }
                },
                {
                    name: strings.settings.links.listName,
                    desc: paragraphDescription(strings.settings.links.listDesc),
                    aliases: aliases(source => source.settings.links.listAliases),
                    control: {
                        type: 'textarea',
                        key: `linkRemovals${LIST_KEY_SUFFIX}`,
                        rows: 6,
                        placeholder: REMOVAL_PLACEHOLDER,
                        defaultValue: '',
                        validate: value => {
                            const invalid = findInvalidRemovalRules(typeof value === 'string' ? value : '');
                            if (invalid.length === 0) return;
                            return format(strings.settings.links.listInvalid, {
                                values: invalid.slice(0, INVALID_RULES_SHOWN).join(', ')
                            });
                        }
                    }
                },
                {
                    name: strings.settings.links.suggestName,
                    desc: strings.settings.links.suggestDesc,
                    aliases: aliases(source => source.settings.links.suggestAliases),
                    render: setting => {
                        setting.addButton(button =>
                            button.setButtonText(strings.settings.links.suggestButton).onClick(() => {
                                window.open(linkRemovalContributionUrl(context.settings().linkRemovals, context.version));
                            })
                        );
                    }
                },
                {
                    name: strings.settings.links.testerName,
                    desc: strings.settings.links.testerDesc,
                    searchable: false,
                    render: setting => renderUrlTester(setting, context)
                }
            ]
        }
    ];
}

/** Live preview so a rule can be checked without leaving settings. */
function renderUrlTester(setting: Setting, context: SettingsPageContext): void {
    // Marks the row so styles.css can lay the preview out below the label, which
    // avoids needing :has() on the parent
    setting.settingEl.addClass('better-paste-tester');
    const container = setting.settingEl.createDiv({ cls: 'better-paste-preview' });
    const input = container.createEl('input', {
        type: 'text',
        attr: { placeholder: URL_SAMPLE, 'aria-label': strings.settings.links.testerLabel }
    });
    const output = container.createDiv({ cls: 'better-paste-preview-output' });
    output.setAttrs({ role: 'status', 'aria-live': 'polite' });

    const render = (): void => {
        const source = input.value.trim();
        if (!source) {
            output.setText(strings.settings.links.testerEmpty);
            output.addClass('better-paste-preview-empty');
            return;
        }
        output.removeClass('better-paste-preview-empty');
        output.setText(cleanUrl(source, buildUrlCleanupOptions(context.settings())));
    };

    input.addEventListener('input', render);
    render();
}
