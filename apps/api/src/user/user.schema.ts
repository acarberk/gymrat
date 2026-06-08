import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    displayName: z.string().min(1).max(100).optional(),
    avatarUrl: z.union([z.url().max(500), z.null()]).optional(),
    locale: z.enum(['tr', 'en']).optional(),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
