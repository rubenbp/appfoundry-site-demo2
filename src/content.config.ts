import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { gameArtKeys } from './data/game-art';

const juegos = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/juegos' }),
	schema: z.object({
		title: z.string(),
		summary: z.string().min(30).max(180),
		year: z.number().int(),
		platform: z.string(),
		generation: z.enum(['8 bits', '16 bits', '32 bits']),
		genre: z.string(),
		developer: z.string(),
		publisher: z.string(),
		players: z.string(),
		playtime: z.string(),
		rating: z.number().min(1).max(5),
		featured: z.boolean().default(false),
		visual: z.enum(gameArtKeys),
		palette: z.enum(['theme-lime', 'theme-orange', 'theme-blue', 'theme-pink', 'theme-violet', 'theme-sky']),
		tags: z.array(z.string()).default([]),
		difficulty: z.enum(['Suave', 'Media', 'Exigente']),
		session: z.string(),
		highlights: z.array(z.string()).length(3),
	}),
});

export const collections = { juegos };
