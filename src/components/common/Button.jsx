import React from 'react';

const VARIANTS = {
  primary: 'bg-[#1B3A8C] hover:bg-[#152e6e] text-white border border-[#1B3A8C] active:scale-[0.99]',
  secondary: 'bg-[#2B2B2B] hover:bg-[#111111] text-white border border-[#2B2B2B] active:scale-[0.99]',
  outline: 'border border-[#E2E2E2] hover:border-[#111111] hover:bg-white text-[#111111] bg-white active:scale-[0.99]',
  ghost: 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#F0F0F0]',
  danger: 'bg-[#DC2626] hover:bg-[#b91c1c] text-white border border-[#DC2626] active:scale-[0.99]',
  success: 'bg-[#1B3A8C] hover:bg-[#152e6e] text-white border border-[#1B3A8C]',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-[2px]',
  md: 'px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-[2px]',
  lg: 'px-6 py-3 text-sm uppercase tracking-wider font-bold rounded-[2px]',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
        VARIANTS[variant] || VARIANTS.primary
      } ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
