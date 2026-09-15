import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mutable auth state for tests
interface MockAuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  userId: string | null;
  email?: string | null;
  externalAccounts?: Array<{ provider: string; emailAddress?: string }>;
}

let mockAuth: MockAuthState = {
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  email: 'testuser@piggyvault.com',
  externalAccounts: [],
};

// Mock @clerk/react
vi.mock('@clerk/react', () => ({
  ClerkProvider: ({ children }: { children: React.ReactNode }) => children,
  Show: ({ when, children }: { when: string; children: React.ReactNode }) => {
    if (when === 'signed-out' && !mockAuth.isSignedIn) return children;
    if (when === 'signed-in' && mockAuth.isSignedIn) return children;
    return null;
  },
  SignInButton: ({ children }: { children?: React.ReactNode }) => children || <button>Sign In</button>,
  SignUpButton: ({ children }: { children?: React.ReactNode }) => children || <button>Sign Up</button>,
  UserButton: () => <button data-testid="user-button">User</button>,
  useUser: () => ({
    isSignedIn: mockAuth.isSignedIn,
    user: mockAuth.isSignedIn
      ? {
          id: mockAuth.userId,
          primaryEmailAddress: { emailAddress: mockAuth.email || 'testuser@piggyvault.com' },
          emailAddresses: [{ emailAddress: mockAuth.email || 'testuser@piggyvault.com' }],
          externalAccounts: mockAuth.externalAccounts || [],
        }
      : null,
  }),
  useAuth: () => mockAuth,
}));

describe('PiggyVault Authentication Wall & Landing Page', () => {
  beforeEach(() => {
    localStorage.clear();
    mockAuth = {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      email: 'testuser@piggyvault.com',
      externalAccounts: [],
    };
  });

  it('renders the clean unauthenticated landing page with overview and auth triggers', () => {
    render(<App />);

    // Brand mark & title
    expect(screen.getAllByText(/Piggy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vault/i).length).toBeGreaterThan(0);

    // Clean product description and headline
    expect(
      screen.getByText(/Personal budgeting & disciplined ipon savings, simplified\./i)
    ).toBeDefined();
    expect(
      screen.getByText(/PiggyVault is an institutional personal finance and savings companion\./i)
    ).toBeDefined();

    // Informational feature cards (static overview)
    expect(screen.getByText(/Multi-Horizon Expense Logging/i)).toBeDefined();
    expect(screen.getByText(/Dedicated Piggy Bank Ipon/i)).toBeDefined();
    expect(screen.getByText(/Milestone Targets & Goals/i)).toBeDefined();
    expect(screen.getByText(/Client-Side Privacy & Export/i)).toBeDefined();

    // Sign in and Sign up triggers
    expect(screen.getAllByRole('button', { name: /Sign In/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Sign Up/i }).length).toBeGreaterThan(0);

    // Auth Wall: Interactive dashboard components must NOT be accessible to unauthenticated users
    expect(screen.queryByPlaceholderText(/0\.00/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /Log Expense Entry/i })).toBeNull();
    expect(screen.queryByText(/Treasury Horizons/i)).toBeNull();
    expect(screen.queryByText(/Historical Audit Trail/i)).toBeNull();
  });
});

