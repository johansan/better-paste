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
        format: (pattern: string): string =>
            pattern.replace(/\[([^\]]*)\]|YYYY|MM|DD|HH|mm|ss/g, token => {
                const literal = /^\[([^\]]*)\]$/.exec(token);
                return literal ? literal[1] : (values[token] ?? token);
            })
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
}

export class Plugin {}

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
 * Parses the "key: value" subset of YAML that frontmatter properties use. The real parser
 * is Obsidian's; the plugin's own frontmatter logic is tested directly against plain
 * objects, so this only needs to cover the shapes the integration tests paste in.
 */
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
