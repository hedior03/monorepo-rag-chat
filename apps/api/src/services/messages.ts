import { desc, eq } from 'drizzle-orm';
import { db } from '@/api/db/index';
import { messageSchema, messagesTable } from '@/api/db/schema';
import type { Message, MessageInsert } from '@/api/db/schema';

// Helper function to convert database message to API type
function mapMessage(dbMessage: unknown): Message {
  return messageSchema.parse(dbMessage);
}

export class MessagesService {
  async create(message: MessageInsert): Promise<Message> {
    const [newMessage] = await db
      .insert(messagesTable)
      .values(message)
      .returning();
    return mapMessage(newMessage);
  }

  async list(
    conversationId: number,
    limit = 10,
    offset = 0,
  ): Promise<Message[]> {
    const messages = await db
      .select()
      .from(messagesTable)
      .where(eq(messagesTable.conversationId, conversationId))
      .orderBy(desc(messagesTable.createdAt))
      .limit(limit)
      .offset(offset);

    return messages.map(mapMessage);
  }
}
