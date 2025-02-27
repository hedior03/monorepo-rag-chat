import type { MessageInsert } from '@/api/db/schema';

export const regularPrompt =
  'You are a friendly assistant! Keep your responses concise and helpful.';

export const formatPromptWithHistory = (
  history: MessageInsert[],
  prompt = regularPrompt,
) => {
  return `${prompt}\n\n${history
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')}`;
};
