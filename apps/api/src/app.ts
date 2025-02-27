import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { router } from './routes';

// Create the main app
export const app = new Hono()
  .use('*', logger())
  .use('*', prettyJSON())
  .use(
    '*',
    cors({
      origin: '*',
    }),
  )
  .get('/', (c) => c.json({ status: 'ok' }))
  .route('/api', router)
  .onError((err, c) => {
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

// Export the type for client usage
export type App = typeof app;
