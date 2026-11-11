import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, GraduationCap } from 'lucide-react';

export function RoleSwitcher() {
  const { setRole, isAdmin } = useAuth();

  return (
    <div className="flex items-center bg-[#FAFAFA] p-0.5 rounded-[2px] border border-[#E2E2E2] text-xs font-semibold">
      <button
        onClick={() => setRole('student')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors ${
          !isAdmin
            ? 'bg-white text-[#1B3A8C] font-bold border border-[#E2E2E2] shadow-none'
            : 'text-[#6B6B6B] hover:text-[#111111]'
        }`}
        title="Browse and register as a student"
      >
        <GraduationCap className="w-3.5 h-3.5" />
        <span>Student</span>
      </button>

      <button
        onClick={() => setRole('admin')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] transition-colors ${
          isAdmin
            ? 'bg-[#2B2B2B] text-white font-bold border border-[#2B2B2B]'
            : 'text-[#6B6B6B] hover:text-[#111111]'
        }`}
        title="Manage campus events"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Admin</span>
      </button>
    </div>
  );
}
