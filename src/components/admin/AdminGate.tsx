import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn, ShieldAlert, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const {
    user,
    loading,
    isAdmin,
    adminEmail,
    signInWithEmail,
    signUpWithEmail,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <ShieldAlert size={48} className="text-purple-light mx-auto mb-4" />
          <h2 className="font-display font-semibold text-xl text-white mb-3">
            Supabase Not Configured
          </h2>
          <p className="text-sm text-muted">
            Add Supabase credentials to your environment to enable the admin
            dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple/20 border-t-purple-light animate-spin" />
      </div>
    );
  }

  if (!user) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setSubmitting(true);
      const fn = mode === 'signin' ? signInWithEmail : signUpWithEmail;
      const { error } = await fn(email, password);
      setSubmitting(false);
      if (error) setAuthError(error);
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-purple/10 flex items-center justify-center mx-auto mb-6">
              <Lock size={28} className="text-purple-light" />
            </div>
            <h2 className="font-display font-semibold text-2xl text-white mb-3">
              Admin Access
            </h2>
            <p className="text-sm text-muted">
              {mode === 'signin'
                ? 'Sign in to manage your portfolio.'
                : 'Create your admin account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-input"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input"
                placeholder="Min 6 characters"
              />
            </div>

            {authError && (
              <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple to-purple-dark text-white font-medium text-sm glow-soft hover:glow-purple transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <LogIn size={18} />
              {submitting
                ? 'Please wait...'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setAuthError(null);
                }}
                className="text-xs text-muted hover:text-purple-light transition-colors"
              >
                {mode === 'signin'
                  ? "Don't have an account? Sign up"
                  : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>

          {adminEmail && (
            <p className="text-xs text-muted mt-6 flex items-center justify-center gap-1.5">
              <Mail size={14} />
              Authorized admin email: {adminEmail}
            </p>
          )}
          <p className="text-xs text-muted mt-3 text-center">
            Use the authorized email above to get admin access.
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={28} className="text-red-400" />
          </div>
          <h2 className="font-display font-semibold text-2xl text-white mb-3">
            Access Denied
          </h2>
          <p className="text-sm text-muted mb-2">
            You're signed in as{' '}
            <span className="text-white">{user.email}</span>
          </p>
          <p className="text-sm text-muted mb-8">
            This account is not authorized to access the admin dashboard.
            {adminEmail && (
              <>
                {' '}
                Only{' '}
                <span className="text-purple-light">{adminEmail}</span> can
                access this area.
              </>
            )}
          </p>
          <p className="text-xs text-muted">
            Set the authorized admin email in Website Settings.
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
