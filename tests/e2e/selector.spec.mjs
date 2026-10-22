import { expect, test } from './fixtures.mjs';

test('descubre una partida compatible y abre su ficha', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('link', { name: /¿No sabes a qué jugar/ }).click();
	await expect(page).toHaveURL(/\/elige-tu-partida\/$/);
	await page.getByLabel('¿Cuánto tiempo tienes?').selectOption('15');
	await page.getByLabel('¿Qué nivel te apetece?').selectOption('Suave');
	await page.getByLabel('¿Con quién juegas?').selectOption('acompanado');
	await page.getByRole('button', { name: 'Sugerir una partida' }).click();
	await expect(page.locator('#selector-result')).toContainText('5–15 min');
	await expect(page.locator('#selector-result')).toContainText('1–2 jugadores');
	await page.locator('#selector-result').getByRole('link', { name: 'Ver la ficha' }).click();
	await expect(page).toHaveURL(/\/juegos\/puzzle-bobble\/$/);
});

test('explica cuando no hay coincidencias y permite reajustar la selección', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/elige-tu-partida/');
	await page.getByLabel('¿Cuánto tiempo tienes?').selectOption('15');
	await page.getByLabel('¿Qué nivel te apetece?').selectOption('Exigente');
	await page.getByLabel('¿Con quién juegas?').selectOption('acompanado');
	await page.getByRole('button', { name: 'Sugerir una partida' }).click();
	await expect(page.getByRole('heading', { name: 'No hay partida con esa combinación.' })).toBeVisible();
	await expect(page.locator('#selector-result').getByRole('link', { name: 'Explorar el catálogo' })).toHaveAttribute('href', '/catalogo/');
	await page.getByLabel('¿Qué nivel te apetece?').selectOption('Suave');
	await page.getByRole('button', { name: 'Sugerir una partida' }).click();
	await expect(page.getByRole('heading', { name: 'Puzzle Bobble' })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test('ofrece otra ficha compatible antes de repetir una sugerencia', async ({ page }) => {
	await page.goto('/elige-tu-partida/');
	await page.getByRole('button', { name: 'Sugerir una partida' }).click();
	const first = await page.locator('#selector-result h2').textContent();
	await page.getByRole('button', { name: 'Otra sugerencia' }).click();
	await expect(page.locator('#selector-result h2')).not.toHaveText(first ?? '');
});
