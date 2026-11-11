import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../services/storageKeys';
import { storageService } from '../services/storageService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return storageService.get(STORAGE_KEYS.USER_ROLE, 'student');
  });

  // Mock logged-in student profile for seamless testing/one-click RSVP fill
  const [currentUser] = useState({
    name: 'Alex Rivera',
    email: 'alex.rivera@campus.edu',
    studentId: 'CS-2026-4421',
    department: 'Computer Science & Engineering',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  });

  useEffect(() => {
    storageService.set(STORAGE_KEYS.USER_ROLE, role);
  }, [role]);

  const toggleRole = () => {
    setRole((prev) => (prev === 'admin' ? 'student' : 'admin'));
  };

  const setSpecificRole = (newRole) => {
    if (newRole === 'admin' || newRole === 'student') {
      setRole(newRole);
    }
  };

  const value = {
    role,
    isAdmin: role === 'admin',
    isStudent: role === 'student',
    currentUser,
    toggleRole,
    setRole: setSpecificRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
