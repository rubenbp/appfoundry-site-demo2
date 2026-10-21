import { execFileSync } from 'node:child_process';
import { expect, test } from './fixtures.mjs';

test('el build servido identifica el commit y los cambios locales', async ({ page }) => {
	const response = await page.goto('/version.json');
	expect(response?.status()).toBe(200);
	expect(await response?.json()).toEqual({
		sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
		dirty: execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim().length > 0,
	});
});
