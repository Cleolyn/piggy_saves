import type { Transaction, SavingsGoal, CurrencyCode } from '../types';
import { normalizeEmail } from './userRegistry';

const GLOBAL_KEYS = {
  TRANSACTIONS: 'piggyvault_v2_transactions',
  GOALS: 'piggyvault_v2_goals',
  CURRENCY: 'piggyvault_v2_currency',
  THEME: 'piggyvault_v2_theme',
};

/**
 * Returns partition storage keys scoped to a specific user email.
 * Falls back to global keys if no email is provided.
 */
export function getUserStorageKeys(userEmail?: string | null) {
  const cleanEmail = normalizeEmail(userEmail || '');
  if (!cleanEmail) {
    return GLOBAL_KEYS;
  }
  // Sanitize email for storage key
  const safeId = cleanEmail.replace(/[^a-z0-9_]/g, '_');
  return {
    TRANSACTIONS: `piggyvault_user_${safeId}_transactions`,
    GOALS: `piggyvault_user_${safeId}_goals`,
    CURRENCY: `piggyvault_user_${safeId}_currency`,
    THEME: `piggyvault_user_${safeId}_theme`,
  };
}

export function loadTransactions(userEmail?: string | null): Transaction[] {
  try {
    const keys = getUserStorageKeys(userEmail);
    const raw = localStorage.getItem(keys.TRANSACTIONS);
    if (!raw) {
      // Legacy migration: if user email is present and global transactions exist, migrate them
      if (userEmail) {
        const legacyRaw = localStorage.getItem(GLOBAL_KEYS.TRANSACTIONS);
        if (legacyRaw) {
          const legacyParsed = JSON.parse(legacyRaw);
          if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
            localStorage.setItem(keys.TRANSACTIONS, legacyRaw);
            return legacyParsed;
          }
        }
      }
      // First time initialization: clean fresh start
      localStorage.setItem(keys.TRANSACTIONS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load transactions from localStorage:', err);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[], userEmail?: string | null): void {
  try {
    const keys = getUserStorageKeys(userEmail);
    localStorage.setItem(keys.TRANSACTIONS, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions to localStorage:', err);
  }
}

export function loadSavingsGoals(userEmail?: string | null): SavingsGoal[] {
  try {
    const keys = getUserStorageKeys(userEmail);
    const raw = localStorage.getItem(keys.GOALS);
    if (!raw) {
      if (userEmail) {
        const legacyRaw = localStorage.getItem(GLOBAL_KEYS.GOALS);
        if (legacyRaw) {
          const legacyParsed = JSON.parse(legacyRaw);
          if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
            localStorage.setItem(keys.GOALS, legacyRaw);
            return legacyParsed;
          }
        }
      }
      localStorage.setItem(keys.GOALS, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error('Failed to load savings goals from localStorage:', err);
    return [];
  }
}

export function saveSavingsGoals(goals: SavingsGoal[], userEmail?: string | null): void {
  try {
    const keys = getUserStorageKeys(userEmail);
    localStorage.setItem(keys.GOALS, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save savings goals to localStorage:', err);
  }
}

export function loadCurrency(userEmail?: string | null): CurrencyCode {
  try {
    const keys = getUserStorageKeys(userEmail);
    const raw = localStorage.getItem(keys.CURRENCY) as CurrencyCode;
    if (raw && ['PHP', 'USD', 'EUR', 'GBP', 'JPY', 'SGD'].includes(raw)) {
      return raw;
    }
    // Fallback check on global currency
    const globalRaw = localStorage.getItem(GLOBAL_KEYS.CURRENCY) as CurrencyCode;
    if (globalRaw && ['PHP', 'USD', 'EUR', 'GBP', 'JPY', 'SGD'].includes(globalRaw)) {
      return globalRaw;
    }
  } catch {
    // fallback
  }
  return 'PHP';
}

export function saveCurrency(currency: CurrencyCode, userEmail?: string | null): void {
  try {
    const keys = getUserStorageKeys(userEmail);
    localStorage.setItem(keys.CURRENCY, currency);
  } catch (err) {
    console.error('Failed to save currency setting:', err);
  }
}

export function resetToDefaults(userEmail?: string | null): { transactions: Transaction[]; goals: SavingsGoal[] } {
  try {
    const keys = getUserStorageKeys(userEmail);
    localStorage.setItem(keys.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(keys.GOALS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to reset storage:', err);
  }
  return {
    transactions: [],
    goals: [],
  };
}

export function clearAllData(userEmail?: string | null): { transactions: Transaction[]; goals: SavingsGoal[] } {
  try {
    const keys = getUserStorageKeys(userEmail);
    localStorage.setItem(keys.TRANSACTIONS, JSON.stringify([]));
    localStorage.setItem(keys.GOALS, JSON.stringify([]));
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
  return { transactions: [], goals: [] };
}

/**
 * Export data as JSON file download
 */
export function exportToJSON(transactions: Transaction[], goals: SavingsGoal[]): void {
  const data = {
    app: 'PiggyVault',
    exportedAt: new Date().toISOString(),
    transactions,
    goals,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `piggyvault-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to CSV format
 */
export function exportToCSV(transactions: Transaction[]): void {
  const headers = ['ID', 'Type', 'Title', 'Amount', 'Category', 'Destination/Where', 'Timestamp', 'Notes'];
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.type}"`,
    `"${(t.title || '').replace(/"/g, '""')}"`,
    t.amount,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.destination || '').replace(/"/g, '""')}"`,
    `"${t.timestamp}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `piggyvault-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
