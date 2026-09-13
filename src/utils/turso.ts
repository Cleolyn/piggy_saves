/**
 * Turso LibSQL Cloud Database Client for PiggyVault
 * Provides persistent serverless edge database connectivity,
 * schema initialization, bi-directional sync, and health checks.
 */

import { createClient, type Client } from '@libsql/client/web';
import type { Transaction, SavingsGoal, CurrencyCode } from '../types';
import type { UserProfileRecord } from './userRegistry';
import { normalizeEmail } from './userRegistry';

// Turso configuration with environment variable support & fallback defaults
export const TURSO_CONFIG = {
  url:
    (import.meta.env.VITE_TURSO_DATABASE_URL as string) ||
    'libsql://piggyvault-vinceestodomingo-cpu.aws-ap-northeast-1.turso.io',
  authToken: (import.meta.env.VITE_TURSO_AUTH_TOKEN as string) || '',
};

let clientInstance: Client | null = null;

/**
 * Returns a singleton instance of the Turso LibSQL client.
 */
export function getTursoClient(): Client {
  if (!clientInstance) {
    clientInstance = createClient({
      url: TURSO_CONFIG.url,
      authToken: TURSO_CONFIG.authToken,
    });
  }
  return clientInstance;
}

/**
 * Checks Turso database health and connectivity latency.
 */
export async function checkTursoHealth(): Promise<{
  connected: boolean;
  latencyMs: number;
  database: string;
  error?: string;
}> {
  const start = performance.now();
  try {
    const client = getTursoClient();
    await client.execute('SELECT 1 as ping;');
    const latencyMs = Math.round(performance.now() - start);
    return {
      connected: true,
      latencyMs,
      database: 'piggyvault-vinceestodomingo-cpu.aws-ap-northeast-1',
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      connected: false,
      latencyMs: Math.round(performance.now() - start),
      database: 'piggyvault-vinceestodomingo-cpu.aws-ap-northeast-1',
      error: message,
    };
  }
}

/**
 * Initializes tables in the Turso LibSQL database if they do not already exist.
 */
export async function initTursoSchema(): Promise<void> {
  try {
    const client = getTursoClient();

    await client.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT NOT NULL,
        email TEXT PRIMARY KEY,
        auth_providers TEXT NOT NULL,
        created_at TEXT NOT NULL,
        last_login_at TEXT NOT NULL,
        is_onboarded INTEGER NOT NULL DEFAULT 1,
        linked_accounts_count INTEGER NOT NULL DEFAULT 1
      );
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        amount REAL NOT NULL,
        category TEXT NOT NULL,
        destination TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        notes TEXT
      );
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_transactions_email ON transactions(user_email);
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS savings_goals (
        id TEXT PRIMARY KEY,
        user_email TEXT NOT NULL,
        title TEXT NOT NULL,
        target_amount REAL NOT NULL,
        current_amount REAL NOT NULL DEFAULT 0,
        target_date TEXT,
        notes TEXT
      );
    `);

    await client.execute(`
      CREATE INDEX IF NOT EXISTS idx_savings_goals_email ON savings_goals(user_email);
    `);

    await client.execute(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_email TEXT PRIMARY KEY,
        currency TEXT NOT NULL DEFAULT 'PHP',
        theme TEXT NOT NULL DEFAULT 'light',
        updated_at TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.error('Turso schema initialization error:', err);
  }
}

/**
 * Upserts a user profile in Turso.
 */
export async function saveUserToTurso(user: UserProfileRecord): Promise<void> {
  try {
    const client = getTursoClient();
    const cleanEmail = normalizeEmail(user.email);
    await client.execute({
      sql: `
        INSERT INTO users (
          user_id, email, auth_providers, created_at, last_login_at, is_onboarded, linked_accounts_count
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
          user_id = excluded.user_id,
          auth_providers = excluded.auth_providers,
          last_login_at = excluded.last_login_at,
          linked_accounts_count = excluded.linked_accounts_count;
      `,
      args: [
        user.userId,
        cleanEmail,
        JSON.stringify(user.authProviders),
        user.createdAt,
        user.lastLoginAt,
        user.isOnboarded ? 1 : 0,
        user.linkedAccountsCount,
      ],
    });
  } catch (err) {
    console.error('Failed to save user to Turso:', err);
  }
}

/**
 * Fetches a user profile from Turso by email.
 */
export async function fetchUserFromTurso(email: string): Promise<UserProfileRecord | null> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return null;
    const client = getTursoClient();
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ? LIMIT 1;',
      args: [cleanEmail],
    });
    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    let authProviders: UserProfileRecord['authProviders'] = ['google'];
    try {
      if (typeof row.auth_providers === 'string') {
        authProviders = JSON.parse(row.auth_providers);
      }
    } catch {
      // fallback
    }

    return {
      userId: String(row.user_id),
      email: String(row.email),
      authProviders,
      createdAt: String(row.created_at),
      lastLoginAt: String(row.last_login_at),
      isOnboarded: Boolean(row.is_onboarded),
      dataStorageKey: `piggyvault_user_${cleanEmail.replace(/[^a-z0-9_]/g, '_')}`,
      linkedAccountsCount: Number(row.linked_accounts_count) || 1,
    };
  } catch (err) {
    console.error('Failed to fetch user from Turso:', err);
    return null;
  }
}

/**
 * Syncs user transactions to Turso.
 */
export async function syncTransactionsToTurso(
  email: string,
  transactions: Transaction[]
): Promise<void> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return;
    const client = getTursoClient();

    // Delete existing transactions for this user then re-insert current snapshot
    await client.execute({
      sql: 'DELETE FROM transactions WHERE user_email = ?;',
      args: [cleanEmail],
    });

    for (const tx of transactions) {
      await client.execute({
        sql: `
          INSERT INTO transactions (
            id, user_email, type, title, amount, category, destination, timestamp, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `,
        args: [
          tx.id,
          cleanEmail,
          tx.type,
          tx.title || '',
          tx.amount,
          tx.category || '',
          tx.destination || '',
          tx.timestamp,
          tx.notes || null,
        ],
      });
    }
  } catch (err) {
    console.error('Failed to sync transactions to Turso:', err);
  }
}

/**
 * Fetches transactions from Turso for a given user email.
 */
export async function fetchTransactionsFromTurso(email: string): Promise<Transaction[]> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return [];
    const client = getTursoClient();
    const result = await client.execute({
      sql: 'SELECT * FROM transactions WHERE user_email = ? ORDER BY timestamp DESC;',
      args: [cleanEmail],
    });

    return result.rows.map((row) => ({
      id: String(row.id),
      type: (row.type === 'SAVINGS' ? 'SAVINGS' : 'EXPENSE') as Transaction['type'],
      title: String(row.title || ''),
      amount: Number(row.amount) || 0,
      category: String(row.category || ''),
      destination: String(row.destination || ''),
      timestamp: String(row.timestamp),
      notes: row.notes ? String(row.notes) : undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch transactions from Turso:', err);
    return [];
  }
}

/**
 * Syncs savings goals to Turso.
 */
export async function syncSavingsGoalsToTurso(
  email: string,
  goals: SavingsGoal[]
): Promise<void> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return;
    const client = getTursoClient();

    await client.execute({
      sql: 'DELETE FROM savings_goals WHERE user_email = ?;',
      args: [cleanEmail],
    });

    for (const g of goals) {
      await client.execute({
        sql: `
          INSERT INTO savings_goals (
            id, user_email, title, target_amount, current_amount, target_date, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        args: [
          g.id,
          cleanEmail,
          g.title,
          g.targetAmount,
          g.currentAmount,
          g.targetDate || null,
          g.notes || null,
        ],
      });
    }
  } catch (err) {
    console.error('Failed to sync savings goals to Turso:', err);
  }
}

