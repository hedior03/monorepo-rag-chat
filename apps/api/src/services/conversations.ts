import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { conversationsTable } from '../db/schema.js';
import type { Conversation } from '../db/schema.js';

export class ConversationsService {
  async create(): Promise<Conversation> {
    const [newConversation] = await db
      .insert(conversationsTable)
      .values({})
      .returning();
    return newConversation;
  }

  async get(id: number): Promise<Conversation> {
    const conversation = await db
      .select()
      .from(conversationsTable)
      .where(eq(conversationsTable.id, id));

    if (conversation.length === 0) {
      throw new Error('Conversation not found');
    }

    return conversation[0];
  }

  async list(): Promise<Conversation[]> {
    const conversations = await db
      .select()
      .from(conversationsTable)
      .orderBy(desc(conversationsTable.createdAt));
    return conversations;
  }

  async delete(id: number): Promise<void> {
    await db.delete(conversationsTable).where(eq(conversationsTable.id, id));
  }
}
