import { Hono } from 'hono';
import conversationsRouter from './conversations';
import messagesRouter from './messages';
import documentsRouter from './documents';
// Create a router to export all routes
export const router = new Hono()
  .route('/conversations', conversationsRouter)
  .route('/messages', messagesRouter)
  .route('/documents', documentsRouter);

// Export individual routers for direct access
export { default as conversationsRouter } from './conversations';
export { default as messagesRouter } from './messages';
export { default as documentsRouter } from './documents';

// Export the router type for client usage
export type Router = typeof router;
