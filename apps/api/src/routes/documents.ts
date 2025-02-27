import { Hono } from 'hono';
import { indexTextDocument, queryDocumentSimilarity } from '../services/ai';
import { zValidator } from '@hono/zod-validator';
import { documentInsertSchema } from '../db';
import { documentSimilaritySchema } from '../lib/validationSchemas';

const router = new Hono();

router.post('/', zValidator('json', documentInsertSchema), async (c) => {
  const { content } = c.req.valid('json');
  const documents = await indexTextDocument(content);
  return c.json(
    documents.map((document) => document.id),
    201,
  );
});

router.post(
  '/query',
  zValidator('json', documentSimilaritySchema),
  async (c) => {
    const { query, topK } = c.req.valid('json');
    const documents = await queryDocumentSimilarity(query, topK);

    const similarities = documents.map((document) => ({
      similarity: document.similarity,
      documentId: document.id,
      content: document.content,
      metadata: document.metadata,
    }));
    return c.json(similarities);
  },
);

export default router;
