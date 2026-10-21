import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import ts from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
	{ ignores: ['dist/**', '.astro/**', 'test-results/**', 'playwright-report/**'] },
	js.configs.recommended,
	...ts.configs.recommended,
	...astro.configs.recommended,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
	},
);
