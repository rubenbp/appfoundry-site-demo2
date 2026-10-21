import { filterGames } from '../lib/catalog-filter.mjs';

const search = document.querySelector<HTMLInputElement>('#game-search');
const platform = document.querySelector<HTMLSelectElement>('#platform-filter');
const generation = document.querySelector<HTMLSelectElement>('#generation-filter');
const count = document.querySelector<HTMLElement>('#catalog-count');
const empty = document.querySelector<HTMLElement>('#empty-state');
const reset = document.querySelector<HTMLButtonElement>('#filter-reset');
const genreButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-genre-filter]')];
const games = [...document.querySelectorAll<HTMLElement>('[data-game-card]')].map((element) => ({
	element,
	title: element.dataset.title,
	platform: element.dataset.platform,
	genre: element.dataset.genre,
	generation: element.dataset.generation,
}));

if (search && platform && generation && count && empty && reset) {
	const params = new URLSearchParams(window.location.search);
	const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
	const platformNames = new Map([...platform.options].map((option) => [option.value, option.textContent]));
	let activeGenre = genreButtons.some((button) => button.dataset.genreFilter === params.get('genero')) ? params.get('genero')! : '';
	let transition: { skipTransition: () => void } | undefined;
	search.value = params.get('q') ?? '';
	platform.value = [...platform.options].some((option) => option.value === params.get('consola')) ? params.get('consola')! : '';
	generation.value = [...generation.options].some((option) => option.value === params.get('generacion')) ? params.get('generacion')! : '';

	function update() {
		const context = { query: search!.value, platform: platform!.value, generation: generation!.value };
		const visible = new Set(filterGames(games, { ...context, genre: activeGenre }).map((game) => game.element));
		games.forEach(({ element }) => { element.hidden = !visible.has(element); });
		const inViewport = games.filter(({ element }) => !element.hidden && element.getBoundingClientRect().top < window.innerHeight);
		inViewport.forEach(({ element }) => element.classList.remove('reveal-pending'));
		genreButtons.forEach((button) => {
			const genre = button.dataset.genreFilter ?? '';
			const available = filterGames(games, { ...context, genre }).length;
			button.querySelector('[data-genre-count]')!.textContent = String(available);
			button.classList.toggle('is-selected', genre === activeGenre);
			button.setAttribute('aria-pressed', String(genre === activeGenre));
			button.disabled = available === 0 && genre !== activeGenre;
		});
		[...platform!.options].forEach((option) => {
			if (!option.value) return;
			const available = filterGames(games, { platform: option.value, generation: generation!.value }).length;
			option.disabled = available === 0;
			option.textContent = platformNames.get(option.value) + ' (' + available + ')';
		});
		count!.textContent = visible.size + (visible.size === 1 ? ' juego en el archivo' : ' juegos en el archivo');
		empty!.hidden = visible.size !== 0;
		reset!.disabled = !search!.value.trim() && !activeGenre && !platform!.value && !generation!.value;
		const nextParams = new URLSearchParams();
		Object.entries({ q: search!.value.trim(), genero: activeGenre, consola: platform!.value, generacion: generation!.value }).forEach(([key, value]) => {
			if (value) nextParams.set(key, value);
		});
		const query = nextParams.toString();
		window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash);
	}

	function apply(animate = false) {
		transition?.skipTransition();
		if (animate && !preference.matches && document.startViewTransition) transition = document.startViewTransition(update);
		else update();
	}

	function clear() {
		search!.value = '';
		platform!.value = '';
		generation!.value = '';
		activeGenre = '';
		apply(true);
	}

	function changeContext() {
		if (platform!.value && !filterGames(games, { platform: platform!.value, generation: generation!.value }).length) platform!.value = '';
		if (activeGenre && !filterGames(games, { genre: activeGenre, platform: platform!.value, generation: generation!.value }).length) activeGenre = '';
		apply(true);
	}

	search.addEventListener('input', () => apply());
	platform.addEventListener('change', changeContext);
	generation.addEventListener('change', changeContext);
	reset.addEventListener('click', clear);
	document.querySelector('#empty-reset')?.addEventListener('click', () => { clear(); search.focus(); });
	genreButtons.forEach((button) => button.addEventListener('click', () => { activeGenre = button.dataset.genreFilter ?? ''; apply(true); }));
	window.addEventListener('keydown', (event) => {
		const target = event.target as HTMLElement;
		if (event.key === '/' && !event.ctrlKey && !event.metaKey && !target.isContentEditable && !['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
			event.preventDefault();
			search.focus();
		}
	});
	apply();
}
