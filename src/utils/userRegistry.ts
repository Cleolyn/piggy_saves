/**
 * PiggyVault User Database & Authentication Registry
 * Enforces email uniqueness, handles existing user login vs sign-up guards,
 * manages seamless account linking for Google OAuth and email/password providers,
 * and prevents duplicate account creation or data overwrites.
 */

export type AuthProviderType = 'google' | 'email_password';

export interface UserProfileRecord {
  userId: string;
  email: string; // Primary Unique Key for identification
  authProviders: AuthProviderType[];
  createdAt: string;
  lastLoginAt: string;
  isOnboarded: boolean;
  dataStorageKey: string;
  linkedAccountsCount: number;
}

const REGISTRY_STORAGE_KEY = 'piggyvault_users_registry';

/**
 * Normalizes an email address to a clean, lowercase, trimmed string.
 */
export function normalizeEmail(email: string): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Retrieves the complete registry of registered users from local persistent storage.
 */
export function getAllUsers(): Record<string, UserProfileRecord> {
  try {
    const raw = localStorage.getItem(REGISTRY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.error('Failed to load user registry:', err);
    return {};
  }
}

/**
 * Saves the updated user registry to persistent storage.
 */
function saveAllUsers(registry: Record<string, UserProfileRecord>): void {
  try {
    localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(registry));
  } catch (err) {
    console.error('Failed to save user registry:', err);
  }
}

/**
 * Checks if an account with the specified Google/primary email already exists in the database.
 */
export function findUserByEmail(email: string): UserProfileRecord | null {
  const cleanEmail = normalizeEmail(email);
  if (!cleanEmail) return null;
  const users = getAllUsers();
  return users[cleanEmail] || null;
}

/**
 * Finds a user profile by their authentication provider ID (e.g. Clerk user ID).
 */
export function findUserById(userId: string): UserProfileRecord | null {
  if (!userId) return null;
  const users = getAllUsers();
  return Object.values(users).find((u) => u.userId === userId) || null;
}

/**
 * Returns true if an account already exists for this email.
 */
export function isExistingUser(email: string): boolean {
  return findUserByEmail(email) !== null;
}

export interface RegisterOrLoginResult {
  user: UserProfileRecord;
  isNewUser: boolean;
  wasLinked: boolean;
  message: string;
}

/**
 * Primary Authentication Guard & Account Linker:
 * - Checks if an account with that email already exists.
 * - If ALREADY exists:
 *   • Does NOT recreate or register a duplicate profile.
 *   • Seamlessly links the auth provider (e.g. Google) if not already linked.
 *   • Automatically logs the user into their existing account.
 *   • Preserves all saved financial data and skips fresh-state reset.
 * - If NEW user:
 *   • Enforces uniqueness constraint and registers a new unique profile.
 */
export function registerOrLoginUser(params: {
  userId: string;
  email: string;
  provider?: AuthProviderType;
}): RegisterOrLoginResult {
  const cleanEmail = normalizeEmail(params.email);
  if (!cleanEmail) {
    throw new Error('Valid email address is required for user identification.');
  }

  const users = getAllUsers();
  const existingUser = users[cleanEmail];
  const provider = params.provider || 'google';

  if (existingUser) {
    // Account ALREADY exists: Guard against duplicate profile creation!
    let wasLinked = false;

    // Check if the provider needs to be linked to this existing account
    if (!existingUser.authProviders.includes(provider)) {
      existingUser.authProviders = [...existingUser.authProviders, provider];
      existingUser.linkedAccountsCount = existingUser.authProviders.length;
      wasLinked = true;
    }

    // Update session metadata while strictly preserving existing storage keys & data
    existingUser.lastLoginAt = new Date().toISOString();
    if (params.userId && existingUser.userId !== params.userId) {
      existingUser.userId = params.userId;
    }

    users[cleanEmail] = existingUser;
    saveAllUsers(users);

    return {
      user: existingUser,
      isNewUser: false,
      wasLinked,
      message: wasLinked
        ? 'Welcome back! Linked your Google account to your existing profile.'
        : 'Welcome back! Logged into your existing account.',
    };
  }

  // Genuinely NEW user: Enforce unique email check & create user record
  const newUser: UserProfileRecord = {
    userId: params.userId,
    email: cleanEmail,
    authProviders: [provider],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    isOnboarded: true,
    dataStorageKey: `piggyvault_user_${cleanEmail}`,
    linkedAccountsCount: 1,
  };

  users[cleanEmail] = newUser;
  saveAllUsers(users);

  return {
    user: newUser,
    isNewUser: true,
    wasLinked: false,
    message: 'Welcome to PiggyVault! Your private treasury has been initialized.',
  };
}

/**
 * Backend Uniqueness Security Guard:
 * Guarantees that `createUser` triggers run ONLY for unique emails.
 * Rejects duplicate profile creation attempts.
 */
export function createUserGuard(
  email: string,
  userId: string,
  provider: AuthProviderType = 'google'
): { success: boolean; user: UserProfileRecord; isDuplicate: boolean; error?: string } {
  const cleanEmail = normalizeEmail(email);
  const existing = findUserByEmail(cleanEmail);

  if (existing) {
    return {
      success: false,
      user: existing,
      isDuplicate: true,
      error: `Security Guard: Account with email "${cleanEmail}" already exists. Prevented duplicate registration.`,
    };
  }

  const result = registerOrLoginUser({ userId, email: cleanEmail, provider });
  return {
    success: true,
    user: result.user,
    isDuplicate: false,
  };
}

/**
 * Security Guard: Prevents existing users from triggering initial setup hooks
 * or overwriting their saved data.
 */
export function preventSetupOverwriteGuard(email: string): boolean {
  const user = findUserByEmail(email);
  if (!user) return false; // New user can run initial setup
  return user.isOnboarded === true; // Existing user is protected from reset
}
