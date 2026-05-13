import { z } from 'zod';

const MOODS = ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'];

export const createFragmentSchema = z.object({
    title: z
        .string()
        .trim()
        .max(100, 'Title cannot exceed 100 characters.')
        .optional(),
    content: z
        .string({ required_error: 'A fragment needs content.' })
        .trim()
        .min(1, 'A fragment needs something inside it.')
        .max(5000, 'Fragment content cannot exceed 5000 characters.'),
    mood: z
        .enum(MOODS, { errorMap: () => ({ message: 'Invalid mood selected.' }) })
        .optional()
        .default('calm'),
    glowColor: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Glow color must be a valid hex color.')
        .optional()
        .default('#8B5CF6'),
    song: z
        .string()
        .trim()
        .max(200, 'Song reference cannot exceed 200 characters.')
        .optional(),
    tags: z
        .array(z.string().trim().max(30))
        .max(10, 'Cannot have more than 10 tags.')
        .optional()
        .default([]),
});

export const updateFragmentSchema = createFragmentSchema.partial();