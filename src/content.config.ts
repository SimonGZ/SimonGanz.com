import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: image().optional(),
        tags: z.string().optional(),
        date: z.coerce.date().optional(), // Support legacy date field
	}),
});

const projects = defineCollection({
    loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) => z.object({
        title: z.string(),
        description: z.string(),
        type: z.enum(['tech', 'creative']),
        status: z.enum(['active', 'inactive']).optional(), // Only for tech
        heroImage: image().optional(),
        link: z.string().optional(),
        order: z.number().optional().default(100),
    }),
});

export const collections = { blog, projects };
