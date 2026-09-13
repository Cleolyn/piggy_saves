import React, { useState } from 'react';
import {
  TrendingDown,
  PiggyBank,
  Calendar,
  Tag,
  MapPin,
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
  formTab?: TransactionType;
  onFormTabChange?: (tab: TransactionType) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  currency,
  savingsGoals,
  onAddTransaction,
  formTab,
  onFormTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<TransactionType>('EXPENSE');
  const activeTab = formTab ?? internalActiveTab;

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
    setInternalActiveTab(tab);
    onFormTabChange?.(tab);
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

  const addPresetAmount = (preset: number) => {
    const current = parseFloat(amount) || 0;
    setAmount(String(current + preset));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
      {/* Sleek Segmented Mode Switcher */}
      <div className="p-3 sm:p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex bg-slate-200/60 p-1 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => handleTabChange('EXPENSE')}
            className={`flex-1 py-2.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'EXPENSE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">Mode A: Log Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('SAVINGS')}
            className={`flex-1 py-2.5 sm:py-2 px-2.5 sm:px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer min-h-[40px] ${
              activeTab === 'SAVINGS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">Mode B: Piggy Bank / Ipon</span>
          </button>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-7 space-y-5 sm:space-y-6">
        {/* Contextual Mode Explanation */}
        <div className="p-3 rounded-xl text-xs flex items-center gap-2.5 bg-slate-50 border border-slate-150 text-slate-600">
          {activeTab === 'EXPENSE' ? (
            <>
              <TrendingDown className="w-4 h-4 text-rose-500 shrink-0" />
              <span>
                <strong className="text-slate-800 font-medium">Expense Logging:</strong> Records operational outlays and updates daily/weekly spending.
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong className="text-slate-800 font-medium">Ipon Deposit:</strong> Channels savings directly to your piggy bank or target fund.
              </span>
            </>
          )}
        </div>

        {/* 1. Amount Input & Presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {activeTab === 'EXPENSE' ? 'Amount Spent' : 'Deposit Amount'}{' '}
            <span className="text-primary">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-slate-400 font-mono text-lg font-medium">
              {currencySymbol}
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              placeholder="0.00"
              className={`w-full pl-9 sm:pl-10 pr-4 py-3 rounded-xl border font-mono text-xl sm:text-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[48px] ${
                errors.amount
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.amount}</p>
          )}

          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-0.5 shrink-0 mr-0.5">
              <Zap className="w-3 h-3 text-slate-400" /> Presets:
            </span>
            {[50, 100, 200, 500, 1000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => addPresetAmount(val)}
                className="text-xs font-mono font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 active:bg-slate-300 text-slate-700 transition-colors cursor-pointer shrink-0 min-h-[32px]"
              >
                +{val}
              </button>
            ))}
            {amount && (
              <button
                type="button"
                onClick={() => setAmount('')}
                className="text-xs text-slate-400 hover:text-slate-600 active:text-slate-800 px-2.5 py-1.5 ml-auto cursor-pointer shrink-0 min-h-[32px]"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 2. Streamlined Vertical Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {activeTab === 'EXPENSE' ? 'Item / Description' : 'Deposit Title'}{' '}
              <span className="text-primary">*</span>
            </label>
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
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px] ${
                errors.title
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            />
            {errors.title && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {activeTab === 'EXPENSE' ? 'Merchant / Store' : 'Storage / Account'}{' '}
              <span className="text-primary">*</span>
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
              className={`w-full px-3.5 py-2.5 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px] ${
                errors.destination
                  ? 'border-rose-300 bg-rose-50/20 text-rose-900'
                  : 'border-slate-200 bg-white text-slate-900'
              }`}
            />
            {errors.destination && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.destination}</p>
            )}
          </div>
        </div>

        {/* 3. Category & Date/Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Category */}
          <div>
            <label
              htmlFor="category-select"
              className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5 text-slate-400" />
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer min-h-[44px]"
            >
              <option value="">
                {activeTab === 'EXPENSE'
                  ? '-- Select Expense Category --'
                  : '-- Select Savings Category (Optional) --'}
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

            {/* Custom Category Input */}
            {category === 'CUSTOM' && (
              <div className="mt-2.5">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[40px]"
                />
              </div>
            )}
            {errors.category && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.category}</p>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Timestamp <span className="text-primary">*</span>
            </label>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => {
                setDateTimeLocal(e.target.value);
                if (errors.dateTimeLocal) setErrors((prev) => ({ ...prev, dateTimeLocal: '' }));
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px]"
            />
            {errors.dateTimeLocal && (
              <p className="text-rose-600 text-xs mt-1.5 font-medium">{errors.dateTimeLocal}</p>
            )}
          </div>
        </div>

        {/* 4. Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Notes / Details <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add quick notes or receipt references..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[44px]"
          />
        </div>

        {/* 5. Contextual Action Button */}
        <div className="pt-2">
          {activeTab === 'EXPENSE' ? (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 active:scale-[0.99] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <TrendingDown className="w-4 h-4 text-rose-400" />
              <span>Log Expense Entry</span>
            </button>
          ) : (
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-active active:bg-primary-active active:scale-[0.99] transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 min-h-[48px]"
            >
              <PiggyBank className="w-4 h-4 text-white" />
              <span>Deposit to Piggy Bank</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
