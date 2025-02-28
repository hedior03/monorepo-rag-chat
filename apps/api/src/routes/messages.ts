import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MessagesService } from '@/api/services/messages';
import { messageInsertSchema } from '@/api/db/schema';
import { paginationSchema } from '../lib/validationSchemas';

const service = new MessagesService();

const router = new Hono()
  .get(
    '/:conversationId',
    zValidator(
      'param',
      z.object({
        conversationId: z.coerce.number().positive(),
      }),
    ),
    zValidator('query', paginationSchema),
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
  )
  .post('/', zValidator('json', messageInsertSchema), async (c) => {
    const message = await service.create(c.req.valid('json'));
    return c.json(message, 201);
  });

export default router;
