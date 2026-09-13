import React, { useState } from 'react';
import {
  TrendingDown,
  PiggyBank,
  Calendar,
  Tag,
  MapPin,
  FileText,
  PlusCircle,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { Transaction, TransactionType, CurrencyCode, SavingsGoal } from '../types';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_SAVINGS_CATEGORIES,
} from '../utils/sampleData';
import { toDateTimeLocalString, fromDateTimeLocalToISO, CURRENCIES } from '../utils/formatters';

interface TransactionFormProps {
  currency: CurrencyCode;
  savingsGoals: SavingsGoal[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  currency,
  savingsGoals,
  onAddTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<TransactionType>('EXPENSE');

  // Form Fields
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [dateTimeLocal, setDateTimeLocal] = useState<string>(toDateTimeLocalString());
  const [notes, setNotes] = useState<string>('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = CURRENCIES[currency]?.symbol || '₱';

  const resetForm = () => {
    setAmount('');
    setTitle('');
    setCategory('');
    setCustomCategory('');
    setDestination('');
    setDateTimeLocal(toDateTimeLocalString());
    setNotes('');
    setErrors({});
  };

  const handleTabChange = (tab: TransactionType) => {
    setActiveTab(tab);
    resetForm();
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }

    if (activeTab === 'EXPENSE') {
      if (!title.trim()) {
        newErrors.title = 'Item/Expense name is required';
      }
      const finalCat = category === 'CUSTOM' ? customCategory.trim() : category.trim();
      if (!finalCat) {
        newErrors.category = 'Please choose or enter a category';
      }
      if (!destination.trim()) {
        newErrors.destination = 'Please specify where money was spent (e.g., Store, App, Cash)';
      }
    } else {
      // SAVINGS mode
      if (!title.trim()) {
        newErrors.title = 'Goal or deposit title is required (e.g. Daily Ipon, Emergency Fund)';
      }
      if (!destination.trim()) {
        newErrors.destination = 'Please specify deposit destination (e.g. Piggy Bank, Digital Bank)';
      }
    }

    if (!dateTimeLocal) {
      newErrors.dateTimeLocal = 'Please select a date and time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const parsedAmount = parseFloat(amount);
    let finalCategory = category;
    if (activeTab === 'EXPENSE') {
      finalCategory = category === 'CUSTOM' ? customCategory.trim() : (category || 'Other Expense');
    } else {
      finalCategory = category || 'Daily Ipon';
    }

    const isoTimestamp = fromDateTimeLocalToISO(dateTimeLocal);

    onAddTransaction({
      type: activeTab,
      amount: parsedAmount,
      title: title.trim(),
      category: finalCategory,
      destination: destination.trim(),
      timestamp: isoTimestamp,
      notes: notes.trim() ? notes.trim() : undefined,
    });

    resetForm();
  };

  // Quick preset amount helper
  const addPresetAmount = (preset: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + preset));
  };

