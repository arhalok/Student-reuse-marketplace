'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import {
  Calculator,
  Compass,
  BookOpen,
  FlaskConical,
  Cpu,
  Package,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { categories, listings, selectedCategory, setSelectedCategory, currentCampus } = useMarketplace();

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'calculators':
        return <Calculator className="h-6 w-6 text-emerald-600" />;
      case 'drawing-kits':
        return <Compass className="h-6 w-6 text-purple-600" />;
      case 'textbooks':
        return <BookOpen className="h-6 w-6 text-blue-600" />;
      case 'lab-coats':
        return <FlaskConical className="h-6 w-6 text-cyan-600" />;
      case 'electronics':
        return <Cpu className="h-6 w-6 text-amber-600" />;
      default:
        return <Package className="h-6 w-6 text-indigo-600" />;
    }
  };

  const getCategoryCount = (categoryId: string) => {
    return listings.filter(
      (l) => l.categoryId === categoryId && l.campusId === currentCampus.id
    ).length;
  };

  return (
    <section id="categories-section" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Explore Academic Categories
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Specialized course essentials organized for university coursework
          </p>
        </div>

        {selectedCategory !== 'ALL' && (
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Reset Category Filter</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const count = getCategoryCount(cat.id);
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? 'ALL' : cat.id)}
              className={`p-4 rounded-2xl sm:rounded-3xl border text-left flex flex-col justify-between transition-all card-hover ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-600'
                  : 'border-zinc-200/90 bg-white hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 w-fit mb-3">
                {getCategoryIcon(cat.slug)}
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-zinc-900 leading-snug">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-zinc-400 font-medium block mt-1">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
