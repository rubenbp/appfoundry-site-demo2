import assert from 'node:assert/strict';
import test from 'node:test';

import { filterGames } from '../../src/lib/catalog-filter.mjs';

const games = [
	{ id: 'castlevania', title: 'Castlevania: Symphony of the Night', platform: 'PlayStation', genre: 'Acción y exploración', generation: '32 bits' },
	{ id: 'sonic', title: 'Sonic the Hedgehog 2', platform: 'Mega Drive', genre: 'Plataformas', generation: '16 bits' },
	{ id: 'mario', title: 'Super Mario World', platform: 'Super Nintendo', genre: 'Plataformas', generation: '16 bits' },
];

test('busca términos sin depender de tildes ni mayúsculas', () => {
	const result = filterGames(games, { query: 'ACCION' });

	assert.deepEqual(result.map((game) => game.id), ['castlevania']);
});

test('combina género, consola y generación en el mismo resultado', () => {
	const result = filterGames(games, {
		genre: 'plataformas',
		platform: 'MEGA DRIVE',
		generation: '16 bits',
	});

	assert.deepEqual(result.map((game) => game.id), ['sonic']);
	assert.equal(games.length, 3, 'la búsqueda conserva la colección de entrada');
});

test('devuelve el catálogo completo cuando no hay filtros', () => {
	assert.deepEqual(filterGames(games).map((game) => game.id), ['castlevania', 'sonic', 'mario']);
});
