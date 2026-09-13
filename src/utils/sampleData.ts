import type { Transaction, SavingsGoal } from '../types';

/**
 * Generate relative ISO timestamp in hours or days in the past
 */
function getRelativeISO(hoursAgo: number): string {
  const d = new Date();
  d.setTime(d.getTime() - hoursAgo * 60 * 60 * 1000);
  return d.toISOString();
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Today's entries
  {
    id: 'tx-today-1',
    type: 'EXPENSE',
    title: 'Lunch with Colleagues',
    amount: 320.50,
    category: 'Food & Dining',
    destination: 'Jollibee Bonifacio High Street',
    timestamp: getRelativeISO(2), // 2 hours ago today
    notes: 'Chickenjoy meal with extra peach mango pie',
  },
  {
    id: 'tx-today-2',
    type: 'SAVINGS',
    title: 'Daily Coin Jar / Ipon Deposit',
    amount: 250.00,
    category: 'Daily Ipon',
    destination: 'Ceramic Piggy Bank (Desk)',
    timestamp: getRelativeISO(5), // 5 hours ago today
    notes: 'Leftover cash from commuting allowance',
  },
  {
    id: 'tx-today-3',
    type: 'EXPENSE',
    title: 'Grab Car to Office',
    amount: 245.00,
    category: 'Transportation',
    destination: 'GrabCar via Maya',
    timestamp: getRelativeISO(8), // 8 hours ago today
    notes: 'Morning rush commute',
  },

  // Past 2 to 6 days entries (within Weekly 7-day range)
  {
    id: 'tx-week-1',
    type: 'SAVINGS',
    title: 'Payday Savings Allocation',
    amount: 5000.00,
    category: 'Emergency Fund',
    destination: 'Maya High-Yield Savings (6% p.a.)',
    timestamp: getRelativeISO(24 * 2 + 3), // ~2 days ago
    notes: 'Standard 20% savings rule applied',
  },
  {
    id: 'tx-week-2',
    type: 'EXPENSE',
    title: 'Weekly Grocery Stock-up',
    amount: 2850.75,
    category: 'Groceries',
    destination: 'SM Hypermarket Makati',
    timestamp: getRelativeISO(24 * 3 + 4), // ~3 days ago
    notes: 'Fresh veggies, fruits, poultry, milk',
  },
  {
    id: 'tx-week-3',
    type: 'EXPENSE',
    title: 'Fiber Internet Subscription',
    amount: 1699.00,
    category: 'Utilities & Bills',
    destination: 'PLDT Home Fiber Auto-Debit',
    timestamp: getRelativeISO(24 * 4 + 6), // ~4 days ago
    notes: 'Monthly 200 Mbps plan',
  },
  {
    id: 'tx-week-4',
    type: 'SAVINGS',
    title: 'Freelance Bonus to Travel Fund',
    amount: 3500.00,
    category: 'Travel & Vacation',
    destination: 'Seabank Digital Vault',
    timestamp: getRelativeISO(24 * 5 + 2), // ~5 days ago
    notes: 'Client tip from web design side gig',
  },
  {
    id: 'tx-week-5',
    type: 'EXPENSE',
    title: 'Weekend Cinema & Popcorn',
    amount: 780.00,
    category: 'Entertainment',
    destination: 'Ayala Malls Cinema',
    timestamp: getRelativeISO(24 * 6 + 1), // ~6 days ago
    notes: 'Weekend movie with siblings',
  },

  // Past 8 to 28 days entries (within Monthly 30-day range)
  {
    id: 'tx-month-1',
    type: 'EXPENSE',
    title: 'Electricity Bill',
    amount: 3420.00,
    category: 'Utilities & Bills',
    destination: 'Meralco via GCash',
    timestamp: getRelativeISO(24 * 12), // 12 days ago
    notes: 'AC usage during hot spell',
  },
  {
    id: 'tx-month-2',
    type: 'SAVINGS',
    title: 'Mid-Month 52-Week Ipon Challenge',
    amount: 2000.00,
    category: 'Piggy Bank Challenge',
    destination: 'Wooden Vault Box',
    timestamp: getRelativeISO(24 * 15), // 15 days ago
    notes: 'Week 37 deposit target',
  },
  {
    id: 'tx-month-3',
    type: 'EXPENSE',
    title: 'Ergonomic Desk Chair',
    amount: 4299.00,
    category: 'Shopping & Gear',
    destination: 'Shopee Official Store',
    timestamp: getRelativeISO(24 * 20), // 20 days ago
    notes: 'Home office posture upgrade',
  },
  {
    id: 'tx-month-4',
    type: 'SAVINGS',
    title: 'Emergency Buffer Deposit',
    amount: 4000.00,
    category: 'Emergency Fund',
    destination: 'BPI Direct SaveUp',
    timestamp: getRelativeISO(24 * 25), // 25 days ago
    notes: 'Building up 6-month living expenses buffer',
  },
  {
    id: 'tx-month-5',
    type: 'EXPENSE',
    title: 'Prescription Vitamins & Meds',
    amount: 890.00,
    category: 'Healthcare',
    destination: 'Mercury Drug Store',
    timestamp: getRelativeISO(24 * 28), // 28 days ago
    notes: 'Vitamin C + Zinc supplement',
  },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'Emergency Fund (3 Months)',
    targetAmount: 60000,
    currentAmount: 28500,
    category: 'Safety Net',
    targetDate: '2026-12-31',
    color: 'emerald',
  },
  {
    id: 'goal-2',
    title: 'Dream Japan Trip 🌸',
    targetAmount: 50000,
    currentAmount: 18500,
    category: 'Travel',
    targetDate: '2027-04-15',
    color: 'pink',
  },
  {
    id: 'goal-3',
    title: 'New M-Series Laptop / Workstation',
    targetAmount: 45000,
    currentAmount: 22000,
    category: 'Gear',
    targetDate: '2026-11-30',
    color: 'blue',
  },
];

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Transportation',
  'Utilities & Bills',
  'Entertainment',
  'Shopping & Gear',
  'Healthcare',
  'Personal Care',
  'Education',
  'Family & Gifts',
  'Housing & Rent',
  'Other Expense',
];

export const DEFAULT_SAVINGS_CATEGORIES = [
  'Daily Ipon',
  'Emergency Fund',
  'Travel & Vacation',
  'Piggy Bank Challenge',
  'Gadget & Gear Fund',
  'Investments',
  'House Downpayment',
  'General Savings',
];
