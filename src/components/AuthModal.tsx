import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';
import { DEFAULT_DEMO_USER } from '../utils/storage';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotError, setForgotError] = useState('');

  if (!isOpen) return null;

  const handleDemoQuickSignIn = () => {
    onLoginSuccess(DEFAULT_DEMO_USER);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotError('Please enter a valid email address.');
      return;
    }
    setForgotSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1F2B25]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-md w-full shadow-2xl border border-[#C9D9CE] p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-3xl font-medium text-[#1F3A2D]">
            {mode === 'login' && 'Welcome back'}
            {mode === 'register' && 'Join AuraCloth'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#E1ECE4] flex items-center justify-center text-[#1F3A2D] hover:bg-[#CFE0D3] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="flex p-1 bg-[#F6F8F4] rounded-full border border-[#D9E5DC]">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                mode === 'login' ? 'bg-[#3F6B52] text-white shadow-2xs' : 'text-[#4A5A52] hover:text-[#1F2B25]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all ${
                mode === 'register' ? 'bg-[#3F6B52] text-white shadow-2xs' : 'text-[#4A5A52] hover:text-[#1F2B25]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* One-Click Quick Demo Sign In Box */}
        {mode === 'login' && (
          <div className="p-3.5 bg-[#E1ECE4] border border-[#C9D9CE] rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#2B5240] min-w-0">
              <div className="truncate">
                <span className="font-semibold block truncate">Test as Elena Vance</span>
                <span className="text-[11px] text-[#4A5A52]">elena@auracloth.com (Demo)</span>
              </div>
            </div>
            <button
              onClick={handleDemoQuickSignIn}
              className="px-3 py-1.5 bg-[#1F3A2D] text-white rounded-full text-xs font-medium hover:bg-[#3F6B52] shrink-0 transition-colors"
            >
              Quick Sign In
            </button>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
        {mode === 'login' && (
          <SignIn
            onSuccess={(user) => {
              onLoginSuccess(user);
              onClose();
            }}
            onSwitchToSignUp={() => setMode('register')}
            onForgotPassword={() => {
              setMode('forgot');
              setForgotSuccess(false);
              setForgotError('');
            }}
          />
        )}

        {/* 2. SIGN UP FORM */}
        {mode === 'register' && (
          <SignUp
            onSuccess={(user) => {
              onLoginSuccess(user);
              onClose();
            }}
            onSwitchToSignIn={() => setMode('login')}
          />
        )}

        {/* 3. FORGOT PASSWORD SIMULATION */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-[#1F2B25]">Reset Link Sent</h3>
                <p className="text-xs text-[#4A5A52] max-w-xs mx-auto">
                  If an account exists for <strong>{forgotEmail}</strong>, instructions to reset your password have been sent.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setForgotSuccess(false);
                  }}
                  className="px-6 py-2 bg-[#3F6B52] text-white rounded-full text-xs font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-[#4A5A52]">
                  Enter your registered email address and we will send you password reset instructions.
                </p>
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-medium text-[#4A5A52] mb-1">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
                  />
                  {forgotError && <p className="text-xs text-red-600 mt-1">{forgotError}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="flex-1 py-2.5 text-xs text-[#4A5A52] hover:bg-slate-100 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#3F6B52] text-white rounded-full text-xs font-medium hover:bg-[#2F523E]"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Security / Notice Footer */}
        <p className="text-[11px] text-center text-[#4A5A52]/70 pt-2 border-t border-[#D9E5DC]">
          Protected by Supabase Authentication. Your credentials are securely managed.
        </p>
      </div>
    </div>
  );
};
