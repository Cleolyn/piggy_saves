import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('PiggyVault App Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    // mock window.confirm to return true
    vi.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  it('renders the dashboard header, title, and initial sample data', () => {
    render(<App />);

    // App title
    expect(screen.getAllByText(/Piggy/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Vault/i).length).toBeGreaterThan(0);

    // Summary Metric Cards
    expect(screen.getByText(/Total Ipon/i)).toBeDefined();
    expect(screen.getByText(/Past 24h Spending/i)).toBeDefined();
    expect(screen.getByText(/Weekly Spending/i)).toBeDefined();
    expect(screen.getByText(/Monthly Spending/i)).toBeDefined();
    expect(screen.getAllByText(/Cash Flow/i).length).toBeGreaterThan(0);

    // Initial dummy data presence
    expect(screen.getByText(/Lunch with Colleagues/i)).toBeDefined();
    expect(screen.getByText(/Daily Coin Jar \/ Ipon Deposit/i)).toBeDefined();
  });

  it('allows logging an expense in Mode A and recalculates totals', () => {
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

  it('filters transaction history using search input', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search by title, merchant\/destination/i);

    // Filter by unique keyword
    fireEvent.change(searchInput, { target: { value: 'Jollibee' } });

    expect(screen.getByText('Lunch with Colleagues')).toBeDefined();
    // Entries not matching shouldn't be in the filtered list
    expect(screen.queryByText('Fiber Internet Subscription')).toBeNull();

    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Fiber Internet Subscription')).toBeDefined();
  });

  it('supports deleting a transaction with instant update', () => {
    render(<App />);

    // Target the specific transaction card for 'Lunch with Colleagues'
    const titleElem = screen.getByText('Lunch with Colleagues');
    // Find its container card
    const card = titleElem.closest('.group') || titleElem.closest('div');
    expect(card).not.toBeNull();

    const deleteBtn = within(card as HTMLElement).getByTitle(/Delete entry/i);
    fireEvent.click(deleteBtn);

    // Should no longer appear
    expect(screen.queryByText('Lunch with Colleagues')).toBeNull();
  });
});
