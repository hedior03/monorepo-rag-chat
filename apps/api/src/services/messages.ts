import { desc, eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { messagesTable } from '../db/schema.js';
import type { Message, MessageInsert } from '../db/schema.js';

export class MessagesService {
  async create(message: MessageInsert): Promise<Message> {
    const [newMessage] = await db
      .insert(messagesTable)
      .values(message)
      .returning();
    return newMessage;
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

    return messages;
  }
}
