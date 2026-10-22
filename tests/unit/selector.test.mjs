import assert from 'node:assert/strict';
import test from 'node:test';
import { matchingGames, sessionMinutes, supportsCompany } from '../../src/scripts/selector-logic.mjs';

const games = [
	{ id: 'tetris', session: '5–15 min', difficulty: 'Suave', players: '1 jugador' },
	{ id: 'puzzle', session: '5–15 min', difficulty: 'Suave', players: '1–2 jugadores' },
	{ id: 'mario', session: '20–40 min', difficulty: 'Media', players: '1–2 jugadores por turnos' },
	{ id: 'unknown', session: 'al rato', difficulty: 'Suave', players: '1–2 jugadores' },
];

test('interpreta el extremo superior de la sesión y excluye formatos desconocidos', () => {
	assert.equal(sessionMinutes('5–15 min'), 15);
	assert.equal(sessionMinutes('20-40 min'), 40);
	assert.equal(sessionMinutes('sin dato'), Infinity);
});

test('admite compañía también cuando los jugadores se turnan', () => {
	assert.equal(supportsCompany('1–2 jugadores por turnos'), true);
	assert.equal(supportsCompany('1 jugador'), false);
});

test('filtra simultáneamente por tiempo, dificultad y compañía sin sugerencias falsas', () => {
	assert.deepEqual(matchingGames(games, { minutes: 15, difficulty: 'Suave', company: 'acompanado' }).map((game) => game.id), ['puzzle']);
	assert.deepEqual(matchingGames(games, { minutes: 30, difficulty: 'Exigente', company: 'acompanado' }), []);
	assert.deepEqual(matchingGames(games, { minutes: 60, difficulty: 'Media', company: 'solo' }).map((game) => game.id), ['mario']);
});
