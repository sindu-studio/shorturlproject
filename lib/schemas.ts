import { z } from 'zod';

export const CreateLinkSchema = z.object({
  originalUrl: z.string().url('Please enter a valid URL'),
  customSlug: z.string().min(3, 'Slug must be at least 3 characters').max(20, 'Slug must be at most 20 characters').optional(),
});

export const UpdateLinkSchema = z.object({
  id: z.number(),
  originalUrl: z.string().url('Please enter a valid URL'),
});

export type CreateLinkInput = z.infer<typeof CreateLinkSchema>;
export type UpdateLinkInput = z.infer<typeof UpdateLinkSchema>;
