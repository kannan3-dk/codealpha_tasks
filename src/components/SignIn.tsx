import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { saveStoredUser } from '../utils/storage';

interface SignInProps {
  onSuccess?: (user: UserProfile) => void;
  onSwitchToSignUp?: () => void;
  onForgotPassword?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({
  onSuccess,
  onSwitchToSignUp,
  onForgotPassword,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please provide both your email and password.');
      return;
    }

    setLoading(true);

    try {
      // 1) Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // 2) On success: save session and redirect to Home ("/")
      if (data?.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          fullName:
            data.user.user_metadata?.full_name ||
            data.user.email?.split('@')[0] ||
            'Aura Member',
          email: data.user.email || email.trim(),
          phone: data.user.phone || undefined,
          joinedDate: data.user.created_at || new Date().toISOString(),
        };

        saveStoredUser(userProfile);
        onSuccess?.(userProfile);

        // Redirect to Home page
        window.location.href = '/';
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      <div>
        <label htmlFor="signin-email" className="block text-xs font-medium text-[#4A5A52] mb-1">
          Email Address
        </label>
        <div className="relative">
          <input
            id="signin-email"
            type="email"
            required
            placeholder="yourname@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
          />
          <Mail className="w-4 h-4 text-[#4A5A52] absolute left-3.5 top-3" />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <label htmlFor="signin-password" className="font-medium text-[#4A5A52]">
            Password
          </label>
          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#3F6B52] hover:underline"
            >
              Forgot password?
            </button>
          )}
        </div>
        <div className="relative">
          <input
            id="signin-password"
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
          />
          <Lock className="w-4 h-4 text-[#4A5A52] absolute left-3.5 top-3" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-3 text-[#4A5A52] hover:text-[#1F2B25]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#4A5A52]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="accent-[#3F6B52] rounded"
          />
          <span>Remember me on this browser</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E] transition-all shadow-xs disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      {/* Error Message under the form */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {onSwitchToSignUp && (
        <p className="text-center text-xs text-[#4A5A52]">
          New to AuraCloth?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-[#3F6B52] font-semibold hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </p>
      )}
    </form>
  );
};
