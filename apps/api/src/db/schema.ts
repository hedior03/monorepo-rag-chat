import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

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
    .references(() => conversationsTable.id)
    .notNull(),
});

// Define Zod schemas for validation
export const conversationSchema = createSelectSchema(conversationsTable);

export const messageSchema = createSelectSchema(messagesTable);
export const messageInsertSchema = createInsertSchema(messagesTable).omit({
  id: true,
  createdAt: true,
});

// Define TypeScript types from Zod schemas
export type Conversation = z.infer<typeof conversationSchema>;
export type Message = z.infer<typeof messageSchema>;
export type MessageInsert = z.infer<typeof messageInsertSchema>;
