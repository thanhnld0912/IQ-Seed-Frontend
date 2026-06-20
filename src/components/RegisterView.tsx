import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Props {
  onSuccess: () => void;
  onGoLogin: () => void;
}

export default function RegisterView({ onSuccess, onGoLogin }: Props) {
  const { register } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    try {
      await register(email, password, displayName || undefined);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl border-2 border-surface-container shadow-xl overflow-hidden"
      >
        <div className="bg-[#6bbf3a]/15 p-6 border-b border-surface-container text-center space-y-2">
          <span className="text-4xl block">🌱</span>
          <h2 className="font-heading text-xl font-black text-primary">Tạo tài khoản mới</h2>
          <p className="text-xs text-on-surface-variant font-medium">Đăng ký để bắt đầu hành trình gieo hạt giống</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl p-3">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#2d6c00]" /> Tên hiển thị
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#2d6c00]" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ban@email.com"
              required
              className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#2d6c00]" /> Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              required
              minLength={6}
              className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-extrabold text-[#404a39] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#2d6c00]" /> Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              required
              className="w-full p-3 border-2 border-outline-variant focus:border-[#2d6c00] outline-none rounded-2xl text-sm font-medium transition-all bg-[#FFFDF7]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-r from-primary-container to-primary text-white font-extrabold text-sm shadow-md hover:scale-102 transition-transform cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Đang đăng ký...' : (
              <span className="flex items-center justify-center gap-2">
                <Sprout className="w-4 h-4" /> Tạo tài khoản
              </span>
            )}
          </button>

          <p className="text-center text-xs text-on-surface-variant font-medium">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onGoLogin}
              className="text-[#2d6c00] font-extrabold hover:underline"
            >
              Đăng nhập ngay
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
