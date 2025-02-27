import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MessagesService } from '@/api/services/messages';
import { messageInsertSchema } from '@/api/db/schema';

const router = new Hono();
const service = new MessagesService();

// Get messages for a conversation
router.get(
  '/:conversationId',
  zValidator(
    'param',
    z.object({
      conversationId: z.coerce.number().positive(),
    }),
  ),
  zValidator(
    'query',
    z
      .object({
        limit: z.coerce.number().min(1).max(100).optional(),
        offset: z.coerce.number().min(0).optional(),
      })
      .optional(),
  ),
  async (c) => {
    const { conversationId } = c.req.valid('param');
    const query = c.req.valid('query');
    const messages = await service.list(
      conversationId,
      query?.limit,
      query?.offset,
    );
    return c.json(messages);
  },
);

// Create new message
router.post('/', zValidator('json', messageInsertSchema), async (c) => {
  console.log(c.req.json());
  const message = await service.create(c.req.valid('json'));
  return c.json(message, 201);
});

export default router;
