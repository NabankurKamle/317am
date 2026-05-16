import { z } from 'zod';

const MOODS = ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'];

export const createCapsuleSchema = z.object({
    title: z
        .string()
        .trim()
        .max(100)
        .optional(),

    content: z
        .string({ required_error: 'Your capsule needs a message.' })
        .trim()
        .min(1, 'Your capsule needs a message.')
        .max(10000),

    unlockAt: z
        .string({ required_error: 'An unlock date is required.' })
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format.')
        .refine(val => !isNaN(new Date(val).getTime()), 'Invalid date.'),

    timezone: z
        .string()
        .default('UTC'),

    mood: z
        .enum(MOODS, { errorMap: () => ({ message: 'Invalid mood.' }) })
        .optional(),

    song: z
        .string()
        .trim()
        .max(200)
        .optional(),
});

export const updateCapsuleSchema = z.object({
    title: z.string().trim().max(100).optional(),
});