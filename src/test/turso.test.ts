import { describe, it, expect } from 'vitest';
import {
  TURSO_CONFIG,
  checkTursoHealth,
  initTursoSchema,
  saveUserToTurso,
  fetchUserFromTurso,
  syncTransactionsToTurso,
  fetchTransactionsFromTurso,
  syncSavingsGoalsToTurso,
  fetchSavingsGoalsFromTurso,
  syncCurrencyToTurso,
  fetchCurrencyFromTurso,
  clearTursoUserData,
} from '../utils/turso';
import type { Transaction, SavingsGoal } from '../types';

describe('Turso LibSQL Cloud Database Integration', () => {
  it('has configured Turso database URL and auth token', () => {
    expect(TURSO_CONFIG.url).toContain('turso.io');
    if (TURSO_CONFIG.authToken) {
      expect(TURSO_CONFIG.authToken.length).toBeGreaterThan(10);
    }
  });

  it('connects to Turso database and reports healthy status', async () => {
    if (!TURSO_CONFIG.authToken) return;
    const health = await checkTursoHealth();
    expect(health.connected).toBe(true);
    expect(health.database).toContain('piggyvault');
    expect(health.latencyMs).toBeGreaterThan(0);
  });

  it('initializes schema without errors', async () => {
    if (!TURSO_CONFIG.authToken) return;
    await expect(initTursoSchema()).resolves.toBeUndefined();
  });

  it('upserts and retrieves user profile to/from Turso', async () => {
    if (!TURSO_CONFIG.authToken) return;
    const testEmail = 'turso.test@piggyvault.com';
    const testUser = {
      userId: 'turso_user_1',
      email: testEmail,
      authProviders: ['google' as const],
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isOnboarded: true,
      dataStorageKey: 'piggyvault_user_turso_test',
      linkedAccountsCount: 1,
    };

    await saveUserToTurso(testUser);
    const fetched = await fetchUserFromTurso(testEmail);

    expect(fetched).not.toBeNull();
    expect(fetched?.email).toBe(testEmail);
    expect(fetched?.userId).toBe('turso_user_1');
    expect(fetched?.authProviders).toContain('google');
  });

  it('syncs transactions and savings goals to/from Turso', async () => {
    if (!TURSO_CONFIG.authToken) return;
    const testEmail = 'turso.test@piggyvault.com';
    const testTx: Transaction = {
      id: 'tx-turso-1',
      type: 'SAVINGS',
      title: 'Turso Cloud Vault Stash',
      amount: 5555,
      category: 'Piggy Bank Deposit',
      destination: 'Turso Cloud',
      timestamp: new Date().toISOString(),
      notes: 'Verified Turso persistence',
    };

    const testGoal: SavingsGoal = {
      id: 'goal-turso-1',
      title: 'Cloud Target Fund',
      targetAmount: 20000,
      currentAmount: 5555,
    };

    await syncTransactionsToTurso(testEmail, [testTx]);
    await syncSavingsGoalsToTurso(testEmail, [testGoal]);
    await syncCurrencyToTurso(testEmail, 'USD');

    const fetchedTx = await fetchTransactionsFromTurso(testEmail);
    const fetchedGoals = await fetchSavingsGoalsFromTurso(testEmail);
    const fetchedCurrency = await fetchCurrencyFromTurso(testEmail);

    expect(fetchedTx.length).toBe(1);
    expect(fetchedTx[0].title).toBe('Turso Cloud Vault Stash');
    expect(fetchedTx[0].amount).toBe(5555);

    expect(fetchedGoals.length).toBe(1);
    expect(fetchedGoals[0].title).toBe('Cloud Target Fund');

    expect(fetchedCurrency).toBe('USD');

    // Clean up test records
    await clearTursoUserData(testEmail);
    const afterClear = await fetchTransactionsFromTurso(testEmail);
    expect(afterClear.length).toBe(0);
  });
});
