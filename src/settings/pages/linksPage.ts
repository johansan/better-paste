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
import { DEFAULT_SETTINGS } from '../defaults';
import { SHIPPED_DOMAIN_RULES } from '../constants';
import { findInvalidDomainRules } from '../normalize';
import { buildUrlCleanupOptions, cleanUrl, mergeDomainRules } from '../../transforms/urlCleanup';
import { aliases, format, plural, strings } from '../../i18n';
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

/** Sample URL shown in the tester before the user types their own. */
const URL_SAMPLE = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=news&_bhlid=abc123';

/** Placeholder for the rule list, which is a rule rather than a sentence. */
const RULE_PLACEHOLDER = 'example.com: id, page';

/** How many invalid rules the validation message names before it stops listing them. */
const INVALID_RULES_SHOWN = 3;

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
            name: text.stripName,
            desc: text.stripDesc,
            visible: enabled,
            aliases: aliases(source => source.settings.links.stripAliases),
            control: {
                type: 'dropdown',
                key: 'linkStrip',
                defaultValue: DEFAULT_SETTINGS.linkStrip,
                options: {
                    all: text.stripAll,
                    tracking: text.stripTracking
                }
            }
        },
        {
            type: 'page',
            name: text.rulesName,
            desc: text.rulesDesc,
            visible: enabled,
            displayValue: () => plural(text.rulesCount, mergeDomainRules(context.settings().linkRules).length),
            // A rule that will not parse is only reported on the page that holds it, so the
            // link has to carry the warning back to the landing page
            status: () => (findInvalidDomainRules(context.settings().linkRules.join('\n')).length > 0 ? 'warning' : null),
            items: createSitesPageDefinitions(context)
        }
    ];
}

/** The Sites to leave alone sub-page: the rule list, plus a tester to check a rule works. */
function createSitesPageDefinitions(context: SettingsPageContext): SettingDefinitionItem[] {
    // Wrapped in a group so styles.css can reach the textarea: only a group carries a class
    return [
        {
            type: 'group',
            cls: SETTINGS_CLASS,
            items: [
                {
                    name: strings.settings.links.listName,
                    desc: format(strings.settings.links.listDesc, {
                        sites: plural(strings.settings.links.listShippedCount, SHIPPED_DOMAIN_RULES.length)
                    }),
                    aliases: aliases(source => source.settings.links.listAliases),
                    control: {
                        type: 'textarea',
                        key: `linkRules${LIST_KEY_SUFFIX}`,
                        rows: 6,
                        placeholder: RULE_PLACEHOLDER,
                        defaultValue: '',
                        validate: value => {
                            const invalid = findInvalidDomainRules(typeof value === 'string' ? value : '');
                            if (invalid.length === 0) return;
                            return format(strings.settings.links.listInvalid, {
                                values: invalid.slice(0, INVALID_RULES_SHOWN).join(', ')
                            });
                        }
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
