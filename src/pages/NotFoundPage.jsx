import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="text-center py-24 space-y-5 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto text-2xl font-black">
        404
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-sm text-slate-500 leading-relaxed">
        The campus link you followed might be outdated or the page has been moved.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-1" />
            <span>Return Home</span>
          </Button>
        </Link>
        <Link to="/events">
          <Button variant="outline" size="md">
            <Compass className="w-4 h-4 mr-1" />
            <span>Explore Events</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
