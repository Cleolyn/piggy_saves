import { describe, it, expect, beforeEach } from 'vitest';
import {
  normalizeEmail,
  findUserByEmail,
  findUserById,
  isExistingUser,
  registerOrLoginUser,
  createUserGuard,
  preventSetupOverwriteGuard,
  getAllUsers,
} from '../utils/userRegistry';
import {
  loadTransactions,
  saveTransactions,
  loadSavingsGoals,
  saveSavingsGoals,
} from '../utils/storage';
import type { Transaction, SavingsGoal } from '../types';

describe('User Database & Authentication Registry (userRegistry.ts)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('normalizeEmail', () => {
    it('normalizes email addresses to trimmed lowercase strings', () => {
      expect(normalizeEmail('  Test.User@Example.COM  ')).toBe('test.user@example.com');
      expect(normalizeEmail('user@GMAIL.com')).toBe('user@gmail.com');
      expect(normalizeEmail('')).toBe('');
    });
  });

  describe('registerOrLoginUser - New vs Existing User Guard', () => {
    it('creates a new user profile on first registration with email as primary unique key', () => {
      const result = registerOrLoginUser({
        userId: 'clerk_user_1',
        email: 'investor@piggyvault.com',
        provider: 'google',
      });

      expect(result.isNewUser).toBe(true);
      expect(result.wasLinked).toBe(false);
      expect(result.user.email).toBe('investor@piggyvault.com');
      expect(result.user.authProviders).toEqual(['google']);
      expect(result.user.isOnboarded).toBe(true);
      expect(result.user.linkedAccountsCount).toBe(1);

      const savedUser = findUserByEmail('investor@piggyvault.com');
      expect(savedUser).not.toBeNull();
      expect(savedUser?.userId).toBe('clerk_user_1');

      expect(isExistingUser('investor@piggyvault.com')).toBe(true);
      expect(isExistingUser('nonexistent@domain.com')).toBe(false);

      const byId = findUserById('clerk_user_1');
      expect(byId?.email).toBe('investor@piggyvault.com');
    });

    it('automatically logs in existing user and prevents duplicate account creation', () => {
      // 1. Initial registration
      const firstResult = registerOrLoginUser({
        userId: 'clerk_user_orig',
        email: 'saver@gmail.com',
        provider: 'google',
      });
      expect(firstResult.isNewUser).toBe(true);

      const usersBefore = Object.keys(getAllUsers());
      expect(usersBefore.length).toBe(1);

      // 2. Subsequent sign-in or sign-up attempt with the same email
      const secondResult = registerOrLoginUser({
        userId: 'clerk_user_orig',
        email: 'SAVER@GMAIL.COM', // Different casing
        provider: 'google',
      });

      expect(secondResult.isNewUser).toBe(false);
      expect(secondResult.wasLinked).toBe(false);
      expect(secondResult.message).toBe('Welcome back! Logged into your existing account.');

      // Registry still has exactly 1 user profile
      const usersAfter = Object.keys(getAllUsers());
      expect(usersAfter.length).toBe(1);
    });

    it('links Google OAuth provider to an existing email/password account seamlessly', () => {
      // 1. User originally registered via email & password
      const firstResult = registerOrLoginUser({
        userId: 'clerk_pwd_user',
        email: 'alex@company.org',
        provider: 'email_password',
      });
      expect(firstResult.isNewUser).toBe(true);
      expect(firstResult.user.authProviders).toEqual(['email_password']);

      // 2. User clicks "Continue with Google" with the same email address
      const secondResult = registerOrLoginUser({
        userId: 'clerk_google_user',
        email: 'alex@company.org',
        provider: 'google',
      });

      expect(secondResult.isNewUser).toBe(false);
      expect(secondResult.wasLinked).toBe(true);
      expect(secondResult.user.authProviders).toEqual(['email_password', 'google']);
      expect(secondResult.user.linkedAccountsCount).toBe(2);
      expect(secondResult.message).toBe(
        'Welcome back! Linked your Google account to your existing profile.'
      );

      // Verify persistence
      const alexProfile = findUserByEmail('alex@company.org');
      expect(alexProfile?.authProviders).toContain('google');
      expect(alexProfile?.authProviders).toContain('email_password');
    });
  });

  describe('Security Guards', () => {
    it('createUserGuard rejects duplicate account registration attempts for existing email', () => {
      registerOrLoginUser({
        userId: 'clerk_101',
        email: 'existing@domain.com',
        provider: 'google',
      });

      const guardResult = createUserGuard('EXISTING@domain.com', 'clerk_999', 'google');
      expect(guardResult.success).toBe(false);
      expect(guardResult.isDuplicate).toBe(true);
      expect(guardResult.error).toContain('Account with email "existing@domain.com" already exists');
    });

    it('preventSetupOverwriteGuard protects existing onboarded users from data resets', () => {
      expect(preventSetupOverwriteGuard('newuser@domain.com')).toBe(false);

      registerOrLoginUser({
        userId: 'clerk_202',
        email: 'protected@domain.com',
        provider: 'google',
      });

      expect(preventSetupOverwriteGuard('protected@domain.com')).toBe(true);
    });
  });

  describe('Data Vault Partitioning per User Email', () => {
    it('partitions financial ledger data isolated to specific user email', () => {
      const emailA = 'alice@piggyvault.com';
      const emailB = 'bob@piggyvault.com';

      const txA: Transaction = {
        id: 'tx-1',
        type: 'EXPENSE',
        amount: 250,
        title: "Alice's Coffee",
        category: 'Food & Dining',
        destination: 'Café',
        timestamp: new Date().toISOString(),
      };

      const txB: Transaction = {
        id: 'tx-2',
        type: 'SAVINGS',
        amount: 1000,
        title: "Bob's Piggy Deposit",
        category: 'Piggy Bank Deposit',
        destination: 'Piggy Bank Vault',
        timestamp: new Date().toISOString(),
      };

      saveTransactions([txA], emailA);
      saveTransactions([txB], emailB);

      const goalA: SavingsGoal = {
        id: 'g-1',
        title: "Alice's Laptop Fund",
        targetAmount: 50000,
        currentAmount: 15000,
      };
      saveSavingsGoals([goalA], emailA);

      const loadedA = loadTransactions(emailA);
      const loadedB = loadTransactions(emailB);

      expect(loadedA.length).toBe(1);
      expect(loadedA[0].title).toBe("Alice's Coffee");

      expect(loadedB.length).toBe(1);
      expect(loadedB[0].title).toBe("Bob's Piggy Deposit");

      const loadedGoalsA = loadSavingsGoals(emailA);
      const loadedGoalsB = loadSavingsGoals(emailB);
      expect(loadedGoalsA.length).toBe(1);
      expect(loadedGoalsA[0].title).toBe("Alice's Laptop Fund");
      expect(loadedGoalsB.length).toBe(0);
    });
  });
});
