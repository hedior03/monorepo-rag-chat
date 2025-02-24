import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import conversationsRouter from './routes/conversations';
import messagesRouter from './routes/messages';

// Create the main app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors());

// Health check
app.get('/', (c) => c.json({ status: 'ok' }));

// Routes
app.route('/conversations', conversationsRouter);
app.route('/messages', messagesRouter);

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      error: {
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development'
          ? { details: `${err}` }
          : {}),
      },
    },
    500,
  );
});

// Show routes in development
if (process.env.NODE_ENV === 'development') {
  showRoutes(app);
}

// Start the server
serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
