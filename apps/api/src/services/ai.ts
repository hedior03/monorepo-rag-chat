import { db, messagesTable } from '../db';
import type { MessageInsert } from '../db/schema';
import { type ChatModel, chatModels, myProvider } from '../lib/ai';
import { regularPrompt } from '../lib/ai/prompts';
import { generateText } from 'ai';

export const listModels = async (): Promise<ChatModel[]> => {
  return chatModels;
};

export const generateResponse = async (
  model: ChatModel,
  message: MessageInsert,
): Promise<MessageInsert | null> => {
  const prompt = `${regularPrompt}\n\n${message.content}`;

  console.log('Prompt', prompt);

  const response = await generateText({
    model: myProvider.languageModel(model.id),
    prompt,
  });

  console.log('Response from ai', response.text);

  const aiMessage = await db.insert(messagesTable).values({
    role: 'assistant',
    content: response.text,
    conversationId: message.conversationId,
  });

  console.log(aiMessage);

  // return {
  //   role: 'assistant',
  //   content: response.text,
  // };
  // temporary
  return null;
};
