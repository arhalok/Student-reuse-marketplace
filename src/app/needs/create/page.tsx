'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { ItemCondition } from '@/lib/types';
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function PostNeedPage() {
  const router = useRouter();
  const {
    currentCampus,
    createNeedRequest,
    categories,
    listings,
  } = useMarketplace();

  // Wizard state
  const [step, setStep] = useState(1);
  const [itemTitle, setItemTitle] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [targetSemester, setTargetSemester] = useState<number>(2);
  const [maxBudget, setMaxBudget] = useState<number | ''>(850);
  const [preferredCondition, setPreferredCondition] = useState<ItemCondition>('GOOD');
  const [requiredByDate, setRequiredByDate] = useState('2026-10-25');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Proactive instant matching against existing listings
  const instantMatches = itemTitle.trim().length > 2
    ? listings.filter((l) =>
        l.campusId === currentCampus.id &&
        l.status === 'ACTIVE' &&
        (l.title.toLowerCase().includes(itemTitle.toLowerCase()) ||
          itemTitle.toLowerCase().includes(l.title.toLowerCase()))
      )
    : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    setIsSubmitting(true);
    try {
      createNeedRequest({
        itemTitle,
        categoryId: categoryId || undefined,
        maxBudget: Number(maxBudget) || 1000,
        preferredCondition,
        requiredByDate,
        notes,
        targetSemester,
      });

      router.push('/needs');
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (step > 1) setStep(step - 1);
              else router.back();
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{step > 1 ? 'Previous Step' : 'Cancel'}</span>
          </button>
          <span className="text-xs font-bold text-zinc-400">Step {step} of 3</span>
        </div>

        {/* Progress indicator */}
        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <form onSubmit={handleCreate} className="space-y-6">
          {/* STEP 1: What do you need? */}
          {step === 1 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Layers className="h-3 w-3" />
                  Demand Broadcast
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  What item are you looking for?
                </h1>
                <p className="text-xs text-zinc-500">
                  Seniors at {currentCampus.name} will be notified if they have this item.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Item Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    placeholder="e.g. Casio FX-991CW, Engineering Drawing Drafter, Lab Coat"
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Target Semester
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <button
                        type="button"
                        key={sem}
                        onClick={() => setTargetSemester(sem)}
                        className={`py-2 rounded-xl text-xs font-bold transition-all ${
                          targetSemester === sem
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

              {/* Instant Match Discovery Notification */}
              {instantMatches.length > 0 && (
                <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-950 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Instant Match Found on Campus!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    A student has already listed an item matching &ldquo;{itemTitle}&rdquo; for ₹
                    {instantMatches[0].price}.
                  </p>
                  <Link
                    href={`/listing/${instantMatches[0].id}`}
                    className="inline-flex items-center gap-1 font-black text-emerald-700 hover:underline pt-1"
                  >
                    <span>View item ({instantMatches[0].title})</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              <button
                type="button"
                disabled={!itemTitle.trim()}
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs disabled:opacity-50 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Budget & Condition</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Budget & Condition */}
          {step === 2 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Budget & Condition Preference
                </h1>
                <p className="text-xs text-zinc-500">
                  Be realistic to get seniors to respond quickly to your request.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Maximum Budget You Can Pay (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-zinc-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      required
                      min={10}
                      max={50000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value) || '')}
                      placeholder="e.g. 850"
                      className="w-full pl-9 pr-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Minimum Acceptable Condition
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'LIKE_NEW', label: 'Like New', desc: 'No marks, mint condition' },
                      { id: 'EXCELLENT', label: 'Excellent', desc: 'Minimal signs of use' },
                      { id: 'GOOD', label: 'Good', desc: 'Normal wear, fully functional' },
                      { id: 'FAIR', label: 'Fair / Any', desc: 'Working, marks/highlights okay' },
                    ].map((cond) => (
                      <button
                        type="button"
                        key={cond.id}
                        onClick={() => setPreferredCondition(cond.id as ItemCondition)}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          preferredCondition === cond.id
                            ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <strong className="text-xs font-bold text-zinc-900 block">
                          {cond.label}
                        </strong>
                        <span className="text-[10px] text-zinc-500">{cond.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    When do you need it by?
                  </label>
                  <input
                    type="date"
                    value={requiredByDate}
                    onChange={(e) => setRequiredByDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!maxBudget}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs disabled:opacity-50 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Publish */}
          {step === 3 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Review & Broadcast Request
                </h1>
                <p className="text-xs text-zinc-500">
                  This will appear on the {currentCampus.shortCode} Campus Need Board.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Optional Notes for Seniors (e.g., Specific edition, author, or urgency)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need by this Friday for Engineering Mechanics lab. Can meet at Central Library gate."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:bg-white"
                />
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Demand Request Summary
                  </span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Target: Sem {targetSemester}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-zinc-950">{itemTitle}</h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span>Budget: ₹{maxBudget}</span>
                    <span>&bull;</span>
                    <span>Condition: {preferredCondition.replace('_', ' ')}</span>
                    {requiredByDate && (
                      <>
                        <span>&bull;</span>
                        <span>By {requiredByDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast to Campus Need Board'}</span>
                  <CheckCircle2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
