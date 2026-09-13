import React, { useState } from 'react';
import { X, TrendingDown, PiggyBank, Calendar, MapPin, Tag, Check } from 'lucide-react';
import type { Transaction, TransactionType, CurrencyCode } from '../types';
import {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_SAVINGS_CATEGORIES,
} from '../utils/sampleData';
import {
  toDateTimeLocalString,
  fromDateTimeLocalToISO,
  CURRENCIES,
} from '../utils/formatters';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  currency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
}

interface FormInnerProps {
  transaction: Transaction;
  currency: CurrencyCode;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
}

const EditTransactionForm: React.FC<FormInnerProps> = ({
  transaction,
  currency,
  onClose,
  onSave,
}) => {
  const [type, setType] = useState<TransactionType>(transaction.type);
  const [amount, setAmount] = useState<string>(String(transaction.amount));
  const [title, setTitle] = useState<string>(transaction.title);
  const [category, setCategory] = useState<string>(transaction.category || '');
  const [destination, setDestination] = useState<string>(transaction.destination || '');
  const [dateTimeLocal, setDateTimeLocal] = useState<string>(
    transaction.timestamp
      ? toDateTimeLocalString(new Date(transaction.timestamp))
      : toDateTimeLocalString()
  );
  const [notes, setNotes] = useState<string>(transaction.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currencySymbol = CURRENCIES[currency]?.symbol || '₱';

  const validate = () => {
    const errs: Record<string, string> = {};
    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errs.amount = 'Please enter a valid amount';
    }
    if (!title.trim()) {
      errs.title = 'Title/Item name is required';
    }
    if (!destination.trim()) {
      errs.destination = 'Destination/Merchant is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(transaction.id, {
      type,
      amount: parseFloat(amount),
      title: title.trim(),
      category: category.trim() || (type === 'EXPENSE' ? 'Other Expense' : 'Daily Ipon'),
      destination: destination.trim(),
      timestamp: fromDateTimeLocalToISO(dateTimeLocal),
      notes: notes.trim() ? notes.trim() : undefined,
    });

    onClose();
  };

  return (
    <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full border border-slate-200/90 shadow-xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto pb-safe">
      {/* Header */}
      <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">Edit Transaction Entry</h3>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
            {type}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4">
        {/* Type Switcher */}
        <div className="flex rounded-xl p-1 bg-slate-100 gap-1">
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
              type === 'EXPENSE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('SAVINGS')}
            className={`flex-1 py-2 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
              type === 'SAVINGS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 active:bg-slate-200'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-primary" /> Savings / Ipon
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Amount ({currencySymbol})
          </label>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-medium text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
          />
          {errors.amount && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.amount}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Title / Description
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
          />
          {errors.title && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Destination / Where
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
          />
          {errors.destination && (
            <p className="text-rose-600 text-xs mt-1 font-medium">{errors.destination}</p>
          )}
        </div>

        {/* Category & Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
            >
              <option value="">-- Choose Category --</option>
              {(type === 'EXPENSE' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_SAVINGS_CATEGORIES).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date / Time
            </label>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => setDateTimeLocal(e.target.value)}
              className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-900 font-mono focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-xs text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none bg-white min-h-[44px]"
          />
        </div>

        {/* Actions */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer min-h-[42px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-active active:bg-primary-active transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  transaction,
  currency,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <EditTransactionForm
        transaction={transaction}
        currency={currency}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};
