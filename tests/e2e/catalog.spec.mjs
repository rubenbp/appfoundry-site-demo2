import { expect, test } from './fixtures.mjs';

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} filename
 */
async function capture(page, filename) {
	if (!process.env.CAPTURE_DEMO) return;
	await page.locator('[data-reveal]').evaluateAll((elements) => elements.forEach((element) => element.classList.remove('reveal-pending')));
	await page.evaluate(async () => {
		const images = [...document.querySelectorAll('img')];
		images.forEach((image) => { image.loading = 'eager'; });
		await Promise.all(images.map((image) => image.decode()));
	});
	await page.screenshot({ path: test.info().outputPath(filename), fullPage: true, animations: 'disabled' });
}

test('busca sin tildes y abre la ficha de Castlevania', async ({ page }) => {
	await page.goto('/catalogo/');
	await page.getByRole('searchbox', { name: 'Busca en el archivo' }).fill('accion');

	const castlevania = page.getByRole('link', { name: 'Ver ficha de Castlevania: Symphony of the Night' });
	await expect(castlevania).toBeVisible();
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(4);
	await castlevania.click();

	await expect(page).toHaveURL(/\/juegos\/castlevania-symphony-of-the-night\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Castlevania: Symphony of the Night');
});

test('todos los géneros tienen juegos en las tres épocas', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('.genre-tile')).toHaveCount(8);
	await capture(page, 'portada.png');
	await page.locator('.genre-tile').filter({ hasText: 'Rol japonés' }).click();
	await expect(page.getByRole('button', { name: 'Rol japonés', exact: true })).toHaveAttribute('aria-pressed', 'true');
	await page.getByRole('button', { name: 'Todo el archivo', exact: true }).click();
	for (const generation of ['8 bits', '16 bits', '32 bits']) {
		await page.getByLabel('Época', { exact: true }).selectOption(generation);
		const genres = page.locator('[data-genre-filter]:not([data-genre-filter=""])');
		await expect(genres).toHaveCount(7);
		for (const genre of await genres.all()) {
			await expect(genre).toBeEnabled();
			await genre.click();
			await expect(page.locator('[data-game-card]:visible').first()).toBeVisible();
		}
		await page.getByRole('button', { name: 'Todo el archivo', exact: true }).click();
	}
	await page.getByRole('button', { name: 'Limpiar filtros' }).click();
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(33);
	await capture(page, 'catalogo.png');
});

test('muestra la época de la URL y limpia todos los filtros', async ({ page }) => {
	await page.goto('/catalogo/?generacion=8%20bits');
	await expect(page.getByLabel('Época', { exact: true })).toHaveValue('8 bits');
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(8);
	await page.getByRole('searchbox').fill('un juego que no existe');
	await expect(page.getByRole('heading', { name: 'Esa partida aún no está aquí.' })).toBeVisible();
	await page.getByRole('button', { name: 'Ver todos los juegos' }).click();
	await expect(page.getByRole('searchbox')).toHaveValue('');
	await expect(page.getByLabel('Época', { exact: true })).toHaveValue('');
	await expect(page).toHaveURL(/\/catalogo\/$/);
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(33);
});

test('la ficha ampliada se lee en móvil con movimiento reducido', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/juegos/crash-bandicoot/');
	for (const heading of ['Cómo se juega', 'Tu primera partida', 'Para quién encaja', 'Ten en cuenta']) {
		await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
	}
	await expect(page.locator('.game-highlights strong')).toHaveCount(3);
	await expect(page.locator('.detail-hero__art img')).toHaveJSProperty('complete', true);
	expect(await page.locator('.detail-hero__art img').evaluate((image) => image instanceof HTMLImageElement ? image.naturalWidth : 0)).toBeGreaterThan(0);
	const metrics = await page.evaluate(() => {
		const highlights = document.querySelector('.game-highlights');
		const pixel = document.querySelector('.game-art__pixel');
		if (!highlights || !pixel) throw new Error('Missing game detail elements');
		return {
			overflow: document.documentElement.scrollWidth > window.innerWidth,
			revealOpacity: getComputedStyle(highlights).opacity,
			pixelDuration: getComputedStyle(pixel).animationDuration,
		};
	});
	expect(metrics.overflow).toBe(false);
	expect(metrics.revealOpacity).toBe('1');
	expect(Number.parseFloat(metrics.pixelDuration)).toBeLessThan(0.001);
	await capture(page, 'ficha-mobile.png');
});

test('las secciones aparecen al desplazarse y las tarjetas responden al cursor', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });
	await page.goto('/');
	const tile = page.locator('.genre-tile').first();
	await expect(tile).toHaveClass(/reveal-pending/);
	await tile.scrollIntoViewIfNeeded();
	await expect(tile).not.toHaveClass(/reveal-pending/);
	await expect.poll(() => tile.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
	await tile.hover();
	await expect.poll(() => tile.evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');
	const supportsPageTransition = await page.evaluate(() => 'onpageswap' in window && CSS.supports('view-transition-name', 'archive'));
	if (supportsPageTransition) {
		await page.evaluate(() => window.addEventListener('pageswap', (event) => {
			sessionStorage.setItem('archive-transition', String(Boolean(event.viewTransition)));
		}, { once: true }));
	}
	await tile.click();
	await expect(page.getByRole('button', { name: 'Plataformas', exact: true })).toHaveAttribute('aria-pressed', 'true');
	if (supportsPageTransition) expect(await page.evaluate(() => sessionStorage.getItem('archive-transition'))).toBe('true');
});

test('combina género y consola para abrir la ficha de Sonic', async ({ page }) => {
	await page.goto('/catalogo/');
	await page.getByRole('button', { name: 'Plataformas' }).click();
	await page.getByLabel('Consola').selectOption('mega drive');

	const sonic = page.getByRole('link', { name: 'Ver ficha de Sonic the Hedgehog 2' });
	await expect(sonic).toBeVisible();
	await expect(page.locator('[data-game-card]:visible')).toHaveCount(1);
	await sonic.click();

	await expect(page).toHaveURL(/\/juegos\/sonic-the-hedgehog-2\/$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sonic the Hedgehog 2');
});
