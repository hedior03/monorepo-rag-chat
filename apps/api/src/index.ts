import { serve } from '@hono/node-server';
import { showRoutes } from 'hono/dev';
import { app } from '@/api/app';
import { hc } from 'hono/client';

// Re-export the app
export { app };
export type { App } from '@/api/app';

// Re-export types and schemas from db schema
export {
  conversationSchema,
  messageSchema,
  messageInsertSchema,
  conversationsTable,
  messagesTable,
} from '@/api/db/schema';
export type { Conversation, Message, MessageInsert } from '@/api/db/schema';

export const createClient = (baseURL: string) => hc<typeof app>(baseURL);

export type Client = ReturnType<typeof createClient>;

// Show routes in development
if (process.env.NODE_ENV === 'development') {
  showRoutes(app);
}

// Start server unless we're being imported
if (process.env.NODE_ENV !== 'test') {
  serve(
    {
      fetch: app.fetch,
      port: Number(process.env.PORT) || 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    },
  );
}
