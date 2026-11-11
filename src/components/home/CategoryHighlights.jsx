import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/seedEvents';
import { Code, Music, Trophy, BookOpen, Wrench, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  technical: Code,
  cultural: Music,
  sports: Trophy,
  academic: BookOpen,
  workshop: Wrench,
  workshops: Wrench,
};

const CATEGORY_DESCRIPTIONS = {
  technical: 'Hackathons, coding challenges, AI expos, and engineering demos.',
  cultural: 'Live music concerts, dance showdowns, theater, and DJ nights.',
  sports: 'Football tournaments, chess blitz, basketball championships.',
  academic: 'Distinguished lectures, symposiums, and research symposiums.',
  workshop: 'Hands-on tech labs, UI/UX bootcamps, and career accelerators.',
  workshops: 'Hands-on tech labs, UI/UX bootcamps, and career accelerators.',
};

export function CategoryHighlights() {
  const categories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Browse by Track
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Pick a category tailored to your campus passions.
          </p>
        </div>
        <Link
          to="/events"
          className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Code;
          const desc = CATEGORY_DESCRIPTIONS[cat.id] || 'Explore upcoming activities.';

          return (
            <Link
              key={cat.id}
              to={`/events?category=${cat.id}`}
              className="group p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-brand-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-100/80 text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span>Explore Events</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
