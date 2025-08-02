import { D1Database } from "@cloudflare/workers-types";
import { User } from "../types";
export interface CRequest{
  id?: number;
  user_id: number;
  request_type:string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  additional_info?: Stock|Fund|PasswordReset|string;
  action_admin_id?:number;
  created_at?: string;
  updated_at?: string;
}

export interface Stock{
    stocksymbol:string
    quantity:number
}
export interface Fund{
    amount:number
}
export interface PasswordReset{
    email:string
    new_password:string
}

export async function getRequests(db: D1Database): Promise<User[]> {
  const result = await db
    .prepare('SELECT * FROM requests')
    .all<User>();
  return result.results || [];
}

export async function getRequestById(db: D1Database, id: number): Promise<CRequest | null> {
  const result = await db
    .prepare('SELECT * FROM requests WHERE id = ?')
    .bind(id)
    .first<CRequest>();
  return result || null;
}

export async function getRequestByUserId(db: D1Database, userId: number): Promise<CRequest[] | null> {
  const result = await db
    .prepare('SELECT * FROM requests WHERE user_id = ?')
    .bind(userId)
    .all<CRequest>();
  return result.results || null;
}

export async function sendRequest(
  db:D1Database,
  data: CRequest
): Promise<CRequest>{
  const result = await db
    .prepare('INSERT INTO requests (user_id, request_type, status, additional_info) VALUES (?, ?, ?, ?)')
    .bind(data.user_id, data.request_type, data.status, data.additional_info)
    .run();
  
  if (result.success) {
    return {
      user_id: data.user_id,
      request_type: data.request_type,
      status: data.status,
      additional_info: data.additional_info,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } else {
    throw new Error('Failed to create request');
  }
}
