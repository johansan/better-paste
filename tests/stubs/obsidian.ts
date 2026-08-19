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

// Minimal Obsidian stubs so modules that import the API can be loaded under Vitest.
// Only the members the tested code paths touch at import time are provided; anything
// that performs real Obsidian work throws so a test can never silently depend on it.

/**
 * Obsidian's interface language. Tests run against English, which is also what the real
 * call returns when the user has not chosen another language.
 */
export function getLanguage(): string {
    return 'en';
}

/** Moment subset used by filename tests. */
export function moment(date: Date): { format: (pattern: string) => string } {
    const pad = (value: number): string => String(value).padStart(2, '0');
    const values: Record<string, string> = {
        YYYY: String(date.getFullYear()),
        MM: pad(date.getMonth() + 1),
        DD: pad(date.getDate()),
        HH: pad(date.getHours()),
        mm: pad(date.getMinutes()),
        ss: pad(date.getSeconds())
    };

    return {
        format: (pattern: string): string => {
            // Real Moment answers an empty pattern with its default ISO output
            if (!pattern) return `${values.YYYY}-${values.MM}-${values.DD}T${values.HH}:${values.mm}:${values.ss}+00:00`;
            return pattern.replace(/\[([^\]]*)\]|YYYY|MM|DD|HH|mm|ss/g, token => {
                const literal = /^\[([^\]]*)\]$/.exec(token);
                return literal ? literal[1] : (values[token] ?? token);
            });
        }
    };
}

export class Notice {
    static readonly instances: Notice[] = [];
    hidden = false;

    constructor(
        public message: string,
        public duration?: number
    ) {
        Notice.instances.push(this);
    }

    setMessage(message: string): this {
        this.message = message;
        return this;
    }

    hide(): void {
        this.hidden = true;
    }
}

export class TFolder {
    path = '';
}

export class TFile {
    path = '';
    basename = '';
    extension = '';
}

export class Plugin {}

export class Modal {
    constructor(public app: unknown) {}

    open(): void {}

    close(): void {}
}

interface StubPlugin {
    settings: Record<string, unknown>;
    saveSettings?: () => Promise<void>;
}

/**
 * Models the documented behaviour of the real class: it keeps the plugin it was constructed
 * with, and its default control accessors read and write `plugin.settings`.
 */
export class PluginSettingTab {
    app: unknown;
    plugin: StubPlugin;
    /** Records refreshDomState calls so tests can assert dependent settings are re-evaluated. */
    refreshCount = 0;
    updateCount = 0;

    constructor(app: unknown, plugin: StubPlugin) {
        this.app = app;
        this.plugin = plugin;
    }

    getControlValue(key: string): unknown {
        return this.plugin.settings[key];
    }

    async setControlValue(key: string, value: unknown): Promise<void> {
        this.plugin.settings[key] = value;
        await this.plugin.saveSettings?.();
    }

    update(): void {
        this.updateCount += 1;
    }

    refreshDomState(): void {
        this.refreshCount += 1;
    }
}

export class Setting {}

export function normalizePath(path: string): string {
    return (
        path
            .replace(/\\/g, '/')
            .replace(/\/{2,}/g, '/')
            .replace(/^\/|\/$/g, '') || '/'
    );
}

export function requestUrl(): never {
    throw new Error('requestUrl is not available in tests');
}

/**
 * The settings page registers its plugin icons when it is imported, so this has to succeed.
 * Obsidian keeps the drawing for later; nothing under test reads it back.
 */
export function addIcon(): void {}

/** Icons come from Obsidian's own set, so drawing one only happens in the running app. */
export function setIcon(): never {
    throw new Error('setIcon is not available in tests');
}

/**
 * Parses the "key: value" subset of YAML that frontmatter properties use. The real parser
 * is Obsidian's; the plugin's own frontmatter logic is tested directly against plain
 * objects, so this only needs to cover the shapes the integration tests paste in.
 */
export interface FrontMatterInfo {
    exists: boolean;
    frontmatter: string;
    from: number;
    to: number;
    contentStart: number;
}

/**
 * Test stand-in for Obsidian's getFrontMatterInfo, matching the real app's behavior: the
 * block must open with --- on the very first line, closes only with --- (never YAML's
 * ...), and CRLF is accepted.
 */
export function getFrontMatterInfo(content: string): FrontMatterInfo {
    const none = { exists: false, frontmatter: '', from: 0, to: 0, contentStart: 0 };
    const opening = /^---\r?\n/.exec(content);
    if (!opening) return none;

    const from = opening[0].length;
    const lines = content.split('\n');
    let offset = lines[0].length + 1;
    for (let index = 1; index < lines.length; index++) {
        const line = lines[index];
        if (/^---\r?$/.test(line)) {
            const to = Math.max(from, offset - 1);
            const contentStart = Math.min(content.length, offset + line.length + 1);
            return { exists: true, frontmatter: content.slice(from, to), from, to, contentStart };
        }
        offset += line.length + 1;
    }
    return none;
}

export function parseYaml(yaml: string): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const line of yaml.split('\n')) {
        const match = /^([^:#]+):\s*(.*)$/.exec(line.trim());
        if (!match) continue;

        const raw = match[2].trim().replace(/^["']|["']$/g, '');
        result[match[1].trim()] = /^-?\d+(?:\.\d+)?$/.test(raw) ? Number(raw) : raw;
    }

    return result;
}
