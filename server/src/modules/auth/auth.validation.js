import { z } from 'zod';

export const registerSchema = z.object({
    username: z
        .string({ required_error: 'Username is required.' })
        .trim()
        .min(2, 'Username must be at least 2 characters.')
        .max(30, 'Username cannot exceed 30 characters.')
        .regex(/^[a-zA-Z0-9_\- ]+$/, 'Username can only contain letters, numbers, spaces, hyphens, and underscores.'),
    email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address.'),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(6, 'Password must be at least 6 characters.')
        .max(72, 'Password cannot exceed 72 characters.'),
});

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required.' })
        .trim()
        .toLowerCase()
        .email('Please provide a valid email address.'),
    password: z
        .string({ required_error: 'Password is required.' })
        .min(1, 'Password is required.'),
});