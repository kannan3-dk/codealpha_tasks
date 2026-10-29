import React, { useState } from 'react';
import { User, Mail, Phone, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { UserProfile } from '../types';
import { saveStoredUser } from '../utils/storage';

interface SignUpProps {
  onSuccess?: (user: UserProfile) => void;
  onSwitchToSignIn?: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({
  onSuccess,
  onSwitchToSignIn,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('A valid email address is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      // 1) Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || undefined,
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // 2) On successful signup
      if (data?.user) {
        const userProfile: UserProfile = {
          id: data.user.id,
          fullName: fullName.trim(),
          email: data.user.email || email.trim(),
          phone: phone.trim() || undefined,
          joinedDate: data.user.created_at || new Date().toISOString(),
        };

        saveStoredUser(userProfile);
        onSuccess?.(userProfile);

        // 3) Redirect to Home page ("/")
        window.location.href = '/';
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'An unexpected error occurred during sign up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-3.5">
      <div>
        <label htmlFor="signup-name" className="block text-xs font-medium text-[#4A5A52] mb-1">
          Full Name
        </label>
        <div className="relative">
          <input
            id="signup-name"
            type="text"
            required
            placeholder="e.g. Sanya Sharma"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
          />
          <User className="w-4 h-4 text-[#4A5A52] absolute left-3.5 top-3" />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-xs font-medium text-[#4A5A52] mb-1">
          Email Address
        </label>
        <div className="relative">
          <input
            id="signup-email"
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
        <label htmlFor="signup-phone" className="block text-xs font-medium text-[#4A5A52] mb-1">
          Phone Number (Optional)
        </label>
        <div className="relative">
          <input
            id="signup-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
          />
          <Phone className="w-4 h-4 text-[#4A5A52] absolute left-3.5 top-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-password" className="block text-xs font-medium text-[#4A5A52] mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Min 6 chars"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-3 text-[#4A5A52]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="signup-confirm-password" className="block text-xs font-medium text-[#4A5A52] mb-1">
            Confirm Password
          </label>
          <input
            id="signup-confirm-password"
            type="password"
            required
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-[#C9D9CE] rounded-full text-sm outline-none focus:border-[#3F6B52]"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full min-h-[48px] bg-[#3F6B52] text-white rounded-full text-sm font-medium hover:bg-[#2F523E] transition-all shadow-xs mt-2 disabled:opacity-60 cursor-pointer"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

      {/* Error Message under the form */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Success Message under the form */}
      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {onSwitchToSignIn && (
        <p className="text-center text-xs text-[#4A5A52] pt-1">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#3F6B52] font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
};
