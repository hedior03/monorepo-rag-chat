import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  vector,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Define database tables
export const conversationsTable = pgTable('conversations', {
  id: serial('id').primaryKey(),
  title: text('title').notNull().default('New Conversation'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  conversationId: serial('conversation_id')
    .references(() => conversationsTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const documentsTable = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    textHash: text('text_hash').notNull(),
    textLength: integer('text_length').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }).notNull(),
    metadata: jsonb('metadata').default({}),
  },
  (table) => [
    index('embeddingIndex').using(
      'hnsw',
      table.embedding.op('vector_cosine_ops'),
    ),
  ],
);

// Define Zod schemas for validation
export const conversationSchema = createSelectSchema(conversationsTable);

export const messageSchema = createSelectSchema(messagesTable);
export const messageInsertSchema = createInsertSchema(messagesTable)
  .extend({
    content: z.string().min(1),
  })
  .omit({
    id: true,
    createdAt: true,
  });

export const documentSchema = createSelectSchema(documentsTable).extend({
  content: z.string().min(1),
  embedding: z.array(z.number()).length(1536), // openai embedding dimension
});
export const documentInsertSchema = z.object({
  content: z.string().min(1),
  filename: z.string().min(1),
});

// Define TypeScript types from Zod schemas
export type Conversation = z.infer<typeof conversationSchema>;

export type Message = z.infer<typeof messageSchema>;
export type MessageInsert = z.infer<typeof messageInsertSchema>;

export type Document = z.infer<typeof documentSchema>;
export type DocumentWithSimilarity = Document & { similarity: number };
export type DocumentInsert = z.infer<typeof documentInsertSchema>;
