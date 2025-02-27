import { desc, eq } from 'drizzle-orm';
import { db } from '@/api/db/index';
import { conversationsTable } from '@/api/db/schema';
import type { Conversation } from '@/api/db/schema';

// Helper function to convert database conversation to API type
function mapConversation(dbConversation: any): Conversation {
  return {
    ...dbConversation,
    createdAt: dbConversation.createdAt.toISOString(),
    updatedAt: dbConversation.updatedAt.toISOString(),
  };
}

export class ConversationsService {
  async create(): Promise<Conversation> {
    try {
      const [newConversation] = await db
        .insert(conversationsTable)
        .values({})
        .returning();
      return mapConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation', error);
      throw error;
    }
  }

  async get(id: number): Promise<Conversation> {
    try {
      const conversation = await db
        .select()
        .from(conversationsTable)
        .where(eq(conversationsTable.id, id));

      if (conversation.length === 0) {
        throw new Error('Conversation not found');
      }

      return mapConversation(conversation[0]);
    } catch (error) {
      console.error('Error getting conversation', error);
      throw error;
    }
  }

  async list(): Promise<Conversation[]> {
    const conversations = await db
      .select()
      .from(conversationsTable)
      .orderBy(desc(conversationsTable.createdAt));
    return conversations.map(mapConversation);
  }

  async delete(id: number): Promise<void> {
    try {
      await db.delete(conversationsTable).where(eq(conversationsTable.id, id));
    } catch (error) {
      console.error('Error deleting conversation', error);
      throw error;
    }
  }
}
