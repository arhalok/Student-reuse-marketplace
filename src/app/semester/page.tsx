'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { SEMESTER_STARTER_PACKS_CATALOG } from '@/lib/mock-data';
import {
  Sparkles,
  BookOpen,
  Calculator,
  DraftingCompass,
  FlaskConical,
  FileText,
  ArrowRight,
  GraduationCap,
  Package,
} from 'lucide-react';

export default function SemesterProcurementPage() {
  const { currentCampus } = useMarketplace();
  const [selectedSem, setSelectedSem] = useState<number>(2);

  const items = SEMESTER_STARTER_PACKS_CATALOG;
  const totalNewPrice = items.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalUsedPrice = items.reduce((sum, item) => sum + item.resalePrice, 0);
  const totalSavings = totalNewPrice - totalUsedPrice;
  const savingsPercent = Math.round((totalSavings / totalNewPrice) * 100);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Calculator':
        return <Calculator className="h-5 w-5 text-emerald-600" />;
      case 'DraftingCompass':
        return <DraftingCompass className="h-5 w-5 text-purple-600" />;
      case 'FlaskConical':
        return <FlaskConical className="h-5 w-5 text-blue-600" />;
      case 'FileText':
        return <FileText className="h-5 w-5 text-amber-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-indigo-600" />;
    }
  };

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" />
                Senior Coursework Roadmap
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Semester Starter Kits & Procurement
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Why pay full retail for single-semester coursework tools? Seniors at {currentCampus.name} pass on complete kits at 60%+ discounts.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/sell/clearout"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                <span>Sell Your Passed Kit</span>
              </Link>
            </div>
          </div>

          {/* Savings Metric Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-100">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Store Retail MRP
              </span>
              <strong className="text-xl font-black text-zinc-400 line-through block mt-0.5">
                ₹{totalNewPrice.toLocaleString()}
              </strong>
              <span className="text-[11px] text-zinc-500">Buying brand new</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Campus Reuse Cost
              </span>
              <strong className="text-2xl font-black text-emerald-700 block mt-0.5">
                ₹{totalUsedPrice.toLocaleString()}
              </strong>
              <span className="text-[11px] text-emerald-800 font-semibold">From campus seniors</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-center">
              <span className="text-[10px] font-bold text-indigo-800 uppercase tracking-wider block">
                Total Junior Savings
              </span>
              <strong className="text-2xl font-black text-indigo-700 block mt-0.5">
                ₹{totalSavings.toLocaleString()} ({savingsPercent}%)
              </strong>
              <span className="text-[11px] text-indigo-800 font-semibold">Kept in your pocket</span>
            </div>
          </div>
        </div>

        {/* Semester & Branch Selector */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black text-zinc-950">
                Select Your Semester & Curriculum
              </h2>
              <p className="text-xs text-zinc-500">
                Requirements tailored to {currentCampus.shortCode} course guidelines.
              </p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSem(sem)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedSem === sem
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Toolkit Items Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-zinc-950">
              Required Semester {selectedSem} Toolkit ({items.length} items)
            </h2>
            <Link
              href={`/browse?semester=${selectedSem}`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View all Sem {selectedSem} listings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => {
              const itemSavings = item.originalPrice - item.resalePrice;
              const itemSavingsPercent = Math.round((itemSavings / item.originalPrice) * 100);

              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-100 shrink-0">
                      {getIcon(item.icon)}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="font-extrabold text-sm text-zinc-950 leading-snug">
                        {item.name}
                      </h3>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-emerald-700">
                          ₹{item.resalePrice}
                        </span>
                        <span className="text-xs text-zinc-400 line-through">
                          ₹{item.originalPrice}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          Save {itemSavingsPercent}%
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/search?q=${encodeURIComponent(item.name.split(' ')[0])}`}
                      className="px-3.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>Find on Campus</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action for Passing Seniors */}
        <div className="rounded-3xl border border-indigo-200 bg-indigo-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-black text-indigo-950 flex items-center justify-center sm:justify-start gap-1.5">
              <Package className="h-4 w-4 text-indigo-600" />
              <span>Are You Passing Semester {selectedSem}?</span>
            </h3>
            <p className="text-xs text-indigo-800">
              Clear your shelf and help incoming juniors by listing your complete course bundle in one click.
            </p>
          </div>

          <Link
            href="/sell/clearout"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition-colors"
          >
            Create Sem {selectedSem} Bundle
          </Link>
        </div>
      </div>
    </div>
  );
}
