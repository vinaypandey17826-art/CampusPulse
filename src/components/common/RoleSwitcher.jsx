import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole, isAdmin } = useAuth();

  return (
    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold shadow-inner">
      <button
        onClick={() => setRole('student')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          !isAdmin
            ? 'bg-white text-brand-700 shadow-sm font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Browse and register as a student"
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Student</span>
      </button>

      <button
        onClick={() => setRole('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
          isAdmin
            ? 'bg-amber-500 text-white shadow-sm font-bold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Manage, create, and edit campus events"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
    </div>
  );
}
