import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/api/db/schema';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const client = postgres(process.env.DATABASE_URL);

export const ensureVectorExtension = async () => {
  try {
    await client`CREATE EXTENSION IF NOT EXISTS vector;`;
    console.log('Vector extension created or already exists');
  } catch (error) {
    console.error('Failed to create vector extension:', error);
    throw error;
  }
};

export const db = drizzle(client, { schema });

// Export schema for client usage
export * from './schema';
