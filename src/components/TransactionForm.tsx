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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5">
        <button
          type="button"
          onClick={() => handleTabChange('EXPENSE')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'EXPENSE'
              ? 'bg-white text-rose-600 shadow-xs border border-rose-200/60 ring-1 ring-rose-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <TrendingDown className="w-4 h-4 text-rose-500" />
          <span>Mode A: Log Expense</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('SAVINGS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'SAVINGS'
              ? 'bg-white text-emerald-700 shadow-xs border border-emerald-200/60 ring-1 ring-emerald-500/10'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
          }`}
        >
          <PiggyBank className="w-4 h-4 text-emerald-600" />
          <span>Mode B: Piggy Bank / Ipon</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
            +Deposit
          </span>
        </button>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
        {/* Banner Explaining Mode */}
        <div
          className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            activeTab === 'EXPENSE'
              ? 'bg-rose-50/80 text-rose-800 border-rose-200/80'
              : 'bg-emerald-50/80 text-emerald-900 border-emerald-200/80'
          }`}
        >
          {activeTab === 'EXPENSE' ? (
            <>
              <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Expense Logging:</strong> Records spending against daily, weekly, and monthly totals with destination tracking.
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Ipon Stash Deposit:</strong> Boosts your piggy bank savings balance and tracks progress toward your goals!
              </span>
            </>
          )}
        </div>

        {/* Top Row: Amount & Presets */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            {activeTab === 'EXPENSE' ? 'Amount Spent' : 'Deposit Amount'} <span className="text-rose-500">*</span>
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-base">
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
              className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-slate-900 font-mono text-base font-semibold focus:outline-none focus:ring-2 transition-all ${
                errors.amount
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                  : activeTab === 'EXPENSE'
                  ? 'border-slate-300 focus:ring-rose-500 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
            />
          </div>
          {errors.amount && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.amount}</p>}

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-0.5 mr-1">
              <Zap className="w-3 h-3" /> Quick:
            </span>
            {[50, 100, 200, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => addPresetAmount(val)}
                className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              >
                +{val}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-[11px] text-slate-400 hover:text-slate-600 px-1 py-0.5 ml-auto"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mode A / Mode B Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {activeTab === 'EXPENSE' ? 'Item / Purchase Name' : 'Deposit Title / Goal'} <span className="text-rose-500">*</span>
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
                className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-rose-500 focus:border-rose-500'
                }`}
              />
            </div>
            {errors.title && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.title}</p>}
          </div>

          {/* Destination / Where */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {activeTab === 'EXPENSE' ? 'Destination / Merchant / Store' : 'Vault / Storage Location'} <span className="text-rose-500">*</span>
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
              className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.destination
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-rose-500 focus:border-rose-500'
              }`}
            />
            {errors.destination && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.destination}</p>}
          </div>
        </div>

        {/* Category & Date/Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category {activeTab === 'EXPENSE' && <span className="text-rose-500">*</span>}
            </label>
            <select
              id="category-select"
              aria-label="Category Selection"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (errors.category) setErrors((prev) => ({ ...prev, category: '' }));
              }}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
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
              <div className="mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            )}
            {errors.category && <p className="text-rose-600 text-xs mt-1 font-medium">{errors.category}</p>}
          </div>

          {/* Date & Time (Auto-populated, fully editable) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date & Time <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setDateTimeLocal(toDateTimeLocalString(new Date()))}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold underline"
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
              className={`w-full px-3.5 py-2 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-all ${
                errors.dateTimeLocal
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-rose-500 focus:border-rose-500'
              }`}
            />
            {errors.dateTimeLocal && (
              <p className="text-rose-600 text-xs mt-1 font-medium">{errors.dateTimeLocal}</p>
            )}
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Notes / Details <span className="text-slate-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Extra details, payment method, invoice info, or remarks..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] ${
              activeTab === 'EXPENSE'
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
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
