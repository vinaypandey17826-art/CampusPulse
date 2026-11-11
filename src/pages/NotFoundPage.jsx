import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="text-center py-24 space-y-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-[2px] bg-white border border-[#E2E2E2] text-[#1B3A8C] flex items-center justify-center mx-auto text-2xl font-mono font-bold">
        404
      </div>
      <div>
        <h2 className="text-2xl font-heading font-normal text-univ-text">Page Not Found</h2>
        <p className="text-sm text-univ-muted leading-relaxed mt-2">
          The campus link you followed might be outdated or the page has been moved.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            <Home className="w-4 h-4 mr-1.5" />
            <span>Return Home</span>
          </Button>
        </Link>
        <Link to="/events">
          <Button variant="outline" size="md">
            <Compass className="w-4 h-4 mr-1.5" />
            <span>Explore Events</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
