import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
        tags: z.string().optional(),
        date: z.coerce.date().optional(), // Support legacy date field
	}),
});

const projects = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['tech', 'creative']),
        status: z.enum(['active', 'inactive']).optional(), // Only for tech
        heroImage: z.string().optional(),
        link: z.string().optional(),
        order: z.number().optional().default(100),
    }),
});

export const collections = { blog, projects };