  return (
    <div className="bg-canvas rounded-xl border border-hairline shadow-xs overflow-hidden">
      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-hairline bg-surface-soft p-2 gap-2">
        <button
          type="button"
          onClick={() => handleTabChange('EXPENSE')}
          className={`flex-1 py-2.5 px-4 rounded-pill text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'EXPENSE'
              ? 'bg-canvas text-ink shadow-soft-drop border border-hairline'
              : 'text-muted hover:text-ink'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-semantic-down" />
          <span>Mode A: Log Expense</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('SAVINGS')}
          className={`flex-1 py-2.5 px-4 rounded-pill text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'SAVINGS'
              ? 'bg-canvas text-ink shadow-soft-drop border border-hairline'
              : 'text-muted hover:text-ink'
          }`}
        >
          <PiggyBank className="w-4 h-4 text-primary" />
          <span>Mode B: Piggy Bank / Ipon</span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-pill text-[10px] font-mono font-medium bg-surface-strong text-ink border border-hairline">
            +Deposit
          </span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
        {/* Banner Explaining Mode */}
        <div className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 bg-surface-soft border border-hairline text-body">
          {activeTab === 'EXPENSE' ? (
            <>
              <TrendingDown className="w-4 h-4 text-semantic-down shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Expense Logging:</strong> Deducts from liquid funds and updates daily, weekly, and monthly horizons.
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-accent-yellow shrink-0" />
              <span>
                <strong className="text-ink font-semibold">Ipon Stash Deposit:</strong> Boosts your piggy bank savings balance and tracks milestone progress.
              </span>
            </>
          )}
        </div>

        {/* Top Row: Amount & Presets */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
            {activeTab === 'EXPENSE' ? 'Amount Spent' : 'Deposit Amount'} <span className="text-primary">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted font-mono text-lg font-medium">
              {currencySymbol}
            </div>
            <input
              type="number"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              placeholder="0.00"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-ink font-mono text-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                errors.amount
                  ? 'border-semantic-down bg-rose-50/20'
                  : 'border-hairline bg-canvas'
              }`}
            />
          </div>
          {errors.amount && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.amount}</p>}

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="text-[11px] text-muted font-medium flex items-center gap-0.5 mr-1">
              <Zap className="w-3 h-3 text-muted" /> Quick:
            </span>
            {[50, 100, 200, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => addPresetAmount(val)}
                className="text-xs font-mono font-medium px-3 py-1 rounded-pill bg-surface-strong hover:bg-hairline text-ink transition-colors border border-hairline cursor-pointer"
              >
                +{val}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-xs text-muted hover:text-ink px-2 py-1 ml-auto cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mode A / Mode B Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
              {activeTab === 'EXPENSE' ? 'Item / Purchase Name' : 'Deposit Title / Goal'} <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                placeholder={
                  activeTab === 'EXPENSE'
                    ? 'e.g., Grocery stock-up, Team Lunch, Grab Taxi'
                    : 'e.g., 52-Week Ipon Challenge, Emergency Fund, Coin Jar'
                }
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                  errors.title
                    ? 'border-semantic-down bg-rose-50/20'
                    : 'border-hairline bg-canvas'
                }`}
              />
            </div>
            {errors.title && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Destination / Where */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-muted" />
              {activeTab === 'EXPENSE' ? 'Destination / Merchant / Store' : 'Vault / Storage Location'} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                if (errors.destination) setErrors((prev) => ({ ...prev, destination: '' }));
              }}
              placeholder={
                activeTab === 'EXPENSE'
                  ? 'e.g., Jollibee BGC, SM Supermarket, Maya, Cash'
                  : 'e.g., Physical Ceramic Piggy Bank, Maya Savings, Cash Box'
              }
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
                errors.destination
                  ? 'border-semantic-down bg-rose-50/20'
                  : 'border-hairline bg-canvas'
              }`}
            />
            {errors.destination && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.destination}</p>}
          </div>
        </div>

        {/* Category & Date/Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-muted" />
              Category {activeTab === 'EXPENSE' && <span className="text-primary">*</span>}
            </label>
            <select
              id="category-select"
              aria-label="Category Selection"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
              }}
              className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
            >
              <option value="">
                {activeTab === 'EXPENSE' ? '-- Select Expense Category --' : '-- Select Savings Category (Optional) --'}
              </option>
              {activeTab === 'EXPENSE' ? (
                <>
                  {DEFAULT_EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Add Custom Category...</option>
                </>
              ) : (
                <>
                  {/* Option to link to existing goal */}
                  {savingsGoals.length > 0 && (
                    <optgroup label="Your Savings Goals">
                      {savingsGoals.map((g) => (
                        <option key={g.id} value={g.title}>
                          🎯 {g.title}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="General Savings Types">
                    {DEFAULT_SAVINGS_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </optgroup>
                </>
              )}
            </select>

            {/* Custom category input if selected */}
            {category === 'CUSTOM' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name..."
                  className="w-full px-3.5 py-2 rounded-xl border border-hairline text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
            {errors.category && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.category}</p>}
          </div>

          {/* Date & Time */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted" />
                Date & Time <span className="text-primary">*</span>
              </label>
              <button
                type="button"
                onClick={() => setDateTimeLocal(toDateTimeLocalString(new Date()))}
                className="text-[11px] text-primary hover:text-primary-active font-medium underline cursor-pointer"
              >
                Set Now
              </button>
            </div>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => {
                setDateTimeLocal(e.target.value);
                if (errors.dateTimeLocal) setErrors((prev) => ({ ...prev, dateTimeLocal: '' }));
              }}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono text-ink bg-canvas focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.dateTimeLocal
                  ? 'border-semantic-down bg-rose-50/20'
                  : 'border-hairline'
              }`}
            />
            {errors.dateTimeLocal && (
              <p className="text-semantic-down text-xs mt-1 font-medium">{errors.dateTimeLocal}</p>
            )}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-muted" />
            Notes / Details <span className="text-muted font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra details, payment method, invoice info, or remarks..."
            className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full h-11 px-6 rounded-pill text-sm font-semibold text-on-primary bg-primary hover:bg-primary-active flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {activeTab === 'EXPENSE' ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Log Expense Entry</span>
              </>
            ) : (
              <>
                <PiggyBank className="w-4 h-4" />
                <span>Deposit to Piggy Bank</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
