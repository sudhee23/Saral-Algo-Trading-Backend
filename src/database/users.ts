import { D1Database, D1Result } from '@cloudflare/workers-types';
import { Portfolio, User } from '../types';

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

export async function getPortfolio(db:D1Database, id:number) {
  const result = await db
    .prepare('SELECT * FROM portfolios WHERE user_id=?')
    .bind(id)
    .all<Portfolio>();
  return result || null 
}

export async function updatePortfolio(
  db: D1Database,
  userId: number,
  symbol: string,
  quantityChange: number,
  newPurchasePrice: number | null // Allow null for averagePrice during selling
): Promise<D1Result> {
  // Check if the portfolio item exists
  const existingPortfolio = await db
    .prepare('SELECT quantity, average_price FROM portfolios WHERE user_id = ? AND symbol = ?')
    .bind(userId, symbol)
    .first<{ quantity: number; average_price: number }>();

  if (existingPortfolio) {
    const newQuantity = existingPortfolio.quantity + quantityChange;

      let newAveragePrice: number;

    if (quantityChange > 0 && newPurchasePrice !== null) {
      // Buying more stocks, calculate the new average price
      newAveragePrice = ((existingPortfolio.quantity * existingPortfolio.average_price) + (quantityChange * newPurchasePrice)) / newQuantity;
    } else {
      // Selling stocks, keep the existing average price
      newAveragePrice = existingPortfolio.average_price;
    }

    // If selling, allow quantity to decrease; prevent negative quantities
    if (newQuantity >= 0) {
      // Update the portfolio item with the new quantity and potentially new average price
      return await db
        .prepare('UPDATE portfolios SET quantity = ?, average_price = ? WHERE user_id = ? AND symbol = ?')
        .bind(newQuantity, newAveragePrice, userId, symbol)


        .run();
    } else {
      throw new Error('Not enough stocks to sell.');
    }
  } else if (quantityChange > 0) {
    // If buying and the item doesn't exist, create a new portfolio item
    return await db
      .prepare('INSERT INTO portfolios (user_id, symbol, quantity, average_price) VALUES (?, ?, ?, ?)')
      .bind(userId, symbol, quantityChange, newPurchasePrice)
      .run();
} else {
    throw new Error('Cannot sell stocks that are not in the portfolio.');
  }
}
