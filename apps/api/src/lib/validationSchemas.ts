import { z } from 'zod';

export const documentSimilaritySchema = z.object({
  query: z.string(),
  topK: z.number().optional().default(5),
});

export const paginationSchema = z
  .object({
    limit: z.coerce.number().min(1).max(100).optional(),
    offset: z.coerce.number().min(0).optional(),
  })
  .optional();
