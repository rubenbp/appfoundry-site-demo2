export const gameArtKeys = [
	'mario', 'sonic', 'tetris', 'street-fighter', 'donkey-kong', 'outrun', 'zelda', 'chrono-trigger', 'castlevania',
	'metroid', 'super-metroid', 'mega-man-x', 'zelda-nes', 'secret-of-mana', 'tomb-raider',
	'mario-kart', 'f-zero', 'ridge-racer', 'mortal-kombat', 'samurai-shodown', 'tekken',
	'dr-mario', 'puyo-puyo', 'puzzle-bobble', 'final-fantasy-vi', 'phantasy-star', 'final-fantasy-vii',
	'kirby', 'punch-out', 'rc-pro-am', 'final-fantasy', 'crash', 'intelligent-qube',
] as const;

export type GameArtKey = (typeof gameArtKeys)[number];
