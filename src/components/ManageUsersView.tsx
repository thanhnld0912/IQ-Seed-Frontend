import React, { useEffect, useState } from 'react';
import { Users, RefreshCw, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi, AuthUser } from '../api/auth';

type UserRow = AuthUser & { createdAt: string | null };

export default function ManageUsersView() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await authApi.listUsers(token);
      setUsers(res.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải danh sách');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [token]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#6bbf3a]/15 rounded-2xl flex items-center justify-center">
            <Users className="w-5 h-5 text-[#2d6c00]" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-black text-on-surface">Quản lý người dùng</h1>
            <p className="text-xs text-on-surface-variant font-medium">
              {loading ? 'Đang tải...' : `${users.length} tài khoản`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="p-2.5 rounded-full bg-surface-container hover:bg-[#6bbf3a]/15 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#2d6c00] ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-2xl p-4 mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-3xl border border-surface-container shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-3 bg-[#f5f3ee] text-[10px] font-black uppercase tracking-wider text-on-surface-variant border-b border-surface-container">
          <span>Tên</span>
          <span>Email</span>
          <span>Vai trò</span>
          <span>Ngày tạo</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-on-surface-variant text-sm font-medium">Đang tải...</div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-on-surface-variant text-sm font-medium">Chưa có người dùng nào</div>
        ) : (
          users.map((u) => (
            <div
              key={u.uid}
              className="grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-4 border-b border-surface-container last:border-0 hover:bg-[#FFFDF7] transition-colors items-center"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[#6bbf3a]/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#2d6c00]" />
                </div>
                <span className="text-sm font-bold text-on-surface truncate">
                  {u.displayName ?? '—'}
                </span>
              </div>

              <span className="text-sm text-on-surface-variant font-medium truncate">{u.email}</span>

              <span>
                {u.role === 'admin' ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#6bbf3a]/15 text-[#2d6c00] text-[10px] font-black uppercase">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  <span className="inline-flex px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-black uppercase">
                    User
                  </span>
                )}
              </span>

              <span className="text-xs text-on-surface-variant font-medium">
                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '—'}
              </span>
            </div>
          ))
        )}
      </div>

      <p className="text-center text-[11px] text-on-surface-variant font-medium mt-4">
        Demo — chức năng chỉnh sửa / xóa sẽ được thêm sau
      </p>
    </div>
  );
}
