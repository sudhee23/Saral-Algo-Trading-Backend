import { Hono } from 'hono';
import { getUserByEmail, createUser } from '../database';
import { hashPassword, verifyPassword } from '../middlewares/hash';
import { signJwt, verifyJwt, getTokenFromRequest } from '../middlewares/auth';
import { getD1 } from '../utils/database';
import { AuthRequest, AuthResponse, JWTPayload } from '../types';

const auth = new Hono();

// POST /auth/login
auth.post('/login', async (c) => {
  try {
    const { email, password }: AuthRequest = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const db = getD1(c);
    const user = await getUserByEmail(db, email);
    
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = await signJwt({ 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, c);

    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=3600`);
    
    const username = user.email.split('@')[0];
    return c.json({ success: true, username });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /auth/signup
auth.post('/signup', async (c) => {
  try {
    const { email, password }: AuthRequest = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const db = getD1(c);
    const existing = await getUserByEmail(db, email);
    
    if (existing) {
      return c.json({ error: 'User already exists' }, 400);
    }

    const hash = await hashPassword(password);
    await createUser(db, email, hash, 'USER');
    
    const token = await signJwt({ email, role: 'USER' }, c);
    c.header('Set-Cookie', `token=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=3600`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /auth/me
auth.get('/me', async (c) => {
  try {
    const token = await getTokenFromRequest(c);
    
    if (!token) {
      return c.json({ user: null }, 401);
    }

    const user = await verifyJwt(token, c);
    if (!user) {
      return c.json({ user: null }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.error('Me error:', error);
    return c.json({ user: null }, 401);
  }
});

// POST /auth/logout
auth.post('/logout', async (c) => {
  c.header('Set-Cookie', 'token=; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=0');
  return c.json({ success: true });
});

export default auth; 