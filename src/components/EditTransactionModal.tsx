import React, { useState } from 'react';
import { X, Check, TrendingDown, PiggyBank, Calendar, MapPin, Tag, FileText } from 'lucide-react';
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
      errs.destination = 'Destination is required';
    }
    if (!dateTimeLocal) {
      errs.dateTimeLocal = 'Date & time is required';
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
    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Edit Transaction Entry</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              type === 'EXPENSE'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {type}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-xl p-1 bg-slate-100 gap-1">
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              type === 'EXPENSE'
                ? 'bg-white text-rose-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('SAVINGS')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              type === 'SAVINGS'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5" /> Savings / Ipon
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Amount ({currencySymbol})
          </label>
          <input
            type="number"
            step="any"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          {errors.amount && <p className="text-rose-600 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Title / Description
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Destination / Where
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
          {errors.destination && <p className="text-rose-600 text-xs mt-1">{errors.destination}</p>}
        </div>

        {/* Category & Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-slate-400" /> Category
            </label>
            <input
              type="text"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <datalist id="category-suggestions">
              {(type === 'EXPENSE' ? DEFAULT_EXPENSE_CATEGORIES : DEFAULT_SAVINGS_CATEGORIES).map(
                (c) => (
                  <option key={c} value={c} />
                )
              )}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => setDateTimeLocal(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            {errors.dateTimeLocal && (
              <p className="text-rose-600 text-xs mt-1">{errors.dateTimeLocal}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-slate-400" /> Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" /> Save Changes
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <EditTransactionForm
        key={transaction.id}
        transaction={transaction}
        currency={currency}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
};
