import { test as base, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const dist = resolve('dist');
/** @type {Record<string, string>} */
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

export const test = base.extend({
	page: async ({ page }, use) => {
		if (process.env.PLAYWRIGHT_OFFLINE === '1') {
			await page.route('http://127.0.0.1:4173/**', async (route) => {
				const pathname = decodeURIComponent(new URL(route.request().url()).pathname);
				const file = resolve(dist, '.' + pathname + (pathname.endsWith('/') ? 'index.html' : ''));
				if (!file.startsWith(dist + sep)) return route.fulfill({ status: 403 });
				try {
					await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] ?? 'application/octet-stream' });
				} catch {
					await route.fulfill({ status: 404, body: 'Asset not found in the build' });
				}
			});
			await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
			await page.route('https://fonts.gstatic.com/**', (route) => route.abort());
		}
		await use(page);
	},
});

export { expect };
