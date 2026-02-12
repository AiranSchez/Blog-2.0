import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    featuredImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

const projects = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    tech: z.array(z.string()).default([]),
    githubUrl: z.string().optional(),
    demoUrl: z.string().optional(),
    featured: z.boolean().default(false),
    locale: z.enum(['en', 'es', 'ja']),
  }),
});

export const collections = {
  blog,
  about,
  projects,
};
