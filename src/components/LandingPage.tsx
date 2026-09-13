import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/react';
import {
  PiggyBank,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Target,
  Lock,
  Sparkles,
  Database,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-hairline bg-canvas/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-surface-strong border border-hairline flex items-center justify-center text-primary shadow-xs">
                <PiggyBank className="w-4.5 h-4.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold tracking-tight text-ink flex items-center gap-1.5">
                  Piggy<span className="text-primary font-normal">Vault</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-pill font-medium bg-surface-strong text-ink tracking-wider uppercase border border-hairline">
                  Ipon OS
                </span>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold text-ink hover:text-body-strong bg-surface-strong hover:bg-hairline/70 border border-hairline rounded-pill px-4 py-2 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold text-on-primary bg-primary hover:bg-primary-active rounded-pill px-4 py-2 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Signature Dark Editorial Hero */}
      <section className="bg-surface-dark text-on-dark border-b border-surface-dark-elevated overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-pill bg-surface-dark-elevated border border-white/10 text-xs font-mono text-on-dark-soft">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-subtle" />
            <span>INSTITUTIONAL IPON OS</span>
            <span className="text-white/20">|</span>
            <span>PERSONAL TREASURY</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1] max-w-3xl mx-auto">
            Personal budgeting & disciplined ipon savings, simplified.
          </h1>

          {/* Clear Description of What the Website Does */}
          <p className="text-base sm:text-lg text-on-dark-soft font-normal max-w-2xl mx-auto leading-relaxed">
            PiggyVault is an institutional personal finance and savings companion. Track everyday
            multi-horizon expenses, cultivate disciplined saving habits with dedicated piggy bank deposits,
            and monitor milestone goals—all secured with private, client-first data control.
          </p>

          {/* Primary Call-to-Actions (Prompt to Sign In / Sign Up) */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="px-7 py-3.5 rounded-pill text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <span>Get Started — Fresh Slate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-7 py-3.5 rounded-pill text-sm font-semibold text-white bg-surface-dark-elevated hover:bg-white/10 border border-white/15 transition-all cursor-pointer"
              >
                Log In to Existing Vault
              </button>
            </SignInButton>
          </div>

          {/* Trust Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-on-dark-soft">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Bank Sync Required
            </span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Database className="w-4 h-4 text-primary" />
              100% Private Local Storage
            </span>
            <span className="text-white/20">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              Protected by Clerk Auth
            </span>
          </div>
        </div>
      </section>

      {/* Feature Capabilities (Static Informational Cards - NO Interactive Widgets) */}
      <section className="py-20 sm:py-24 bg-canvas border-b border-hairline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-ink">
              Built for quiet, disciplined financial clarity
            </h2>
            <p className="text-sm text-muted">
              Everything you need to master your personal cash flow and build lasting savings habits, without noise or clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-surface-soft/60 border border-hairline hover:border-hairline/80 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-strong border border-hairline flex items-center justify-center text-semantic-down mb-4">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
                  Multi-Horizon Expense Logging
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Record daily expenditures across custom categories with precise timestamps and merchant destinations. Know exactly where your money goes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline text-[11px] font-mono text-muted">
                Mode A · Living Expenses
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-surface-soft/60 border border-hairline hover:border-hairline/80 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-strong border border-hairline flex items-center justify-center text-primary mb-4">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
                  Dedicated Piggy Bank Ipon
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Rooted in the disciplined habit of 'ipon'—isolate designated savings deposits from everyday spendable cash flow to preserve capital.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline text-[11px] font-mono text-muted">
                Mode B · Capital Accumulation
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-surface-soft/60 border border-hairline hover:border-hairline/80 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-strong border border-hairline flex items-center justify-center text-blue-500 mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
                  Milestone Targets & Goals
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Set monetary targets and completion dates for emergency funds, travel adventures, or big purchases. Watch your progress auto-calculate.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline text-[11px] font-mono text-muted">
                Dynamic Goal Milestones
              </div>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-surface-soft/60 border border-hairline hover:border-hairline/80 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-strong border border-hairline flex items-center justify-center text-emerald-500 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
                  Client-Side Privacy & Export
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Your numbers are strictly yours. All data lives in your local browser storage with zero cloud telemetry. Export to JSON or CSV anytime.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-hairline text-[11px] font-mono text-muted">
                Zero Cloud Tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Protection & How It Works */}
      <section className="py-20 sm:py-24 bg-surface-soft/40 border-b border-hairline">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-surface-strong text-xs font-mono text-muted border border-hairline">
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>AUTHENTICATION WALL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-ink">
              Protected access with a fresh start
            </h2>
            <p className="text-sm text-muted">
              To protect your financial privacy, PiggyVault requires all users to authenticate before accessing dashboard tools or logging transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-canvas p-6 rounded-2xl border border-hairline text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-surface-strong mx-auto flex items-center justify-center font-mono font-bold text-sm text-primary">
                1
              </div>
              <h4 className="text-sm font-semibold text-ink">Sign Up or Log In</h4>
              <p className="text-xs text-muted leading-relaxed">
                Create an account or sign in securely via Clerk in seconds using your email or social credentials.
              </p>
            </div>

            <div className="bg-canvas p-6 rounded-2xl border border-hairline text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-surface-strong mx-auto flex items-center justify-center font-mono font-bold text-sm text-primary">
                2
              </div>
              <h4 className="text-sm font-semibold text-ink">Zero Starting State</h4>
              <p className="text-xs text-muted leading-relaxed">
                New accounts start with clean zero balances ($0.00 / ₱0.00). No pre-filled dummy data or sample distractions.
              </p>
            </div>

            <div className="bg-canvas p-6 rounded-2xl border border-hairline text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-surface-strong mx-auto flex items-center justify-center font-mono font-bold text-sm text-primary">
                3
              </div>
              <h4 className="text-sm font-semibold text-ink">Log, Track & Prosper</h4>
              <p className="text-xs text-muted leading-relaxed">
                Record your daily expenses, deposit to your piggy bank, and view live cash flow analytics on your protected dashboard.
              </p>
            </div>
          </div>

          {/* Auth Gate Callout */}
          <div className="mt-12 p-8 rounded-2xl bg-canvas border border-hairline text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-ink">
              Ready to take control of your personal treasury?
            </h3>
            <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
              Sign up today to access the transaction logger, savings milestone targets, and cash flow analytics.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="px-6 py-3 rounded-pill text-xs font-semibold text-on-primary bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Create Your Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="px-6 py-3 rounded-pill text-xs font-semibold text-ink hover:text-body-strong bg-surface-strong hover:bg-hairline/70 border border-hairline transition-all cursor-pointer"
                >
                  Sign In to Your Account
                </button>
              </SignInButton>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer Dark CTA Band */}
      <section className="bg-surface-dark text-on-dark py-16 sm:py-20 border-t border-surface-dark-elevated">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-white">
            Begin your journey to financial discipline.
          </h2>
          <p className="text-sm text-on-dark-soft max-w-lg mx-auto font-normal">
            Every transaction logged with exact timestamps, instant local persistence, and multi-horizon cash flow analytics.
          </p>
          <div className="pt-2">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="px-7 py-3.5 rounded-pill text-sm font-semibold text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <span>Start Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline bg-canvas py-10 text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-semibold text-ink">PiggyVault</span>
              <span>·</span>
              <span>Institutional Ipon & Budgeting Operating System</span>
            </div>
            <div className="text-[11px] text-muted font-normal">
              Supported Currencies: PHP (₱), USD ($), EUR (€), GBP (£), JPY (¥), SGD (S$)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
