import { generateObject, generateText } from 'ai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { z } from 'zod';
import { cosineDistance, desc, getTableColumns, gt, sql } from 'drizzle-orm';
import { db, documentSchema, documentsTable, messagesTable } from '@/api/db';
import type {
  Document,
  DocumentInsert,
  DocumentWithSimilarity,
  MessageInsert,
} from '@/api/db/schema';
import { type ChatModel, chatModels, myProvider } from '@/api/lib/ai/models';
import {
  formatPromptWithHistory,
  generatePromptEnhancementPrompt,
  generateRerankingPrompt,
} from '@/api/lib/ai/prompts';

export const listModels = async (): Promise<ChatModel[]> => {
  return chatModels;
};

export const enhancePrompt = async (
  prompt: string,
  history: MessageInsert[],
): Promise<string> => {
  const promptEnhancementPrompt = generatePromptEnhancementPrompt(
    prompt,
    history,
  );

  const enhancedPrompt = await generateText({
    model: myProvider.languageModel(chatModels[0].id),
    prompt: promptEnhancementPrompt,
  });

  return enhancedPrompt.text;
};

export const generateResponse = async (
  model: ChatModel,
  history: MessageInsert[],
): Promise<MessageInsert | null> => {
  try {
    const prompt = history[history.length - 1].content;

    const enhancedPrompt = await enhancePrompt(prompt, history);

    const similarDocuments = await queryDocumentSimilarity(enhancedPrompt);

    const rerankedDocuments = await rerankDocuments(
      enhancedPrompt,
      similarDocuments.map((d) => ({
        content: d.content,
        filename:
          // @ts-expect-error
          typeof d.metadata?.filename === 'string' ? d.metadata.filename : '',
      })),
    );

    const promptWithContext = formatPromptWithHistory(rerankedDocuments, [
      ...history,
      { content: enhancedPrompt, role: 'user' },
    ]);

    const response = await generateText({
      model: myProvider.languageModel(model.id),
      prompt: promptWithContext,
    });

    if (response?.text) {
      await db.insert(messagesTable).values({
        role: 'assistant',
        content: response.text,
        conversationId: history[0].conversationId,
      });
    }

    return null;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

export const indexTextDocument = async ({
  content: inputDocument,
  filename,
}: DocumentInsert): Promise<Document[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: Number(process.env.CHUNK_SIZE ?? 512),
    chunkOverlap: Number(process.env.CHUNK_OVERLAP ?? 128),
  });

  const texts = await textSplitter.splitText(inputDocument);

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
        filename,
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

const SIMILARITY_THRESHOLD = Number(process.env.SIMILARITY_THRESHOLD ?? 0.5);

export const queryDocumentSimilarity = async (
  query: string,
  topK = 4,
  similarityThreshold = SIMILARITY_THRESHOLD,
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
    .where(gt(similarity, similarityThreshold))
    .orderBy((t) => desc(t.similarity))
    .limit(topK);

  const outputDocuments = z
    .array(documentSchema.extend({ similarity: z.number() }))
    .parse(similarDocuments);

  return outputDocuments;
};

type RerankedDocument = DocumentInsert & {
  relevanceScore: number;
};

export const scoreDocumentsWithAI = async (
  query: string,
  documents: DocumentInsert[],
): Promise<Array<{ documentContent: string; relevanceScore: number }>> => {
  const scoredDocumentContent = await generateObject({
    prompt: generateRerankingPrompt(query, documents),
    model: myProvider.languageModel(chatModels[0].id),
    schema: z.object({
      documents: z.array(
        z.object({
          documentContent: z.string(),
          relevanceScore: z.number().min(0).max(10),
        }),
      ),
    }),
    maxRetries: 3,
  });

  return scoredDocumentContent.object.documents;
};

export const processRerankedDocuments = (
  scoredDocuments: Array<{ documentContent: string; relevanceScore: number }>,
  originalDocuments: DocumentInsert[],
): RerankedDocument[] => {
  const rerankedDocuments = scoredDocuments
    .map((document) => {
      const rerankedDocument = originalDocuments.find(
        (e) => e.content === document.documentContent,
      );
      if (!rerankedDocument) return undefined;
      return {
        ...rerankedDocument,
        relevanceScore: document.relevanceScore,
      };
    })
    .filter((document): document is RerankedDocument => document !== undefined)
    .filter((document) => document.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return rerankedDocuments;
};

export const rerankDocuments = async (
  query: string,
  documents: DocumentInsert[],
): Promise<RerankedDocument[]> => {
  const scoredDocuments = await scoreDocumentsWithAI(query, documents);

  const rerankedDocuments = processRerankedDocuments(
    scoredDocuments,
    documents,
  );

  return rerankedDocuments;
};
