import { D1Database, D1Result } from '@cloudflare/workers-types';
import { User } from '../types';

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db
    .prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<User>();
  return result || null;
}

export async function createUser(
  db: D1Database, 
  email: string, 
  password: string, 
  role: string = 'USER'
): Promise<D1Result> {
  return await db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .bind(email, password, role)
    .run();
}

export async function getUserById(db: D1Database, id: number): Promise<User | null> {
  const result = await db
    .prepare('SELECT * FROM users WHERE id = ?')
    .bind(id)
    .first<User>();
  return result || null;
} 