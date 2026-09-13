import { describe, it, expect } from 'vitest';
import {
  getTotalSavings,
  getAllTimeExpenses,
  getTodayExpenses,
  getPast24HoursExpenses,
  getWeeklyExpenses,
  getMonthlyExpenses,
  getCurrentCalendarMonthExpenses,
  calculateAllMetrics,
  getExpenseCategoryBreakdown,
  getDailyTrends,
  roundToCents,
} from '../utils/calculations';
import type { Transaction } from '../types';

describe('Financial Calculation Utilities', () => {
  it('correctly rounds to cents avoiding floating point imprecision', () => {
    expect(roundToCents(0.1 + 0.2)).toBe(0.3);
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(100.999)).toBe(101);
  });

  it('handles empty transaction lists safely', () => {
    const empty: Transaction[] = [];
    expect(getTotalSavings(empty)).toBe(0);
    expect(getAllTimeExpenses(empty)).toBe(0);
    expect(getTodayExpenses(empty)).toBe(0);
    expect(getWeeklyExpenses(empty)).toBe(0);
    expect(getMonthlyExpenses(empty)).toBe(0);

    const metrics = calculateAllMetrics(empty);
    expect(metrics.totalSavings).toBe(0);
    expect(metrics.todayExpenses).toBe(0);
    expect(metrics.netLiquidity).toBe(0);
    expect(metrics.savingsRate).toBe(0);
  });

  it('correctly calculates total savings from SAVINGS entries only', () => {
    const txs: Transaction[] = [
      { id: '1', type: 'SAVINGS', title: 'Jar deposit', amount: 500, category: 'Piggy', destination: 'Jar', timestamp: new Date().toISOString() },
      { id: '2', type: 'EXPENSE', title: 'Food', amount: 200, category: 'Food', destination: 'Store', timestamp: new Date().toISOString() },
      { id: '3', type: 'SAVINGS', title: 'Bank deposit', amount: 1500.50, category: 'Bank', destination: 'Maya', timestamp: new Date().toISOString() },
    ];
    expect(getTotalSavings(txs)).toBe(2000.50);
  });

  it('correctly calculates all-time expenses from EXPENSE entries only', () => {
    const txs: Transaction[] = [
      { id: '1', type: 'SAVINGS', title: 'Jar', amount: 500, category: 'Piggy', destination: 'Jar', timestamp: new Date().toISOString() },
      { id: '2', type: 'EXPENSE', title: 'Food', amount: 250.25, category: 'Food', destination: 'Store', timestamp: new Date().toISOString() },
      { id: '3', type: 'EXPENSE', title: 'Coffee', amount: 140.50, category: 'Coffee', destination: 'Cafe', timestamp: new Date().toISOString() },
    ];
    expect(getAllTimeExpenses(txs)).toBe(390.75);
  });

  describe('Date Boundary Edge Cases', () => {
    const fixedDate = new Date('2026-09-13T12:00:00.000Z');

    it('calculates getTodayExpenses within same calendar date', () => {
      const txs: Transaction[] = [
        // Today at 00:01 local
        {
          id: '1',
          type: 'EXPENSE',
          title: 'Midnight snack',
          amount: 150,
          category: 'Food',
          destination: 'Convenience Store',
          timestamp: new Date(fixedDate.getFullYear(), fixedDate.getMonth(), fixedDate.getDate(), 0, 1, 0).toISOString(),
        },
        // Today at 23:59 local
        {
          id: '2',
          type: 'EXPENSE',
          title: 'Late ride',
          amount: 250,
          category: 'Transport',
          destination: 'Taxi',
          timestamp: new Date(fixedDate.getFullYear(), fixedDate.getMonth(), fixedDate.getDate(), 23, 59, 0).toISOString(),
        },
        // Yesterday at 23:58 local (should NOT be included in Today)
        {
          id: '3',
          type: 'EXPENSE',
          title: 'Yesterday dinner',
          amount: 400,
          category: 'Food',
          destination: 'Diner',
          timestamp: new Date(fixedDate.getFullYear(), fixedDate.getMonth(), fixedDate.getDate() - 1, 23, 58, 0).toISOString(),
        },
        // Tomorrow at 00:05 local (should NOT be included)
        {
          id: '4',
          type: 'EXPENSE',
          title: 'Future scheduled',
          amount: 1000,
          category: 'Bills',
          destination: 'Online',
          timestamp: new Date(fixedDate.getFullYear(), fixedDate.getMonth(), fixedDate.getDate() + 1, 0, 5, 0).toISOString(),
        },
      ];

      expect(getTodayExpenses(txs, fixedDate)).toBe(400); // 150 + 250
    });

    it('calculates getPast24HoursExpenses accurately within rolling 24-hour window', () => {
      const now = new Date('2026-09-13T12:00:00.000Z');
      const txs: Transaction[] = [
        {
          id: '1',
          type: 'EXPENSE',
          title: '3 hours ago',
          amount: 150,
          category: 'Food',
          destination: 'Store',
          timestamp: new Date(now.getTime() - 3 * 3600 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'EXPENSE',
          title: '23 hours ago',
          amount: 250,
          category: 'Transport',
          destination: 'Taxi',
          timestamp: new Date(now.getTime() - 23 * 3600 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'EXPENSE',
          title: '25 hours ago',
          amount: 500,
          category: 'Food',
          destination: 'Old Store',
          timestamp: new Date(now.getTime() - 25 * 3600 * 1000).toISOString(),
        },
      ];

      expect(getPast24HoursExpenses(txs, now)).toBe(400); // 150 + 250
    });

    it('calculates getWeeklyExpenses across 7-day window', () => {
      const txs: Transaction[] = [
        // Today
        {
          id: '1',
          type: 'EXPENSE',
          title: 'Today expense',
          amount: 100,
          category: 'A',
          destination: 'X',
          timestamp: fixedDate.toISOString(),
        },
        // 6 days ago (included in 7-day range)
        {
          id: '2',
          type: 'EXPENSE',
          title: '6 days ago',
          amount: 200,
          category: 'B',
          destination: 'Y',
          timestamp: new Date(fixedDate.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        // 8 days ago (outside 7-day range)
        {
          id: '3',
          type: 'EXPENSE',
          title: '8 days ago',
          amount: 500,
          category: 'C',
          destination: 'Z',
          timestamp: new Date(fixedDate.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      expect(getWeeklyExpenses(txs, fixedDate)).toBe(300); // 100 + 200
    });

    it('handles month transitions correctly (e.g. Aug 31 to Sep 1)', () => {
      const sep1 = new Date('2026-09-01T10:00:00.000Z');
      const aug31 = new Date(sep1.getFullYear(), 7, 31, 23, 0, 0); // Month 7 is August (0-indexed)

      const txs: Transaction[] = [
        {
          id: '1',
          type: 'EXPENSE',
          title: 'Aug 31 groceries',
          amount: 1500,
          category: 'Groceries',
          destination: 'Supermarket',
          timestamp: aug31.toISOString(),
        },
        {
          id: '2',
          type: 'EXPENSE',
          title: 'Sep 1 coffee',
          amount: 180,
          category: 'Food',
          destination: 'Cafe',
          timestamp: sep1.toISOString(),
        },
      ];

      // Weekly on Sep 1 includes Aug 31 (1 day ago)
      expect(getWeeklyExpenses(txs, sep1)).toBe(1680);
      // Today on Sep 1 only includes Sep 1
      expect(getTodayExpenses(txs, sep1)).toBe(180);
      // Calendar month expenses for September on Sep 1 only includes Sep 1
      expect(getCurrentCalendarMonthExpenses(txs, sep1)).toBe(180);
    });

    it('handles leap year leap day (Feb 29, 2028)', () => {
      const leapDay = new Date('2028-02-29T15:00:00.000Z');
      const mar1 = new Date('2028-03-01T15:00:00.000Z');

      const txs: Transaction[] = [
        {
          id: '1',
          type: 'EXPENSE',
          title: 'Leap day celebration',
          amount: 888,
          category: 'Fun',
          destination: 'Restaurant',
          timestamp: leapDay.toISOString(),
        },
      ];

      expect(getTodayExpenses(txs, leapDay)).toBe(888);
      // On March 1, Leap Day was 1 day ago so it should be in weekly expenses
      expect(getWeeklyExpenses(txs, mar1)).toBe(888);
    });
  });

  describe('Category Breakdown and Trends', () => {
    it('aggregates expenses by category with correct percentages and amounts', () => {
      const txs: Transaction[] = [
        { id: '1', type: 'EXPENSE', title: 'Lunch', amount: 300, category: 'Food', destination: 'Resto', timestamp: new Date().toISOString() },
        { id: '2', type: 'EXPENSE', title: 'Dinner', amount: 700, category: 'Food', destination: 'Resto', timestamp: new Date().toISOString() },
        { id: '3', type: 'EXPENSE', title: 'Train', amount: 200, category: 'Transport', destination: 'Station', timestamp: new Date().toISOString() },
        { id: '4', type: 'SAVINGS', title: 'Piggy', amount: 1000, category: 'Piggy', destination: 'Jar', timestamp: new Date().toISOString() },
      ];

      const breakdown = getExpenseCategoryBreakdown(txs);
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].category).toBe('Food');
      expect(breakdown[0].amount).toBe(1000);
      expect(breakdown[0].percentage).toBe(83.33); // 1000 / 1200
      expect(breakdown[0].count).toBe(2);

      expect(breakdown[1].category).toBe('Transport');
      expect(breakdown[1].amount).toBe(200);
      expect(breakdown[1].percentage).toBe(16.67);
      expect(breakdown[1].count).toBe(1);
    });

    it('generates 7-day trend items properly', () => {
      const txs: Transaction[] = [
        { id: '1', type: 'EXPENSE', title: 'Today item', amount: 50, category: 'Misc', destination: 'Shop', timestamp: new Date().toISOString() },
      ];
      const trends = getDailyTrends(txs, 7);
      expect(trends).toHaveLength(7);
      expect(trends[6].label).toBe('Today');
      expect(trends[6].expenseAmount).toBe(50);
    });
  });
});
