import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mutable auth state for tests
let mockAuth = {
  isLoaded: true,
  isSignedIn: false,
  userId: null as string | null,
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
    user: mockAuth.isSignedIn ? { id: mockAuth.userId } : null,
  }),
  useAuth: () => mockAuth,
}));

describe('PiggyVault Authentication Wall & Landing Page', () => {
  beforeEach(() => {
    localStorage.clear();
    mockAuth = { isLoaded: true, isSignedIn: false, userId: null };
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

    // Mode A is default
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

    // Click Mode B tab
    const savingsTabBtn = screen.getByRole('button', { name: /Mode B: Piggy Bank \/ Ipon/i });
    fireEvent.click(savingsTabBtn);

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
});
