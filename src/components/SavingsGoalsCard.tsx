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
    <div className="bg-canvas rounded-xl border border-hairline shadow-xs p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
        <div>
          <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
            <Target className="w-4 h-4 text-primary" />
            Savings Goals & Ipon Targets
          </h3>
          <p className="text-xs text-muted mt-0.5">Track progress toward specific financial milestones</p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-semibold bg-surface-strong text-ink hover:bg-hairline transition-colors border border-hairline cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <Target className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted" />
            <p className="text-xs font-medium text-ink">No savings goals created yet.</p>
            <p className="text-xs text-muted mt-1">Click "New Goal" above to create an Emergency Fund, Travel Stash, or Gadget Fund.</p>
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
                className="p-4 rounded-xl border border-hairline bg-surface-soft/60 hover:bg-surface-soft transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-ink">{goal.title}</span>
                      {goal.category && (
                        <span className="text-[10px] font-mono font-medium text-muted bg-canvas px-2 py-0.5 rounded-pill border border-hairline">
                          {goal.category}
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-semibold text-semantic-up bg-canvas px-2 py-0.5 rounded-pill border border-hairline flex items-center gap-0.5">
                          <CheckCircle className="w-3 h-3 inline" /> Achieved
                        </span>
                      )}
                    </div>
                    {goal.targetDate && (
                      <p className="text-[11px] text-muted flex items-center gap-1 mt-1 font-mono">
                        <Calendar className="w-3 h-3" /> Target: {goal.targetDate}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(goal)}
                      className="p-1.5 text-muted hover:text-ink rounded-pill transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete goal "${goal.title}"?`)) {
                          onDeleteGoal(goal.id);
                        }
                      }}
                      className="p-1.5 text-muted hover:text-semantic-down rounded-pill transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5">
                  <div className="w-full bg-surface-strong rounded-pill h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-pill transition-all duration-500 ${
                        isCompleted ? 'bg-semantic-up' : 'bg-primary'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  {/* Amounts & Percentage */}
                  <div className="flex items-center justify-between text-xs mt-2 font-mono">
                    <span className="font-medium text-ink">
                      {formatCurrency(goal.currentAmount, currency)}{' '}
                      <span className="font-normal text-muted">
                        / {formatCurrency(goal.targetAmount, currency)}
                      </span>
                    </span>
                    <span
                      className={`font-semibold ${
                        isCompleted ? 'text-semantic-up' : 'text-ink'
                      }`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  {!isCompleted && remaining > 0 && (
                    <p className="text-[11px] text-muted mt-1 font-mono">
                      Need {formatCurrency(remaining, currency)} more to reach goal
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Goal Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-canvas rounded-xl max-w-md w-full shadow-soft-drop border border-hairline overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline bg-surface-soft">
              <h3 className="text-sm font-semibold text-ink flex items-center gap-1.5">
                <Target className="w-4 h-4 text-primary" />
                {editingGoalId ? 'Edit Savings Goal' : 'Create Savings Goal'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted mb-1.5">
                  Goal Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Emergency Fund, Japan Trip, Car Downpayment"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1.5">
                    Target Amount <span className="text-primary">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1.5">
                    Current Amount
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Travel, Tech, Emergency"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-muted mb-1.5">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-hairline focus:outline-none focus:ring-2 focus:ring-primary text-ink"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted hover:text-ink hover:bg-surface-strong rounded-pill cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-on-primary bg-primary hover:bg-primary-active rounded-pill shadow-xs cursor-pointer"
                >
                  {editingGoalId ? 'Save Goal' : 'Create Goal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
