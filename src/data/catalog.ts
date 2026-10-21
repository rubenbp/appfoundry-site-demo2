export const generations = ['8 bits', '16 bits', '32 bits'] as const;

export const genres = [
	{ name: 'Plataformas', mark: '↗', description: 'Un salto más. Una ruta nueva.', palette: 'lime' },
	{ name: 'Acción y exploración', mark: '⌖', description: 'Mapas, secretos y caminos de vuelta.', palette: 'violet' },
	{ name: 'Aventura', mark: '◇', description: 'Mundos que se descubren paso a paso.', palette: 'sky' },
	{ name: 'Rol japonés', mark: '✳', description: 'Un grupo, un viaje y tiempo por delante.', palette: 'pink' },
	{ name: 'Puzles', mark: '▦', description: 'Ideas pequeñas. Partidas infinitas.', palette: 'orange' },
	{ name: 'Conducción', mark: '≈', description: 'Curvas, velocidad y una vuelta más.', palette: 'blue' },
	{ name: 'Lucha', mark: '×', description: 'Distancia, reflejos y duelos de sofá.', palette: 'coral' },
] as const;
