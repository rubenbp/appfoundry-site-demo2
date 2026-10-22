/** @typedef {{ id: string, title: string, summary: string, session: string, difficulty: string, players: string, platform: string, genre: string }} Game */

/**
 * Only suggest games whose typical session fits entirely in the chosen time.
 * All current session labels are ranges in minutes; fail closed for unknown formats.
 * @param {string} session
 */
export function sessionMinutes(session) {
	const match = session.match(/^\d+\s*[–-]\s*(\d+)\s*min$/);
	return match ? Number(match[1]) : Infinity;
}

/** @param {string} players */
export function supportsCompany(players) {
	return /[2-9]\s+jugadores?/.test(players);
}

/**
 * @template {Pick<Game, 'session' | 'difficulty' | 'players'>} T
 * @param {T[]} games
 * @param {{ minutes: number, difficulty: string, company: string }} choices
 * @returns {T[]}
 */
export function matchingGames(games, choices) {
	return games.filter((game) => sessionMinutes(game.session) <= choices.minutes
		&& (choices.difficulty === 'cualquiera' || game.difficulty === choices.difficulty)
		&& (choices.company === 'solo' || supportsCompany(game.players)));
}
