/** @param {unknown} value */
function normalize(value = '') {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim()
		.toLowerCase();
}

/**
 * @typedef {{ title?: string, platform?: string, genre?: string, generation?: string }} CatalogGame
 * @typedef {{ query?: string, genre?: string, platform?: string, generation?: string }} CatalogFilters
 */

/**
 * @template {CatalogGame} T
 * @param {T[]} games
 * @param {CatalogFilters} filters
 * @returns {T[]}
 */
export function filterGames(games, filters = {}) {
	const query = normalize(filters.query);
	const genre = normalize(filters.genre);
	const platform = normalize(filters.platform);
	const generation = normalize(filters.generation);

	return games.filter((game) => {
		const searchableText = normalize([game.title, game.platform, game.genre].filter(Boolean).join(' '));

		return (
			searchableText.includes(query) &&
			(!genre || normalize(game.genre) === genre) &&
			(!platform || normalize(game.platform) === platform) &&
			(!generation || normalize(game.generation) === generation)
		);
	});
}
