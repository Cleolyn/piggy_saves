import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Calendar,
  X,
} from 'lucide-react';
import type { SavingsGoal, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface SavingsGoalsCardProps {
  goals: SavingsGoal[];
  currency: CurrencyCode;
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalsCard: React.FC<SavingsGoalsCardProps> = ({
  goals,
  currency,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Goal Form State
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [category, setCategory] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const openCreateModal = () => {
    setEditingGoalId(null);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    setCategory('');
    setTargetDate('');
    setIsModalOpen(true);
  };

  const openEditModal = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setTitle(goal.title);
    setTargetAmount(String(goal.targetAmount));
    setCurrentAmount(String(goal.currentAmount));
    setCategory(goal.category || '');
    setTargetDate(goal.targetDate || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    if (editingGoalId) {
      onUpdateGoal(editingGoalId, {
        title: title.trim(),
        targetAmount: parseFloat(targetAmount) || 0,
        currentAmount: parseFloat(currentAmount) || 0,
        category: category.trim() || undefined,
        targetDate: targetDate || undefined,
      });
    } else {
      onAddGoal({
        title: title.trim(),
        targetAmount: parseFloat(targetAmount) || 0,
        currentAmount: parseFloat(currentAmount) || 0,
        category: category.trim() || undefined,
        targetDate: targetDate || undefined,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 space-y-5 sm:space-y-6 shadow-xs">
      {/* Header with Contextual Action */}
      <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Savings Goals
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Track progress toward your personal savings targets
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-full text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 transition-all cursor-pointer shadow-xs min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-3.5">
        {goals.length === 0 ? (
          <div className="py-12 text-center px-4 rounded-xl bg-slate-50/60 border border-dashed border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2.5">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-700">No savings goals created yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-normal">
              Click "New Goal" above to create an Emergency Fund, Travel Stash, or Gadget Fund.
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.min(
              100,
              Math.max(0, Math.round((goal.currentAmount / goal.targetAmount) * 100) || 0)
            );
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
            const isCompleted = percentage >= 100;

            return (
              <div
                key={goal.id}
                className="p-3.5 sm:p-4 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-slate-50/80 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{goal.title}</span>
                      {goal.category && (
                        <span className="text-[10px] font-mono font-medium text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          {goal.category}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 inline" /> Achieved
                        </span>
                      )}
                    </div>
                    {goal.targetDate && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                        <Calendar className="w-3 h-3 text-slate-400" /> Target: {goal.targetDate}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(goal)}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white active:bg-slate-200 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Edit goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete goal "${goal.title}"?`)) {
                          onDeleteGoal(goal.id);
                        }
                      }}
                      className="p-2 sm:p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white active:bg-rose-50 rounded-lg transition-colors cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Delete goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1 font-mono">
                    <span className="text-slate-600 font-medium">
                      {formatCurrency(goal.currentAmount, currency)}
                    </span>
                    <span className="text-slate-400">
                      Goal: {formatCurrency(goal.targetAmount, currency)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                    <span className="font-semibold text-slate-700">{percentage}% funded</span>
                    <span>
                      {isCompleted
                        ? 'Target reached!'
                        : `${formatCurrency(remaining, currency)} remaining`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Goal Modal (Bottom Sheet on Mobile, Centered on Desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto pb-safe animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">
                {editingGoalId ? 'Edit Savings Goal' : 'Create New Savings Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 active:bg-slate-100 rounded-lg min-w-[32px] min-h-[32px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Emergency Fund, Japan Trip"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Amount <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="1"
                    required
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Balance
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="any"
                    min="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Safety Net, Travel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors min-h-[42px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-active active:bg-primary-active transition-colors shadow-xs min-h-[42px]"
                >
                  {editingGoalId ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
