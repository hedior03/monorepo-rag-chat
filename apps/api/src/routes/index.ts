import { Hono } from 'hono';
import conversationsRouter from './conversations';
import messagesRouter from './messages';

// Create a router to export all routes
export const router = new Hono()
  .route('/conversations', conversationsRouter)
  .route('/messages', messagesRouter);

// Export individual routers for direct access
export { default as conversationsRouter } from './conversations';
export { default as messagesRouter } from './messages';

// Export the router type for client usage
export type Router = typeof router;
