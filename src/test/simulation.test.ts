import { describe, it, expect, beforeEach } from 'vitest';
import type { Transaction } from '../types';
import {
  calculateAllMetrics,
  getTodayExpenses,
  getWeeklyExpenses,
  getMonthlyExpenses,
  getTotalSavings,
} from '../utils/calculations';

// Mock in-memory localStorage for test simulation
class LocalStorageMock {
  store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

const mockStorage = new LocalStorageMock();

describe('User Workflow & Simulation Loop', () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it('executes simulation: 3 expenses -> 2 savings -> delete entry -> persistence check', () => {
    let transactions: Transaction[] = [];
    const now = new Date();

    // STEP 1: Add 3 expense entries
    const expense1: Transaction = {
      id: 'sim-exp-1',
      type: 'EXPENSE',
      title: 'Morning Breakfast Combo',
      amount: 120.00,
      category: 'Food & Dining',
      destination: 'Local Bakery & Cafe',
      timestamp: now.toISOString(),
      notes: 'Coffee and toast',
    };

    const expense2: Transaction = {
      id: 'sim-exp-2',
      type: 'EXPENSE',
      title: 'Bus Fare to Downtown',
      amount: 50.00,
      category: 'Transportation',
      destination: 'City Transit Card',
      timestamp: now.toISOString(),
    };

    const expense3: Transaction = {
      id: 'sim-exp-3',
      type: 'EXPENSE',
      title: 'Pharmacy Vitamins',
      amount: 330.00,
      category: 'Healthcare',
      destination: 'Watsons Pharmacy',
      timestamp: now.toISOString(),
    };

    transactions = [expense1, expense2, expense3];
    mockStorage.setItem('piggyvault_transactions_v1', JSON.stringify(transactions));

    // Verify daily/weekly/monthly counters update correctly
    const expectedExpenseTotal = 120 + 50 + 330; // 500
    expect(getTodayExpenses(transactions, now)).toBe(expectedExpenseTotal);
    expect(getWeeklyExpenses(transactions, now)).toBe(expectedExpenseTotal);
    expect(getMonthlyExpenses(transactions, now)).toBe(expectedExpenseTotal);
    expect(getTotalSavings(transactions)).toBe(0);

    let metrics = calculateAllMetrics(transactions, now);
    expect(metrics.todayExpenses).toBe(500);
    expect(metrics.weeklyExpenses).toBe(500);
    expect(metrics.monthlyExpenses).toBe(500);
    expect(metrics.allTimeExpenses).toBe(500);
    expect(metrics.totalSavings).toBe(0);
    expect(metrics.netLiquidity).toBe(-500); // 0 savings - 500 expenses

    // STEP 2: Add 2 piggy bank savings deposits
    const savings1: Transaction = {
      id: 'sim-sav-1',
      type: 'SAVINGS',
      title: 'Coin Jar Weekly Ipon',
      amount: 1000.00,
      category: 'Piggy Bank',
      destination: 'Ceramic Piggy Bank',
      timestamp: now.toISOString(),
      notes: 'Week 1 deposit',
    };

    const savings2: Transaction = {
      id: 'sim-sav-2',
      type: 'SAVINGS',
      title: 'Emergency Stash Fund',
      amount: 2500.00,
      category: 'Emergency Fund',
      destination: 'Digital Vault Maya',
      timestamp: now.toISOString(),
      notes: 'Transferred from salary checking',
    };

    transactions = [savings2, savings1, ...transactions];
    mockStorage.setItem('piggyvault_transactions_v1', JSON.stringify(transactions));

    // Verify total savings increments accurately
    const expectedSavingsTotal = 1000 + 2500; // 3500
    expect(getTotalSavings(transactions)).toBe(expectedSavingsTotal);

    metrics = calculateAllMetrics(transactions, now);
    expect(metrics.totalSavings).toBe(3500);
    expect(metrics.todayExpenses).toBe(500);
    expect(metrics.allTimeExpenses).toBe(500);
    expect(metrics.netLiquidity).toBe(3000); // 3500 savings - 500 expenses
    // Savings rate: 3500 / (3500 + 500) = 3500 / 4000 = 87.5%
    expect(metrics.savingsRate).toBe(87.5);

    // STEP 3: Delete an entry (e.g. Bus Fare of 50) -> Verify all balance cards adjust back instantly
    transactions = transactions.filter((t) => t.id !== 'sim-exp-2');
    mockStorage.setItem('piggyvault_transactions_v1', JSON.stringify(transactions));

    const adjustedExpenseTotal = 500 - 50; // 450
    expect(getTodayExpenses(transactions, now)).toBe(adjustedExpenseTotal);
    expect(getWeeklyExpenses(transactions, now)).toBe(adjustedExpenseTotal);
    expect(getMonthlyExpenses(transactions, now)).toBe(adjustedExpenseTotal);
    expect(getTotalSavings(transactions)).toBe(3500);

    metrics = calculateAllMetrics(transactions, now);
    expect(metrics.todayExpenses).toBe(450);
    expect(metrics.netLiquidity).toBe(3050); // 3500 - 450

    // STEP 4: Reload page simulation -> Load from storage and verify all records remain intact
    const rawReloaded = mockStorage.getItem('piggyvault_transactions_v1');
    expect(rawReloaded).not.toBeNull();
    const reloadedTransactions: Transaction[] = JSON.parse(rawReloaded!);

    expect(reloadedTransactions).toHaveLength(4);
    expect(reloadedTransactions.map((t) => t.id)).toEqual([
      'sim-sav-2',
      'sim-sav-1',
      'sim-exp-1',
      'sim-exp-3',
    ]);

    const reloadedMetrics = calculateAllMetrics(reloadedTransactions, now);
    expect(reloadedMetrics.totalSavings).toBe(3500);
    expect(reloadedMetrics.todayExpenses).toBe(450);
    expect(reloadedMetrics.netLiquidity).toBe(3050);
  });
});
