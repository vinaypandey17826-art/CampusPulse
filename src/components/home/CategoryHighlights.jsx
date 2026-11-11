import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/seedEvents';
import { Code, Music, Trophy, Wrench, ArrowRight } from 'lucide-react';

const CATEGORY_ICONS = {
  technical: Code,
  cultural: Music,
  sports: Trophy,
  workshop: Wrench,
  workshops: Wrench,
};

const CATEGORY_DESCRIPTIONS = {
  technical: 'Hackathons, coding challenges, AI expos, and engineering symposiums.',
  cultural: 'Live music concerts, dance showcases, drama, and campus festivals.',
  sports: 'Inter-departmental championships, football, and blitz arenas.',
  workshop: 'Hands-on technical masterclasses, labs, and skill bootcamps.',
  workshops: 'Hands-on technical masterclasses, labs, and skill bootcamps.',
};

export function CategoryHighlights() {
  const categories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <div className="space-y-6 pt-6 border-t border-[#E2E2E2]">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
            Focus Areas
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
            Browse by Track
          </h2>
        </div>
        <Link
          to="/events"
          className="text-xs font-bold uppercase tracking-wider text-[#1B3A8C] hover:underline flex items-center gap-1"
        >
          <span>View All Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.id] || Code;
          const desc = CATEGORY_DESCRIPTIONS[cat.id] || 'Explore upcoming campus activities.';

          return (
            <Link
              key={cat.id}
              to={`/events?category=${cat.id}`}
              className="group p-5 bg-white border border-[#E2E2E2] rounded-[2px] hover:border-[#111111] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 border border-[#E2E2E2] bg-[#FAFAFA] text-[#1B3A8C] flex items-center justify-center rounded-[2px] group-hover:bg-[#1B3A8C] group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm uppercase text-[#111111] group-hover:text-[#1B3A8C] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-[#F0F0F0] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#1B3A8C]">
                <span>Explore Track</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
