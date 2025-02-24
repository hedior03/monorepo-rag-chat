import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MessagesService } from './messages';
import { db } from '../db';
import type { Message } from '../db/schema';

vi.mock('../db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [
          {
            id: 1,
            content: 'Test message',
            role: 'user',
            conversationId: 1,
            createdAt: new Date(),
          },
        ]),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => ({
              offset: vi.fn(() => [
                {
                  id: 1,
                  content: 'Test message',
                  role: 'user',
                  conversationId: 1,
                  createdAt: new Date(),
                },
              ]),
            })),
          })),
        })),
      })),
    })),
  },
}));

describe('MessagesService', () => {
  let service: MessagesService;

  beforeEach(() => {
    service = new MessagesService();
    vi.clearAllMocks();
  });

  it('should create a new message', async () => {
    const messageData = {
      content: 'Test message',
      role: 'user' as const,
      conversationId: 1,
    };

    const message = await service.create(messageData);
    expect(message).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        content: expect.any(String),
        role: expect.any(String),
        conversationId: expect.any(Number),
        createdAt: expect.any(Date),
      }),
    );
    expect(db.insert).toHaveBeenCalled();
  });

  it('should list messages for a conversation', async () => {
    const messages = await service.list(1);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          content: expect.any(String),
          role: expect.any(String),
          conversationId: expect.any(Number),
          createdAt: expect.any(Date),
        }),
      ]),
    );
    expect(db.select).toHaveBeenCalled();
  });

  it('should list messages with pagination', async () => {
    const messages = await service.list(1, 5, 10);
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          content: expect.any(String),
          role: expect.any(String),
          conversationId: expect.any(Number),
          createdAt: expect.any(Date),
        }),
      ]),
    );
    expect(db.select).toHaveBeenCalled();
  });
});
