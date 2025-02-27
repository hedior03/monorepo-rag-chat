import { db, documentSchema, documentsTable, messagesTable } from '../db';
import type {
  Document,
  DocumentWithSimilarity,
  MessageInsert,
} from '../db/schema';
import { type ChatModel, chatModels, myProvider } from '../lib/ai';
import { formatPromptWithHistory } from '../lib/ai/prompts';
import { generateText } from 'ai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { z } from 'zod';
import { cosineDistance, desc, getTableColumns, gt, sql } from 'drizzle-orm';

export const listModels = async (): Promise<ChatModel[]> => {
  return chatModels;
};

export const generateResponse = async (
  model: ChatModel,
  history: MessageInsert[],
): Promise<MessageInsert | null> => {
  const prompt = formatPromptWithHistory(history);

  const response = await generateText({
    model: myProvider.languageModel(model.id),
    prompt,
  });

  await db.insert(messagesTable).values({
    role: 'assistant',
    content: response.text,
    conversationId: history[0].conversationId,
  });

  return null;
};

export const indexTextDocument = async (
  document: string,
): Promise<Document[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: Number(process.env.CHUNK_SIZE ?? 512),
    chunkOverlap: Number(process.env.CHUNK_OVERLAP ?? 128),
  });

  const texts = await textSplitter.splitText(document);

  const embedding = await myProvider
    .textEmbeddingModel('text-embedding-model-small')
    .doEmbed({ values: texts });

  const newDocuments = await Promise.all(
    embedding.embeddings.map(async (embedding, index) => {
      const content = texts[index];
      const textLength = content.length;
      const textBuffer = new TextEncoder().encode(content);
      const hashBuffer = await crypto.subtle.digest('SHA-256', textBuffer);
      const textHash = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));

      const metadata = {
        textHash,
        textLength,
        percentageOfDocument: index / texts.length,
      };

      return {
        content,
        embedding,
        textHash,
        textLength,
        metadata,
      };
    }),
  );

  const insertedDocuments = await db
    .insert(documentsTable)
    .values(newDocuments)
    .returning();

  const outputDocuments = z.array(documentSchema).parse(insertedDocuments);

  return outputDocuments;
};

export const queryDocumentSimilarity = async (
  query: string,
  topK = 4,
): Promise<DocumentWithSimilarity[]> => {
  const embedding = await myProvider
    .textEmbeddingModel('text-embedding-model-small')
    .doEmbed({ values: [query] });

  const similarity = sql<number>`1 - (${cosineDistance(
    documentsTable.embedding,
    embedding.embeddings[0],
  )})`;

  const similarDocuments = await db
    .select({
      ...getTableColumns(documentsTable),
      similarity,
    })
    .from(documentsTable)
    .where(gt(similarity, Number(process.env.SIMILARITY_THRESHOLD ?? 0.5)))
    .orderBy((t) => desc(t.similarity))
    .limit(topK);

  const outputDocuments = z
    .array(documentSchema.extend({ similarity: z.number() }))
    .parse(similarDocuments);

  return outputDocuments;
};
