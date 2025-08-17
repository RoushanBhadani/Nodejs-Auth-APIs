import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3).max(30)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