describe('PiggyVault Protected Dashboard (Authenticated)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
    window.scrollTo = vi.fn();
    mockAuth = { isLoaded: true, isSignedIn: true, userId: 'user_123' };
  });

  it('initializes to a completely fresh start state with zeroes and empty lists', () => {
    render(<App />);

    // Dashboard Header and user controls
    expect(screen.getByTestId('user-button')).toBeDefined();

    // Stat cards initialize to zero
    expect(screen.getByText(/Total Ipon/i)).toBeDefined();
    expect(screen.getAllByText('₱0.00').length).toBeGreaterThan(0);

    // Rate starts at 0%
    expect(screen.getAllByText(/0%/i).length).toBeGreaterThan(0);

    // Zero sample data presence
    expect(screen.queryByText('Lunch with Colleagues')).toBeNull();
    expect(screen.queryByText('Daily Coin Jar / Ipon Deposit')).toBeNull();

    // Empty list states
    expect(screen.getByText(/No savings goals created yet\./i)).toBeDefined();
    expect(screen.getByText(/No transactions found/i)).toBeDefined();
  });

  it('allows logging an expense in Mode A and recalculates totals from zero', () => {
    render(<App />);

    // Navigate to Expense Tracking view via sidebar
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    fireEvent.click(within(sidebar).getByText('Expense Tracking'));

    // Mode A is default in Expense Tracking
    const amountInput = screen.getByPlaceholderText('0.00');
    const titleInput = screen.getByPlaceholderText(/Grocery stock-up, Team Lunch/i);
    const destinationInput = screen.getByPlaceholderText(/Jollibee BGC, SM Supermarket/i);
    const submitBtn = screen.getByRole('button', { name: /Log Expense Entry/i });

    fireEvent.change(amountInput, { target: { value: '999.00' } });
    fireEvent.change(titleInput, { target: { value: 'Emergency Hardware Tool' } });
    fireEvent.change(destinationInput, { target: { value: 'Ace Hardware Mall' } });

    // Select a category
    const categorySelect = screen.getByLabelText(/Category Selection/i);
    fireEvent.change(categorySelect, { target: { value: 'Shopping & Gear' } });

    fireEvent.click(submitBtn);

    // New expense should appear in history
    expect(screen.getByText('Emergency Hardware Tool')).toBeDefined();
    expect(screen.getByText(/Ace Hardware Mall/i)).toBeDefined();
  });

  it('allows switching to Mode B (Savings / Ipon) and depositing money to Piggy Bank', () => {
    render(<App />);

    // Navigate to Ipon Savings view via sidebar
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    fireEvent.click(within(sidebar).getByText('Ipon Savings'));

    // Form inputs
    const amountInput = screen.getByPlaceholderText('0.00');
    const titleInput = screen.getByPlaceholderText(/52-Week Ipon Challenge, Emergency Fund/i);
    const destinationInput = screen.getByPlaceholderText(/Physical Ceramic Piggy Bank/i);
    const depositBtn = screen.getByRole('button', { name: /Deposit to Piggy Bank/i });

    fireEvent.change(amountInput, { target: { value: '1500.00' } });
    fireEvent.change(titleInput, { target: { value: 'Extra Weekend Ipon Stash' } });
    fireEvent.change(destinationInput, { target: { value: 'Blue Ceramic Piggy Bank' } });

    fireEvent.click(depositBtn);

    // Record should appear in history
    expect(screen.getByText('Extra Weekend Ipon Stash')).toBeDefined();
    expect(screen.getByText(/Blue Ceramic Piggy Bank/i)).toBeDefined();
  });

  it('filters dynamically added transactions using search input', () => {
    render(<App />);

    // Navigate to Expense Tracking view via sidebar
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    fireEvent.click(within(sidebar).getByText('Expense Tracking'));

    const amountInput = screen.getByPlaceholderText('0.00');
    const titleInput = screen.getByPlaceholderText(/Grocery stock-up, Team Lunch/i);
    const destinationInput = screen.getByPlaceholderText(/Jollibee BGC, SM Supermarket/i);
    const categorySelect = screen.getByLabelText(/Category Selection/i);
    const submitBtn = screen.getByRole('button', { name: /Log Expense Entry/i });

    // Add first transaction
    fireEvent.change(amountInput, { target: { value: '120.00' } });
    fireEvent.change(titleInput, { target: { value: 'Special Jollibee Meal' } });
    fireEvent.change(destinationInput, { target: { value: 'Jollibee Drive Thru' } });
    fireEvent.change(categorySelect, { target: { value: 'Food & Dining' } });
    fireEvent.click(submitBtn);

    // Add second transaction
    fireEvent.change(amountInput, { target: { value: '500.00' } });
    fireEvent.change(titleInput, { target: { value: 'Fiber Internet Bill' } });
    fireEvent.change(destinationInput, { target: { value: 'PLDT Portal' } });
    fireEvent.change(categorySelect, { target: { value: 'Utilities & Bills' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Special Jollibee Meal')).toBeDefined();
    expect(screen.getByText('Fiber Internet Bill')).toBeDefined();

    // Filter by 'Jollibee'
    const searchInput = screen.getByPlaceholderText(/Search by title, merchant\/destination/i);
    fireEvent.change(searchInput, { target: { value: 'Jollibee' } });

    expect(screen.getByText('Special Jollibee Meal')).toBeDefined();
    expect(screen.queryByText('Fiber Internet Bill')).toBeNull();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Fiber Internet Bill')).toBeDefined();
  });

  it('supports deleting a transaction with instant update', () => {
    render(<App />);

    // Navigate to Expense Tracking view via sidebar
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    fireEvent.click(within(sidebar).getByText('Expense Tracking'));

    const amountInput = screen.getByPlaceholderText('0.00');
    const titleInput = screen.getByPlaceholderText(/Grocery stock-up, Team Lunch/i);
    const destinationInput = screen.getByPlaceholderText(/Jollibee BGC, SM Supermarket/i);
    const categorySelect = screen.getByLabelText(/Category Selection/i);
    const submitBtn = screen.getByRole('button', { name: /Log Expense Entry/i });

    // Add transaction to delete
    fireEvent.change(amountInput, { target: { value: '350.00' } });
    fireEvent.change(titleInput, { target: { value: 'Temporary Coffee Purchase' } });
    fireEvent.change(destinationInput, { target: { value: 'Starbucks Store' } });
    fireEvent.change(categorySelect, { target: { value: 'Food & Dining' } });
    fireEvent.click(submitBtn);

    expect(screen.getByText('Temporary Coffee Purchase')).toBeDefined();

    const titleElem = screen.getByText('Temporary Coffee Purchase');
    const card = titleElem.closest('.group') || titleElem.closest('div');
    expect(card).not.toBeNull();

    const deleteBtn = within(card as HTMLElement).getByTitle(/Delete entry/i);
    fireEvent.click(deleteBtn);

    expect(screen.queryByText('Temporary Coffee Purchase')).toBeNull();
  });

  it('renders mobile navigation bar and supports mobile tab switching', () => {
    render(<App />);

    // Mobile bottom navigation bar is present
    const mobileNav = screen.getByRole('navigation', { name: /Mobile Navigation/i });
    expect(mobileNav).toBeDefined();

    // Contains Activity, Analytics, Milestones, and Quick Log buttons
    expect(within(mobileNav).getByText('Activity')).toBeDefined();
    expect(within(mobileNav).getByText('Analytics')).toBeDefined();
    expect(within(mobileNav).getByText('Milestones')).toBeDefined();
    expect(within(mobileNav).getByText('Quick Log')).toBeDefined();

    // Clicking Analytics in mobile nav switches to Cash Flow Analytics
    const analyticsBtn = within(mobileNav).getByText('Analytics');
    fireEvent.click(analyticsBtn);
    expect(screen.getByText('Category Spending Breakdown')).toBeDefined();
    expect(screen.getByText('7-Day Cash Flow Dynamics')).toBeDefined();

    // Clicking Milestones in mobile nav switches to Target Milestones
    const milestonesBtn = within(mobileNav).getByText('Milestones');
    fireEvent.click(milestonesBtn);
    expect(screen.getAllByText('Target Milestones').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Treasury Health').length).toBeGreaterThanOrEqual(1);

    // Clicking Quick Log switches back to activity and focuses/targets transaction section
    const quickLogBtn = within(mobileNav).getByText('Quick Log');
    fireEvent.click(quickLogBtn);
    expect(screen.getByRole('button', { name: /Log Expense Entry/i })).toBeDefined();
  });

  it('renders features sidebar with core modules and supports navigation and mode switching', () => {
    render(<App />);

    // Desktop features sidebar is mounted
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    expect(sidebar).toBeDefined();

    // Verify all core modules are present in the sidebar
    expect(within(sidebar).getByText('Dashboard / Overview')).toBeDefined();
    expect(within(sidebar).getByText('Expense Tracking')).toBeDefined();
    expect(within(sidebar).getByText('Ipon Savings')).toBeDefined();
    expect(within(sidebar).getByText('Milestone Goals')).toBeDefined();
    expect(within(sidebar).getByText('Settings & Auth')).toBeDefined();

    // Verify data backup/storage actions in sidebar
    expect(within(sidebar).getByText('Export CSV')).toBeDefined();
    expect(within(sidebar).getByText('Export JSON Backup')).toBeDefined();
    expect(within(sidebar).getByText('Import Backup')).toBeDefined();
    expect(within(sidebar).getByText('Clear All Data')).toBeDefined();

    // Clicking 'Ipon Savings' in sidebar switches form to Mode B
    const iponFeatureBtn = within(sidebar).getByText('Ipon Savings');
    fireEvent.click(iponFeatureBtn);
    expect(screen.getByRole('button', { name: /Deposit to Piggy Bank/i })).toBeDefined();

    // Clicking 'Dashboard / Overview' in sidebar switches view to overview
    const dashboardFeatureBtn = within(sidebar).getByText('Dashboard / Overview');
    fireEvent.click(dashboardFeatureBtn);
    expect(screen.getByText('Category Spending Breakdown')).toBeDefined();

    // Clicking 'Expense Tracking' switches view back to activity in Mode A
    const expenseFeatureBtn = within(sidebar).getByText('Expense Tracking');
    fireEvent.click(expenseFeatureBtn);
    expect(screen.getByRole('button', { name: /Log Expense Entry/i })).toBeDefined();
  });

  it('supports opening and interacting with the mobile features sidebar drawer', () => {
    render(<App />);

    // Trigger mobile drawer via header menu button
    const menuBtn = screen.getByRole('button', { name: /Open Features Sidebar/i });
    expect(menuBtn).toBeDefined();

    fireEvent.click(menuBtn);

    // Mobile drawer dialog is opened
    const mobileDrawer = screen.getByRole('dialog', { name: /Mobile Features Sidebar/i });
    expect(mobileDrawer).toBeDefined();
    expect(within(mobileDrawer).getByText('Features Navigation')).toBeDefined();
    expect(within(mobileDrawer).getByText('Expense Tracking')).toBeDefined();

    // Close button dismisses the mobile drawer
    const closeBtn = within(mobileDrawer).getByRole('button', { name: /Close sidebar/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: /Mobile Features Sidebar/i })).toBeNull();
  });

  it('supports collapsing desktop sidebar into an icon rail and expanding it back', () => {
    render(<App />);

    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    expect(sidebar).toBeDefined();

    // In expanded mode, full titles are visible
    expect(within(sidebar).getByText('Dashboard / Overview')).toBeDefined();

    // Click collapse button in sidebar
    const collapseBtn = within(sidebar).getByRole('button', { name: /Collapse sidebar/i });
    fireEvent.click(collapseBtn);

    // Sidebar is now in collapsed rail mode
    const expandBtn = within(sidebar).getAllByRole('button', { name: /Expand sidebar/i })[0];
    expect(expandBtn).toBeDefined();
    // Labels are hidden in collapsed icon rail
    expect(within(sidebar).queryByText('Dashboard / Overview')).toBeNull();

    // Clicking expand button restores expanded mode
    fireEvent.click(expandBtn);
    expect(within(sidebar).getByText('Dashboard / Overview')).toBeDefined();
  });

  it('navigates cleanly across all 5 dedicated feature pages with updated header breadcrumbs', () => {
    render(<App />);

    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });

    // 1. Initial view: Dashboard / Overview
    expect(screen.getByText('Dashboard Overview')).toBeDefined();
    expect(screen.getAllByText('Treasury Horizons').length).toBeGreaterThanOrEqual(1);

    // 2. Navigate to Expense Tracking
    fireEvent.click(within(sidebar).getByText('Expense Tracking'));
    expect(screen.getAllByText('Expenses').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Log Expense Entry/i })).toBeDefined();
    expect(screen.getByText('Spending Summary')).toBeDefined();

    // 3. Navigate to Ipon Savings
    fireEvent.click(within(sidebar).getByText('Ipon Savings'));
    expect(screen.getAllByText('Savings').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Deposit to Piggy Bank/i })).toBeDefined();
    expect(screen.getByText('Savings Stash')).toBeDefined();

    // 4. Navigate to Milestone Goals
    fireEvent.click(within(sidebar).getByText('Milestone Goals'));
    expect(screen.getAllByRole('heading', { name: /Target Milestones/i }).length).toBeGreaterThanOrEqual(1);

    // 5. Navigate to Settings & Auth Management
    fireEvent.click(within(sidebar).getByText('Settings & Auth'));
    expect(screen.getByText('Settings & Auth Management')).toBeDefined();
    expect(screen.getByText('Session & Identity')).toBeDefined();
    expect(screen.getByText('Regional Currency')).toBeDefined();
    expect(screen.getByText('Data Backup & Recovery')).toBeDefined();
  });
});

