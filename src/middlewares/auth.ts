import { sign, verify } from 'hono/jwt';
import { Context } from 'hono';
import { JWTPayload, Env } from '../types';

const JWT_SECRET = (c: Context) => {
  const env = c.env as Env;
  return env.JWT_SECRET || 'your_secret';
};

export async function signJwt(payload: JWTPayload, c: Context): Promise<string> {
  return await sign(payload, JWT_SECRET(c));
}

export async function verifyJwt(token: string, c: Context): Promise<JWTPayload | null> {
  try {
    return await verify(token, JWT_SECRET(c)) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getTokenFromRequest(c: Context): Promise<string | null> {
  // Try Authorization header first
  let token = c.req.header('Authorization')?.replace('Bearer ', '');
  
  // Try query parameter
  if (!token) {
    const queryToken = c.req.query('token');
    if (typeof queryToken === 'string' && queryToken.length > 0) {
      token = queryToken;
    }
  }

  // Try cookie
  if (!token) {
    const cookie = c.req.header('Cookie');
    if (cookie) {
      const match = cookie.match(/token=([^;]+)/);
      if (match) token = match[1];
    }
  }

  return token ?? null;
}