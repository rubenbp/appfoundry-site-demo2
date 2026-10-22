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

test('conserva los juegos elegidos en la URL al recargar y al compartir el enlace', async ({ page, context }) => {
	await page.goto('/comparador/');
	const selectors = page.locator('[data-compare-select]');
	await selectors.nth(0).selectOption('super-mario-bros');
	await selectors.nth(1).selectOption('');
	await selectors.nth(2).selectOption('crash-bandicoot');
	const link = page.url();
	expect(new URL(link).searchParams.get('juegos')).toBe('super-mario-bros,,crash-bandicoot,');
	await page.reload();
	await expect(selectors.nth(0)).toHaveValue('super-mario-bros');
	await expect(selectors.nth(1)).toHaveValue('');
	await expect(selectors.nth(2)).toHaveValue('crash-bandicoot');
	await expect(page.locator('td[data-slot="2"][data-field="platform"]')).toHaveText('PlayStation');
	const shared = await context.newPage();
	await shared.goto(link);
	await expect(shared.locator('th[data-slot="0"] .compare-title')).toHaveText('Super Mario Bros.');
	await expect(shared.locator('th[data-slot="1"] .compare-placeholder')).toBeVisible();
	await expect(shared.locator('th[data-slot="2"] .compare-title')).toHaveText('Crash Bandicoot');
	await shared.close();
	await page.goBack();
	await expect(selectors.nth(2)).toHaveValue('');
});

test('admite una comparación vacía y descarta identificadores inexistentes', async ({ page }) => {
	await page.goto('/comparador/?juegos=no-existe,,super-mario-bros,');
	await expect(page.locator('[data-compare-select]').nth(0)).toHaveValue('');
	await expect(page.locator('th[data-slot="0"] .compare-placeholder')).toBeVisible();
	await expect(page.locator('th[data-slot="2"] .compare-title')).toHaveText('Super Mario Bros.');
	await page.goto('/comparador/');
	for (const select of await page.locator('[data-compare-select]').all()) await select.selectOption('');
	await expect(page).toHaveURL(/juegos=%2C%2C%2C/);
	await page.reload();
	await expect(page.locator('th[data-slot] .compare-placeholder:visible')).toHaveCount(4);
	await expect(page.locator('tbody td')).toHaveCount(48);
	await expect(page.locator('tbody td').first()).toHaveText('—');
});