/**
 * Fetches savings goals from Turso for a given user email.
 */
export async function fetchSavingsGoalsFromTurso(email: string): Promise<SavingsGoal[]> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return [];
    const client = getTursoClient();
    const result = await client.execute({
      sql: 'SELECT * FROM savings_goals WHERE user_email = ?;',
      args: [cleanEmail],
    });

    return result.rows.map((row) => ({
      id: String(row.id),
      title: String(row.title || ''),
      targetAmount: Number(row.target_amount) || 0,
      currentAmount: Number(row.current_amount) || 0,
      targetDate: row.target_date ? String(row.target_date) : undefined,
      notes: row.notes ? String(row.notes) : undefined,
    }));
  } catch (err) {
    console.error('Failed to fetch savings goals from Turso:', err);
    return [];
  }
}

/**
 * Syncs user currency setting to Turso.
 */
export async function syncCurrencyToTurso(
  email: string,
  currency: CurrencyCode
): Promise<void> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return;
    const client = getTursoClient();
    await client.execute({
      sql: `
        INSERT INTO user_settings (user_email, currency, theme, updated_at)
        VALUES (?, ?, 'light', ?)
        ON CONFLICT(user_email) DO UPDATE SET
          currency = excluded.currency,
          updated_at = excluded.updated_at;
      `,
      args: [cleanEmail, currency, new Date().toISOString()],
    });
  } catch (err) {
    console.error('Failed to sync currency to Turso:', err);
  }
}

/**
 * Fetches user currency setting from Turso.
 */
export async function fetchCurrencyFromTurso(email: string): Promise<CurrencyCode | null> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return null;
    const client = getTursoClient();
    const result = await client.execute({
      sql: 'SELECT currency FROM user_settings WHERE user_email = ? LIMIT 1;',
      args: [cleanEmail],
    });
    if (result.rows.length === 0) return null;
    const raw = result.rows[0].currency as CurrencyCode;
    if (['PHP', 'USD', 'EUR', 'GBP', 'JPY', 'SGD'].includes(raw)) {
      return raw;
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch currency from Turso:', err);
    return null;
  }
}

/**
 * Clears user data in Turso when user explicitly resets their account data.
 */
export async function clearTursoUserData(email: string): Promise<void> {
  try {
    const cleanEmail = normalizeEmail(email);
    if (!cleanEmail) return;
    const client = getTursoClient();
    await client.execute({
      sql: 'DELETE FROM transactions WHERE user_email = ?;',
      args: [cleanEmail],
    });
    await client.execute({
      sql: 'DELETE FROM savings_goals WHERE user_email = ?;',
      args: [cleanEmail],
    });
  } catch (err) {
    console.error('Failed to clear user data in Turso:', err);
  }
}
