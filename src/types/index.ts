import { D1Database } from '@cloudflare/workers-types';

export interface User {
  id: number;
  email: string;
  password: string;
  role: string;
  created_at?: string;
  updated_at?: string;
}

export interface JWTPayload {
  id?: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  username?: string;
  error?: string;
}

export interface QuoteData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
} 