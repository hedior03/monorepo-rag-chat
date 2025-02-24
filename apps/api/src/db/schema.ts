import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const conversationsTable = pgTable('conversations', {
  id: serial('id').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  role: text('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  conversationId: serial('conversation_id').references(
    () => conversationsTable.id,
  ),
});

export const conversationSchema = createSelectSchema(conversationsTable);
export type Conversation = z.infer<typeof conversationSchema>;

export const messageSchema = createSelectSchema(messagesTable);
export const messageInsertSchema = createInsertSchema(messagesTable)
  .extend({
    role: z.enum(['user', 'system']),
  })
  .omit({
    id: true,
    createdAt: true,
  });
export type Message = z.infer<typeof messageSchema>;
export type MessageInsert = z.infer<typeof messageInsertSchema>;
