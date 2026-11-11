import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-[#6B6B6B] mb-6 font-medium">
      <Link to="/" className="hover:text-[#1B3A8C] transition-colors">
        Home
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;

        return (
          <React.Fragment key={idx}>
            <span className="text-[#A3A3A3]">/</span>
            {isLast || !item.to ? (
              <span className="text-[#111111] font-semibold">{item.label}</span>
            ) : (
              <Link to={item.to} className="hover:text-[#1B3A8C] transition-colors">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
