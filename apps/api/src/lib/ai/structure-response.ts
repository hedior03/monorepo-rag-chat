import { generateObject, type LanguageModelV1 } from 'ai';
import type { ZodSchema } from 'zod';

export const getStructuredResponse = async <T>(options: {
  prompt: string;
  maxAttempts?: number;
  model: LanguageModelV1;
  schema: ZodSchema<T>;
}) => {
  const { maxAttempts = 3, ...rest } = options;
  for (let i = 0; i < maxAttempts; i++) {
    const result = await generateObject(rest);
    if (result.object) {
      return result.object;
    }
  }
  throw new Error('Failed to generate structured data');
};
