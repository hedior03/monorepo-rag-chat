import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { ConversationsService } from '@/api/services/conversations';
import { MessagesService } from '../services/messages';

const router = new Hono();
const conversationService = new ConversationsService();
const messageService = new MessagesService();

// Get all conversations
router.get('/', async (c) => {
  const conversations = await conversationService.list();
  return c.json(conversations);
});

// Get conversation by id
router.get(
  '/:id',
  zValidator(
    'param',
    z.object({
      id: z.coerce.number().positive(),
    }),
  ),
  async (c) => {
    try {
      const { id } = c.req.valid('param');
      const conversation = await conversationService.get(id);

      const messages = await messageService.list(id);

      return c.json({
        ...conversation,
        messages,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === 'Conversation not found'
      ) {
        return c.json({ error: 'Conversation not found' }, 404);
      }
      throw error;
    }
  },
);

// Create new conversation
router.post('/', async (c) => {
  const conversation = await conversationService.create();
  return c.json(conversation, 201);
});

// Delete conversation
router.delete(
  '/:id',
  zValidator(
    'param',
    z.object({
      id: z.coerce.number().positive(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid('param');
    await conversationService.delete(id);
    return c.json({ success: true }, 200);
  },
);

export default router;
