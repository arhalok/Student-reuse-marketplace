'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { ShieldCheck, MapPin, Clock, Camera, Building2, Sparkles } from 'lucide-react';

export const SafeCampusExchangeSection: React.FC = () => {
  const { currentCampus, exchangeSpots } = useMarketplace();

  return (
    <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200/70 mb-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Campus Safety Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
            Exchange Safely on Campus
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Pre-designated, high-traffic meeting points with CCTV coverage on {currentCampus.name}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exchangeSpots.map((spot) => (
          <div
            key={spot.id}
            className="flex flex-col justify-between p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-50 hover:border-zinc-300 transition-all card-hover"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  {spot.name}
                </span>
                {spot.isRecommended && (
                  <span className="rounded-md bg-emerald-100 text-emerald-900 text-[10px] font-bold px-1.5 py-0.5">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {spot.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200/60 flex items-center gap-3 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Camera className="h-3 w-3 text-zinc-400" />
                CCTV Monitored
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-zinc-400" />
                Until 9:00 PM
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
