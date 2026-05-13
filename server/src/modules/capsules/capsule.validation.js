import { z } from 'zod';

const MOODS = ['lonely', 'nostalgic', 'calm', 'hopeful', 'chaotic', 'dreamy'];

export const createCapsuleSchema = z.object({
    title: z
        .string()
        .trim()
        .max(100, 'Title cannot exceed 100 characters.')
        .optional(),
    content: z
        .string({ required_error: 'Your capsule needs a message.' })
        .trim()
        .min(1, 'Your capsule needs a message.')
        .max(10000, 'Message cannot exceed 10,000 characters.'),
    unlockAt: z
        .string({ required_error: 'An unlock date is required.' })
        .refine(val => {
            const date = new Date(val);
            return !isNaN(date.getTime());
        }, 'Invalid date format.')
        .refine(val => {
            return new Date(val) > new Date();
        }, 'Unlock date must be in the future.'),
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