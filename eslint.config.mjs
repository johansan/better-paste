import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'main.js', 'coverage/**', '.obsidian/**'],
        linterOptions: {
            reportUnusedDisableDirectives: 'error'
        }
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    ...obsidianmd.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser
            },
            parserOptions: {
                project: './tsconfig.eslint.json'
            }
        },
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'separate-type-imports' }],
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            // The rule cannot tell proper nouns from sentence text, and flags the plugin's own
            // name plus Obsidian's "Files and links" tab. Setting names here are already
            // sentence case; enforcing this automatically produces only false positives.
            'obsidianmd/ui/sentence-case': 'off'
        }
    },
    {
        files: ['tests/**/*.ts'],
        languageOptions: {
            globals: {
                ...globals.node
            },
            parserOptions: {
                project: './tsconfig.eslint.json'
            }
        },
        rules: {
            'import/no-nodejs-modules': 'off',
            'obsidianmd/no-nodejs-modules': 'off',
            // Tests run in Node, where there is no window object to take timers from.
            'obsidianmd/prefer-window-timers': 'off',
            'obsidianmd/no-global-this': 'off',
            'no-restricted-properties': [
                'error',
                { object: 'describe', property: 'only', message: 'Do not commit describe.only()' },
                { object: 'it', property: 'only', message: 'Do not commit it.only()' },
                { object: 'test', property: 'only', message: 'Do not commit test.only()' }
            ]
        }
    },
    {
        files: ['*.mjs'],
        languageOptions: {
            globals: {
                ...globals.node
            }
        }
    }
);
