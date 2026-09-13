import React from 'react';
import { SignInButton, SignUpButton } from '@clerk/react';
import { GoogleIcon } from './GoogleIcon';
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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-rose-100 selection:text-rose-900">
      {/* Top Navigation */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-primary shadow-xs">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 flex items-center gap-1">
                  Piggy<span className="text-primary font-normal">Vault</span>
                </span>
                <span className="hidden xs:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  Ipon OS
                </span>
              </div>
            </div>

            {/* Auth Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-full px-3 sm:px-4 py-2 transition-colors cursor-pointer min-h-[36px]"
                >
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-semibold text-white bg-primary hover:bg-primary-active active:bg-primary-active rounded-full px-3.5 sm:px-4 py-2 transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5 min-h-[36px]"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-[11px] sm:text-xs font-mono text-slate-600 border border-slate-200">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>INSTITUTIONAL IPON OS</span>
          <span className="text-slate-300">|</span>
          <span>PERSONAL TREASURY</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.12]">
          Personal budgeting & disciplined ipon savings, simplified.
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto leading-relaxed">
          PiggyVault is an institutional personal finance and savings companion. Track everyday
          multi-horizon expenses, cultivate disciplined saving habits with dedicated piggy bank deposits,
          and monitor milestone goals—all secured with private, client-first data control.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-lg mx-auto sm:max-w-none">
          <SignInButton mode="modal">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 active:bg-slate-100 transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2.5 min-h-[48px]"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-white bg-primary hover:bg-primary-active active:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center justify-center gap-2 min-h-[48px]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 transition-all cursor-pointer min-h-[48px] flex items-center justify-center"
            >
              Log In
            </button>
          </SignInButton>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-4 sm:pt-6 text-xs font-mono text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Zero Bank Sync Required
          </span>
          <span className="text-slate-200 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Database className="w-4 h-4 text-primary" />
            100% Private Local Storage
          </span>
          <span className="text-slate-200 hidden sm:inline">•</span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-600" />
            Protected by Clerk Auth
          </span>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-16 sm:py-24 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-2.5">
            <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
              Built for quiet, disciplined financial clarity
            </h2>
            <p className="text-sm text-slate-500 font-normal">
              Everything you need to master your personal cash flow, without noise or clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Multi-Horizon Expense Logging
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Record daily expenditures across custom categories with precise timestamps and merchant destinations. Know exactly where your money goes.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Mode A · Living Expenses
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-primary flex items-center justify-center mb-4">
                  <PiggyBank className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Dedicated Piggy Bank Ipon
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Rooted in the disciplined habit of 'ipon'—isolate designated savings deposits from everyday spendable cash flow to preserve capital.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Mode B · Capital Accumulation
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Milestone Targets & Goals
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Set monetary targets and completion dates for emergency funds, travel adventures, or big purchases. Watch your progress auto-calculate.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Dynamic Goal Milestones
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">
                  Client-Side Privacy & Export
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  Your numbers are strictly yours. All data lives in your local browser storage with zero cloud telemetry. Export to JSON or CSV anytime.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] font-mono text-slate-400">
                Zero Cloud Tracking
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Protection Walkthrough */}
      <section className="py-16 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-xs font-mono text-slate-600 border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-primary" />
            <span>AUTHENTICATION WALL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
            Protected access with a fresh start
          </h2>
          <p className="text-sm text-slate-500 font-normal">
            To protect your financial privacy, PiggyVault requires all users to authenticate before accessing dashboard tools or logging transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-center space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center font-mono font-semibold text-xs text-slate-900">
              1
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Sign In with Google or Email</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Sign in with Google or email. If an account already exists for your email, you are automatically logged into your existing vault without duplicate accounts or reset balances.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-center space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center font-mono font-semibold text-xs text-slate-900">
              2
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Zero Starting State</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              New accounts start with clean zero balances ($0.00 / ₱0.00). Existing accounts retain all previously recorded transactions and goals.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-center space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 mx-auto flex items-center justify-center font-mono font-semibold text-xs text-slate-900">
              3
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Log, Track & Prosper</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Record your daily expenses, deposit to your piggy bank, and view live cash flow analytics on your protected dashboard.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="mt-12 p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-primary mx-auto flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Ready to take control of your personal treasury?
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-normal">
            Sign up or log in with Google to access your private transaction logger, savings milestones, and cash flow analytics.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-5 py-3 rounded-full text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
              >
                <GoogleIcon className="w-4 h-4" />
                <span>Continue with Google</span>
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                className="px-6 py-3 rounded-full text-xs font-semibold text-white bg-primary hover:bg-primary-active transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Create Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-6 py-3 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
              >
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white py-10 text-xs text-slate-500 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-semibold text-slate-900">PiggyVault</span>
              <span>·</span>
              <span>Institutional Ipon & Budgeting Operating System</span>
            </div>
            <div className="text-[11px] text-slate-400 font-normal">
              Supported Currencies: PHP (₱), USD ($), EUR (€), GBP (£), JPY (¥), SGD (S$)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
