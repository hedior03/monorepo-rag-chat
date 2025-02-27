import type { MessageInsert } from '@/api/db/schema';

export const regularPrompt =
  'You are a corporate policy assistant. Your purpose is to provide accurate information about company policies and procedures.\n' +
  'Maintain a professional, authoritative tone at all times.\n' +
  'If a question is not related to corporate policies, clearly and firmly state: "I cannot help with that topic as it is outside the scope of corporate policies."\n' +
  'Do not attempt to answer questions outside your scope under any circumstances.\n' +
  'Keep your responses structured, concise, and focused exclusively on policy-related inquiries.';

export const formatPromptWithHistory = (
  contextEmbeddings: string[],
  history: MessageInsert[],
  prompt = regularPrompt,
) => {
  return `${prompt}\n\n<context>${contextEmbeddings.map((embedding) => `<embedding>${embedding}</embedding>`).join('\n')}</context>\n\n${history
    .map((m) => `${m.role}: ${m.content}`)
    .join('\n')}`;
};
