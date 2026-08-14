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
import { LIST_KEY_SUFFIX, SETTINGS_CLASS } from './context';
import type { SettingsPageContext } from './context';

/**
 * Shows the rule by example, with the part that gets removed struck through.
 *
 * Built with plain DOM calls and guarded, because the settings definitions are also read
 * outside a browser by the tests.
 */
function cleaningExample(): string | DocumentFragment {
    const lead = 'Removes tracking parameters from pasted links. The struck-through part is removed:';
    const kept = 'https://example.com/article';
    const removed = '?utm_source=newsletter&fbclid=9c2a41';

    if (typeof createFragment === 'undefined') return `${lead} ${kept}${removed}`;

    return createFragment(fragment => {
        fragment.appendText(lead);
        const example = fragment.createDiv({ cls: 'better-paste-example' });
        example.createSpan({ text: kept });
        example.createSpan({ cls: 'better-paste-example-removed', text: removed });
    });
}

/** Sample URL shown in the tester before the user types their own. */
const URL_SAMPLE = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=news&_bhlid=abc123';

/** Rows shown directly under the Links heading on the landing page. */
export function createLinkLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().linkEnabled;

    return [
        {
            name: 'Fetch titles for pasted links',
            desc: 'When the clipboard contains only a non-image web address, fetch its page title and paste a Markdown link. Other selected text becomes the label without making a request. The original address is kept if the title cannot be fetched.',
            aliases: ['title', 'page', 'website', 'markdown link', 'download'],
            control: { type: 'toggle', key: 'linkTitles', defaultValue: DEFAULT_SETTINGS.linkTitles }
        },
        {
            name: 'Clean pasted links',
            desc: cleaningExample(),
            aliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domain', 'youtube', 'exception'],
            control: { type: 'toggle', key: 'linkEnabled', defaultValue: DEFAULT_SETTINGS.linkEnabled }
        },
        {
            name: 'Which parameters to remove',
            desc: 'Choose whether to remove every query parameter or only known tracking parameters. Site rules can preserve parameters in either mode.',
            visible: enabled,
            aliases: ['utm', 'tracking', 'query', 'parameters'],
            control: {
                type: 'dropdown',
                key: 'linkStrip',
                defaultValue: DEFAULT_SETTINGS.linkStrip,
                options: {
                    all: 'Every parameter, except where a site rule keeps it',
                    tracking: 'Only parameters known to be tracking'
                }
            }
        },
        {
            type: 'page',
            name: 'Rules for preserving parameters',
            desc: 'Site rules for keeping specific query parameters in either removal mode.',
            visible: enabled,
            displayValue: () => {
                const count = mergeDomainRules(context.settings().linkRules).length;
                return count === 1 ? '1 site' : `${count} sites`;
            },
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
                    name: 'Your site rules',
                    desc: `${SHIPPED_DOMAIN_RULES.length} common sites are already handled and stay up to date with the plugin. Add your own site rules here, one per line. "example.com" keeps every parameter on that site, "example.com: a, b" keeps only those two, and "!example.com" drops a rule that ships with the plugin. In "Only parameters known to be tracking" mode, a rule only rescues matching tracking parameters because other parameters are already kept. Subdomains are matched automatically.`,
                    aliases: ['domain', 'exception', 'whitelist', 'youtube'],
                    control: {
                        type: 'textarea',
                        key: `linkRules${LIST_KEY_SUFFIX}`,
                        rows: 6,
                        placeholder: 'example.com: id, page',
                        defaultValue: '',
                        validate: value => {
                            const invalid = findInvalidDomainRules(typeof value === 'string' ? value : '');
                            if (invalid.length === 0) return;
                            return `Not a site name: ${invalid.slice(0, 3).join(', ')}`;
                        }
                    }
                },
                {
                    name: 'Try it',
                    desc: 'Paste a link to see what these rules would keep.',
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
        attr: { placeholder: URL_SAMPLE, 'aria-label': 'Link to clean' }
    });
    const output = container.createDiv({ cls: 'better-paste-preview-output' });
    output.setAttrs({ role: 'status', 'aria-live': 'polite' });

    const render = (): void => {
        const source = input.value.trim();
        if (!source) {
            output.setText('The cleaned link appears here.');
            output.addClass('better-paste-preview-empty');
            return;
        }
        output.removeClass('better-paste-preview-empty');
        output.setText(cleanUrl(source, buildUrlCleanupOptions(context.settings())));
    };

    input.addEventListener('input', render);
    render();
}
