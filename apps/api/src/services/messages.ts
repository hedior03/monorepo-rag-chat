import { desc, eq } from 'drizzle-orm';
import { db } from '@/api/db/index';
import {
  conversationsTable,
  messageSchema,
  messagesTable,
} from '@/api/db/schema';
import type { Message, MessageInsert } from '@/api/db/schema';

// Helper function to convert database message to API type
function mapMessage(dbMessage: unknown): Message {
  return messageSchema.parse(dbMessage);
}

export class MessagesService {
  async create(message: MessageInsert): Promise<Message> {
    try {
      if (!message.conversationId) {
        const conversation = await db
          .insert(conversationsTable)
          .values({
            title: 'New Conversation',
          })
          .returning();
        message.conversationId = conversation[0].id;
      }

      const [newMessage] = await db
        .insert(messagesTable)
        .values({ ...message, conversationId: message.conversationId })
        .returning();
      return mapMessage(newMessage);
    } catch (error) {
      console.error('Error creating message', error);
      throw error;
    }
  }

  async list(
    conversationId: number,
    limit = 10,
    offset = 0,
  ): Promise<Message[]> {
    try {
      const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.conversationId, conversationId))
        .orderBy(desc(messagesTable.createdAt))
        .limit(limit)
        .offset(offset);

      return messages.map(mapMessage);
    } catch (error) {
      console.error('Error listing messages', error);
      throw error;
    }
  }
}
