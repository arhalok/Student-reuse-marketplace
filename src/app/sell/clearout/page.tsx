'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  ArrowLeft,
  GraduationCap,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function SemesterClearoutPage() {
  const router = useRouter();
  const { currentCampus, createListing } = useMarketplace();

  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [bundlePrice, setBundlePrice] = useState<number | ''>(1150);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [itemsToSell, setItemsToSell] = useState([
    { id: 1, name: 'Erwin Kreyszig Advanced Eng Mathematics (10th Ed)', checked: true, retail: 899, val: 350 },
    { id: 2, name: 'Omega Mini Drafter & Board Clips with Canvas Bag', checked: true, retail: 1150, val: 450 },
    { id: 3, name: 'Engineering Physics Course Book (Gaur & Gupta)', checked: true, retail: 550, val: 200 },
    { id: 4, name: 'White Cotton Lab Coat (Freshly Washed, Size M)', checked: true, retail: 450, val: 150 },
    { id: 5, name: 'Engineering Chemistry Lab Manual & Observations', checked: false, retail: 300, val: 100 },
  ]);

  const toggleItem = (id: number) => {
    setItemsToSell((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const activeItems = itemsToSell.filter((i) => i.checked);
  const totalRetail = activeItems.reduce((sum, i) => sum + i.retail, 0);

  const handlePublishBundle = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const { listing } = createListing({
        title: `Semester ${selectedSemester} Complete Coursework Pack (${activeItems.length} items)`,
        categoryId: 'cat-packs',
        mode: 'BUY',
        price: Number(bundlePrice) || 1000,
        originalNewPrice: totalRetail,
        condition: 'EXCELLENT',
        isBundle: true,
        bundleItems: activeItems.map((i) => i.name),
        relevantSemesters: [selectedSemester],
        targetCourse: `B.Tech Semester ${selectedSemester}`,
        description: `Passed my semester! Selling my complete verified semester kit to an incoming junior batch on ${currentCampus.shortCode}. Includes: ${activeItems.map((i) => i.name).join(', ')}.`,
        images: [
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        ],
      });

      router.push(`/listing/${listing.id}`);
    } catch {
      setIsSubmitting(false);
    }
  };

  const savingsPercent = totalRetail > (Number(bundlePrice) || 0) ? Math.round(((totalRetail - (Number(bundlePrice) || 0)) / totalRetail) * 100) : 0;

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Selling Hub</span>
          </button>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            Semester Clear-Out
          </span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs relative overflow-hidden">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Senior Passing Kit</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
              Bundle & Clear Out Your Completed Semester
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Passed your semester exams? Don&apos;t let course gear collect dust in your hostel. Bundle your books, drafters, and kits in one go for juniors.
            </p>
          </div>

          {/* Semester Selector */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-zinc-700 mb-2">
              Which Semester Did You Just Complete?
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <button
                  type="button"
                  key={sem}
                  onClick={() => setSelectedSemester(sem)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedSemester === sem
                      ? 'bg-amber-500 text-zinc-950 font-black shadow-xs'
                      : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                  }`}
                >
                  Sem {sem}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items Checklist */}
        <form onSubmit={handlePublishBundle} className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-zinc-950">
                  Select Items Included in Your Bundle
                </h2>
                <p className="text-xs text-zinc-500">
                  Check all items you are including in this handoff pack.
                </p>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                {activeItems.length} selected
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {itemsToSell.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    item.checked
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500/30'
                      : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="rounded text-amber-500 h-4 w-4"
                    />
                    <div>
                      <strong className="text-xs font-bold text-zinc-900 block">
                        {item.name}
                      </strong>
                      <span className="text-[10px] text-zinc-400">
                        Retail MRP: ₹{item.retail}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-black text-zinc-700 shrink-0">
                    ~₹{item.val}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Pricing & Value Summary */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-black text-zinc-950">
                Set Bundle Price
              </h2>
              <p className="text-xs text-zinc-500">
                Bundling saves juniors money while getting your entire kit cleared out in 1 meetup.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Your Total Bundle Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min={100}
                    value={bundlePrice}
                    onChange={(e) => setBundlePrice(Number(e.target.value) || '')}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-base font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Junior Savings Preview */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Junior Savings: {savingsPercent}%</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Retail ₹{totalRetail} &rarr; Junior pays ₹{bundlePrice}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || activeItems.length === 0}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Publishing Kit...' : `Publish Sem ${selectedSemester} Kit to Marketplace`}</span>
              <CheckCircle2 className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
