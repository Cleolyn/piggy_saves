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
    <div className="bg-canvas rounded-xl max-w-lg w-full shadow-soft-drop border border-hairline overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-ink">Edit Transaction Entry</h3>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-pill uppercase tracking-wider bg-surface-strong text-muted border border-hairline">
            {type}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-muted hover:text-ink p-1 rounded-pill hover:bg-surface-strong transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="p-6 space-y-4">
        {/* Type Toggle */}
        <div className="flex rounded-pill p-1 bg-surface-strong gap-1">
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-1.5 rounded-pill text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'EXPENSE'
                ? 'bg-canvas text-ink shadow-soft-drop border border-hairline'
                : 'text-muted hover:text-ink'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-semantic-down" /> Expense
          </button>
          <button
            type="button"
            onClick={() => setType('SAVINGS')}
            className={`flex-1 py-1.5 rounded-pill text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              type === 'SAVINGS'
                ? 'bg-canvas text-ink shadow-soft-drop border border-hairline'
                : 'text-muted hover:text-ink'
            }`}
          >
            <PiggyBank className="w-3.5 h-3.5 text-primary" /> Savings / Ipon
          </button>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Amount ({currencySymbol})
          </label>
          <input
            type="number"
            step="any"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-hairline font-mono font-medium text-ink focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none bg-canvas"
          />
          {errors.amount && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.amount}</p>}
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5">
            Title / Description
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none bg-canvas"
          />
          {errors.title && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-muted" />
            Destination / Where
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none bg-canvas"
          />
          {errors.destination && <p className="text-semantic-down text-xs mt-1 font-medium">{errors.destination}</p>}
        </div>

        {/* Category & Timestamp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-muted" /> Category
            </label>
            <input
              type="text"
              list="category-suggestions"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink focus:ring-2 focus:ring-primary focus:outline-none bg-canvas"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-muted" /> Date & Time
            </label>
            <input
              type="datetime-local"
              value={dateTimeLocal}
              onChange={(e) => setDateTimeLocal(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-hairline text-xs font-mono text-ink focus:ring-2 focus:ring-primary focus:outline-none bg-canvas"
            />
            {errors.dateTimeLocal && (
              <p className="text-semantic-down text-xs mt-1 font-medium">{errors.dateTimeLocal}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1.5 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-muted" /> Notes
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-hairline text-sm text-ink focus:ring-2 focus:ring-primary focus:outline-none bg-canvas"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-hairline">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink hover:bg-surface-strong rounded-pill transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-active rounded-pill shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
