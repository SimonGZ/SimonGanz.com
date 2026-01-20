import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		date: z.date(),
		tags: z.string().optional(),
		description: z.string().optional(),
		readMoreText: z.string().optional(),
	}),
});

export const collections = { blog };
