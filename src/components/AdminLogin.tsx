import { useState, FormEvent } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminLoginProps {
  onLogin: (password: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter password');
      return;
    }
    onLogin(password);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-effect rounded-2xl p-8 border border-white/10 animate-scale-in">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6 relative">
            <div className="absolute inset-0 bg-white/30 blur-3xl animate-pulse"></div>
            <div className="relative bg-white p-4 rounded-full">
              <Lock size={48} className="text-black" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white text-center mb-2">
            Admin Access
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Enter your password to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className={cn(
                    "w-full px-4 py-3 pr-12 rounded-xl",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2",
                    "focus:ring-white/50",
                    "transition-all duration-300"
                  )}
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-black",
                "bg-white border border-gray-300",
                "hover:bg-gray-200",
                "transition-all duration-300 hover:scale-[1.02]",
                "shadow-lg shadow-white/30"
              )}
            >
              Access Admin Panel
            </button>
          </form>

          <p className="text-gray-500 text-xs text-center mt-6">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
