import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
  }),
});

const experience = defineCollection({
  type: 'data',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    startDate: z.string(), // YYYY-MM format
    endDate: z.string().nullable(), // YYYY-MM format or null for present
    description: z.string().optional(),
    skills: z.array(z.string()).optional().default([]),
    technologies: z.array(z.string()).optional().default([]),
    locale: z.enum(['en', 'es', 'ja']),
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
  experience,
  projects,
};
