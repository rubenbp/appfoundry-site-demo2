import { expect, test } from './fixtures.mjs';

test('compara hasta cuatro juegos, cambia una columna y abre su ficha', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('navigation', { name: 'Navegación principal' }).getByRole('link', { name: 'Comparador' }).click();
	await expect(page).toHaveURL(/\/comparador\/$/);
	const table = page.getByRole('table');
	const selectors = table.getByRole('combobox');
	await expect(selectors).toHaveCount(4);
	await expect(selectors.nth(2)).toHaveValue('');
	await expect(table.getByRole('row', { name: /Plataforma/ }).getByRole('cell')).toHaveCount(4);

	await selectors.nth(0).selectOption('super-mario-bros');
	const first = table.locator('th[data-slot="0"]');
	await expect(first.locator('.compare-title')).toHaveText('Super Mario Bros.');
	await expect(first.locator('.compare-art img')).toHaveAttribute('src', '/art/super-mario-bros.svg');
	await expect(table.locator('td[data-slot="0"][data-field="platform"]')).toHaveText('NES');
	await selectors.nth(2).selectOption('crash-bandicoot');
	await selectors.nth(3).selectOption('sonic-the-hedgehog-2');
	await expect(table.locator('th[data-slot] .compare-hero:visible')).toHaveCount(4);
	await expect(table.locator('td[data-slot="2"][data-field="platform"]')).toHaveText('PlayStation');

	await selectors.nth(0).selectOption('');
	await expect(first.locator('.compare-placeholder')).toBeVisible();
	await expect(table.locator('td[data-slot="0"][data-field="platform"]')).toHaveText('—');
	await selectors.nth(0).selectOption('super-mario-bros');
	await first.locator('.compare-title').click();
	await expect(page).toHaveURL(/\/juegos\/super-mario-bros\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Super Mario Bros.');
});

test('permite acceder a las cuatro columnas en móvil sin recortar la tabla', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/comparador/');
	const scroll = page.getByRole('region', { name: /Tabla comparativa/ });
	await expect(scroll).toBeVisible();
	await scroll.evaluate((element) => { element.scrollLeft = element.scrollWidth; });
	await page.getByRole('combobox', { name: 'Juego 4' }).selectOption('super-mario-bros');
	await expect(page.locator('td[data-slot="3"][data-field="platform"]')).toHaveText('NES');
	await expect(page.locator('th[data-slot="3"] .compare-title')).toBeVisible();
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
	expect(overflow).toBe(false);
});
