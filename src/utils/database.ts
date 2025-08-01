import { Context } from 'hono';
import { D1Database } from '@cloudflare/workers-types';
import { Env } from '../types';

export function getD1(c: Context): D1Database {
  const env = c.env as Env;
  if (!env.DB) {
    throw new Error('D1 database not found in context.env');
  }
  return env.DB;
} 