type Game = {
	title: string;
	visual: string;
	palette: string;
	rating: number;
	[key: string]: string | number | boolean | string[];
};

const dataElement = document.querySelector('#compare-data');
const games: Record<string, Game> = JSON.parse(dataElement?.textContent ?? '{}');

document.querySelectorAll<HTMLSelectElement>('[data-compare-select]').forEach((select) => {
	select.addEventListener('change', () => {
		const slot = select.closest<HTMLElement>('[data-slot]');
		if (!slot) return;
		const game = games[select.value];
		const hero = slot.querySelector<HTMLElement>('.compare-hero');
		const placeholder = slot.querySelector<HTMLElement>('.compare-placeholder');
		const title = slot.querySelector<HTMLAnchorElement>('.compare-title');
		const art = slot.querySelector<HTMLElement>('.compare-art');
		if (!hero || !placeholder || !title || !art) return;
		hero.hidden = !game;
		placeholder.hidden = !!game;
		if (game) {
			title.textContent = game.title;
			title.href = `/juegos/${encodeURIComponent(select.value)}/`;
			const artwork = art.querySelector<HTMLElement>('.game-art');
			if (artwork) {
				artwork.className = `game-art ${game.palette} visual-${game.visual}`;
				const image = artwork.querySelector<HTMLImageElement>('img');
				if (image) image.src = `/art/${encodeURIComponent(game.visual)}.svg`;
			} else {
				// Empty slots do not ship an illustration until a game is selected.
				const image = document.createElement('img');
				image.className = 'game-art__scene';
				image.alt = '';
				image.width = 480;
				image.height = 280;
				image.src = `/art/${encodeURIComponent(game.visual)}.svg`;
				const frame = document.createElement('div');
				frame.className = `game-art ${game.palette} visual-${game.visual}`;
				frame.append(image);
				art.append(frame);
			}
		}
		document.querySelectorAll<HTMLElement>(`td[data-slot="${slot.dataset.slot}"]`).forEach((cell) => {
			const field = cell.dataset.field;
			cell.textContent = game && field ? (field === 'rating' ? game.rating.toFixed(1) : String(game[field])) : '—';
		});
	});
});
