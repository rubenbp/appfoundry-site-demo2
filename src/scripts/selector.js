import { matchingGames } from './selector-logic.mjs';

const form = document.querySelector('#selector-form');
const data = document.querySelector('#selector-data');
const result = document.querySelector('#selector-result');

if (form instanceof HTMLFormElement && data && result instanceof HTMLElement) {
	/** @type {import('./selector-logic.mjs').Game[]} */
	const games = JSON.parse(data.textContent ?? '[]');
	const submit = form.querySelector('button[type="submit"]');
	/** @type {string[]} */
	let seen = [];
	let previousChoices = '';
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		const minutes = form.elements.namedItem('minutes');
		const difficulty = form.elements.namedItem('difficulty');
		const company = form.elements.namedItem('company');
		if (!(minutes instanceof HTMLSelectElement) || !(difficulty instanceof HTMLSelectElement) || !(company instanceof HTMLSelectElement)) return;
		const choices = { minutes: Number(minutes.value), difficulty: difficulty.value, company: company.value };
		const key = JSON.stringify(choices);
		if (key !== previousChoices) seen = [];
		previousChoices = key;
		const matches = matchingGames(games, choices);
		const available = matches.filter((game) => !seen.includes(game.id));
		if (!available.length) seen = [];
		const game = (available.length ? available : matches)[0];
		result.replaceChildren();
		const heading = document.createElement('h2');
		if (!game) {
			if (submit) submit.textContent = 'Sugerir una partida ↗';
			heading.textContent = 'No hay partida con esa combinación.';
			const note = document.createElement('p');
			note.textContent = 'Prueba con más tiempo, otra dificultad o juega en solitario. También puedes explorar el catálogo completo.';
			const link = document.createElement('a');
			link.href = '/catalogo/';
			link.className = 'button button--dark';
			link.textContent = 'Explorar el catálogo ↗';
			result.append(heading, note, link);
		} else {
			if (submit) submit.textContent = 'Otra sugerencia ↗';
			seen.push(game.id);
			heading.textContent = game.title;
			const note = document.createElement('p');
			note.textContent = `Encaja porque una sesión dura ${game.session}, su dificultad es ${game.difficulty.toLowerCase()} y admite ${game.players}.`;
			const summary = document.createElement('p');
			summary.textContent = game.summary;
			const meta = document.createElement('p');
			meta.className = 'selector-result__meta';
			meta.textContent = `${game.platform} · ${game.genre}`;
			const link = document.createElement('a');
			link.href = `/juegos/${encodeURIComponent(game.id)}/`;
			link.className = 'button button--lime';
			link.textContent = 'Ver la ficha ↗';
			result.append(meta, heading, note, summary, link);
		}
		result.hidden = false;
	});
}