describe('Google Authentication & Existing User Guard Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
  });

  it('renders prominent Continue with Google triggers on the landing page', () => {
    mockAuth = {
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      email: null,
      externalAccounts: [],
    };

    render(<App />);

    const googleButtons = screen.getAllByRole('button', { name: /Continue with Google/i });
    expect(googleButtons.length).toBeGreaterThan(0);
  });

  it('displays "Welcome back! Logged into your existing account." and preserves populated data when existing user signs in with Google', async () => {
    const existingEmail = 'existing.saver@piggyvault.com';

    // 1. Pre-seed the existing user in userRegistry and their partitioned data
    localStorage.setItem(
      'piggyvault_users_registry',
      JSON.stringify({
        [existingEmail]: {
          userId: 'user_orig_777',
          email: existingEmail,
          authProviders: ['google'],
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          isOnboarded: true,
          dataStorageKey: `piggyvault_user_${existingEmail.replace(/[^a-z0-9_]/g, '_')}`,
          linkedAccountsCount: 1,
        },
      })
    );

    // Pre-seed an existing transaction for this user
    localStorage.setItem(
      `piggyvault_user_${existingEmail.replace(/[^a-z0-9_]/g, '_')}_transactions`,
      JSON.stringify([
        {
          id: 'tx-existing-1',
          type: 'SAVINGS',
          title: 'Special Vault Deposit',
          amount: 8888,
          category: 'Piggy Bank Deposit',
          destination: 'Main Treasury',
          timestamp: new Date().toISOString(),
        },
      ])
    );

    // 2. User signs in via Google OAuth
    mockAuth = {
      isLoaded: true,
      isSignedIn: true,
      userId: 'user_orig_777',
      email: existingEmail,
      externalAccounts: [{ provider: 'google', emailAddress: existingEmail }],
    };

    render(<App />);

    // Existing user handling: Must show exact toast
    expect(
      await screen.findByText('Welcome back! Logged into your existing account.')
    ).toBeDefined();

    // Data protection: Pre-existing transactions must NOT be wiped or reset
    expect(screen.getByText('Special Vault Deposit')).toBeDefined();
    expect(screen.getAllByText('₱8,888.00').length).toBeGreaterThan(0);
  });

  it('displays user email as Primary Account, Google OAuth Linked, and Duplicate Shield in Settings', () => {
    const userEmail = 'verified.user@piggyvault.com';

    mockAuth = {
      isLoaded: true,
      isSignedIn: true,
      userId: 'clerk_user_999',
      email: userEmail,
      externalAccounts: [{ provider: 'google', emailAddress: userEmail }],
    };

    render(<App />);

    // Navigate to Settings
    const sidebar = screen.getByRole('complementary', { name: /Features Sidebar/i });
    fireEvent.click(within(sidebar).getByText('Settings & Auth'));

    // Check email as primary account
    expect(screen.getByText(userEmail)).toBeDefined();
    expect(screen.getByText('Primary Account')).toBeDefined();

    // Check Google OAuth Linked status badge
    expect(screen.getByText('Google OAuth')).toBeDefined();
    expect(screen.getAllByText('Linked').length).toBeGreaterThan(0);

    // Check Duplicate Account Shield Active indicator
    expect(screen.getByText('Duplicate Account Shield Active')).toBeDefined();
  });
});


