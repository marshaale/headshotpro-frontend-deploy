import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email({ error: 'Invalid email provided' }).trim().toLowerCase(),
  username: z.string().trim().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .trim()
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type RegisterInputValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email' }).trim().toLowerCase(),
  password: z.string({ error: 'Password is required' }),
});

export type LoginInputValues = z.infer<typeof loginSchema>;

export const resendVerifictionSchema = z.object({
  email: z.email({ error: 'Invalid email' }).trim().toLowerCase(),
});

export type ResendInputValues = z.infer<typeof resendVerifictionSchema>;
