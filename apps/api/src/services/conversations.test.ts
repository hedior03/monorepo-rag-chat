import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConversationsService } from './conversations';
import { db } from '../db';

// Mock the database
vi.mock('../db', () => ({
  db: {
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [
          {
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => [
          {
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
        orderBy: vi.fn(() => [
          {
            id: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => Promise.resolve()),
    })),
  },
}));

describe('ConversationsService', () => {
  let service: ConversationsService;

  beforeEach(() => {
    service = new ConversationsService();
    vi.clearAllMocks();
  });

  it('should create a new conversation', async () => {
    const conversation = await service.create();
    expect(conversation).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
    expect(db.insert).toHaveBeenCalled();
  });

  it('should get a conversation by id', async () => {
    const conversation = await service.get(1);
    expect(conversation).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      }),
    );
    expect(db.select).toHaveBeenCalled();
  });

  it('should list conversations', async () => {
    const conversations = await service.list();
    expect(conversations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      ]),
    );
    expect(db.select).toHaveBeenCalled();
  });

  it('should delete a conversation', async () => {
    await service.delete(1);
    expect(db.delete).toHaveBeenCalled();
  });
});
