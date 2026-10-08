'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { ItemCondition, TransactionMode } from '@/lib/types';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

const SMART_PRESETS = [
  {
    title: 'Casio FX-991CW ClassWiz Scientific Calculator',
    categoryId: 'cat-calc',
    originalPrice: 1595,
    suggestedPrice: 850,
    semesters: [1, 2, 3, 4],
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600',
    description: 'Fully functional Casio FX-991CW ClassWiz with natural textbook display and hard slide case. Required for all engineering core math courses.',
  },
  {
    title: 'Erwin Kreyszig Advanced Engineering Mathematics (10th Ed)',
    categoryId: 'cat-books',
    originalPrice: 899,
    suggestedPrice: 350,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: 'Complete syllabus textbook for engineering mathematics. Clean pages, no torn or missing sheets.',
  },
  {
    title: 'Omega Engineering Mini Drafter + Sheet Clips',
    categoryId: 'cat-draw',
    originalPrice: 1150,
    suggestedPrice: 450,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    description: 'Heavy duty mini drafter with steel clamp and smooth swivel head. Storage canvas bag included.',
  },
  {
    title: 'Pure White Cotton Lab Coat (Size M) + Chemical Safety Goggles',
    categoryId: 'cat-coats',
    originalPrice: 450,
    suggestedPrice: 180,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    description: 'Freshly washed 100% cotton lab coat required for 1st year chemistry and workshop practicals.',
  },
];

function CreateListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const prefilledTitle = searchParams.get('title') || '';
  const prefilledBudget = Number(searchParams.get('budget')) || 0;
  const prefilledPrice = Number(searchParams.get('price')) || 0;
  const prefilledOriginal = Number(searchParams.get('original')) || 0;
  const prefilledMode = (searchParams.get('mode') as TransactionMode) || 'BUY';

  const {
    categories,
    exchangeSpots,
    calculateFairPrice,
    createListing,
    currentCampus,
    needRequests,
  } = useMarketplace();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(prefilledTitle);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-calc');
  const [mode, setMode] = useState<TransactionMode>(prefilledMode);
  const [condition, setCondition] = useState<ItemCondition>('EXCELLENT');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(prefilledOriginal || 1500);
  const [price, setPrice] = useState<number | ''>(prefilledPrice || (prefilledBudget ? prefilledBudget : 750));
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600');
  const [preferredSpotId, setPreferredSpotId] = useState(exchangeSpots[0]?.id || 'spot-lib');
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([1, 2]);
  const [targetCourse, setTargetCourse] = useState('Engineering Core');

  // Book inspection
  const [hasHighlighting, setHasHighlighting] = useState(false);
  const [hasWriting, setHasWriting] = useState(false);
  const [missingPages, setMissingPages] = useState(false);
  const [coverWear, setCoverWear] = useState(false);

  // Calculator inspection
  const [displayCondition, setDisplayCondition] = useState<'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS'>('CLEAN');
  const [batteryCondition, setBatteryCondition] = useState<'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT'>('WORKING');

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load draft from localStorage if available
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('campushare_listing_draft');
      if (savedDraft && !prefilledTitle) {
        const d = JSON.parse(savedDraft);
        const timer = setTimeout(() => {
          if (d.title) setTitle(d.title);
          if (d.categoryId) setCategoryId(d.categoryId);
          if (d.price) setPrice(d.price);
          if (d.originalPrice) setOriginalPrice(d.originalPrice);
          if (d.description) setDescription(d.description);
          if (d.imageUrl) setImageUrl(d.imageUrl);
        }, 0);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, [prefilledTitle]);

  // Auto-save draft
  useEffect(() => {
    try {
      if (title.trim()) {
        localStorage.setItem(
          'campushare_listing_draft',
          JSON.stringify({
            title,
            categoryId,
            price,
            originalPrice,
            description,
            imageUrl,
          })
        );
      }
    } catch {}
  }, [title, categoryId, price, originalPrice, description, imageUrl]);

  // Fair price guide
  const fairGuidance = calculateFairPrice(Number(originalPrice) || 1000, condition);

  // Check matching needs on campus
  const matchingNeeds = needRequests.filter(
    (n) =>
      n.campusId === currentCampus.id &&
      n.status === 'OPEN' &&
      title.trim().length > 2 &&
      (n.itemTitle.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(n.itemTitle.toLowerCase()))
  );

  const applyPreset = (preset: typeof SMART_PRESETS[0]) => {
    setTitle(preset.title);
    setCategoryId(preset.categoryId);
    setOriginalPrice(preset.originalPrice);
    setPrice(preset.suggestedPrice);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setSelectedSemesters(preset.semesters);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const { listing } = createListing({
        title,
        categoryId,
        mode,
        condition,
        price: mode === 'GIVE_AWAY' ? 0 : Number(price) || 500,
        originalNewPrice: Number(originalPrice) || undefined,
        description: description || `Student verified listing for ${title}. In ${condition.replace('_', ' ')} condition.`,
        images: [imageUrl],
        targetCourse,
        relevantSemesters: selectedSemesters,
        preferredSpotId,
        bookInspection:
          categoryId === 'cat-books'
            ? { hasHighlighting, hasWriting, missingPages, coverWear }
            : undefined,
        calculatorInspection:
          categoryId === 'cat-calc'
            ? {
                model: title,
                isWorking: true,
                displayCondition,
                batteryCondition,
              }
            : undefined,
      });

      // Clear draft
      try {
        localStorage.removeItem('campushare_listing_draft');
      } catch {}

      router.push(`/listing/${listing.id}`);
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
          <span className="text-xs font-bold text-zinc-400">Step {step} of 4</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          {/* STEP 1: Photos & Item Identification */}
          {step === 1 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Step 1: Item & Photo
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  What are you listing?
                </h1>
                <p className="text-xs text-zinc-500">
                  Select a common campus preset or enter details manually.
                </p>
              </div>

              {/* Quick Campus Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  ⚡ 1-Click Common Campus Presets
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SMART_PRESETS.map((preset, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => applyPreset(preset)}
                      className="p-3 text-left rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all group"
                    >
                      <strong className="text-xs font-bold text-zinc-900 group-hover:text-emerald-800 line-clamp-1 block">
                        {preset.title}
                      </strong>
                      <span className="text-[10px] text-zinc-500 block mt-0.5">
                        Suggested: ₹{preset.suggestedPrice}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Category */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Item Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Casio FX-991CW Calculator, Drafter, Lab Coat..."
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
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
                      Listing Mode
                    </label>
                    <select
                      value={mode}
                      onChange={(e) => setMode(e.target.value as TransactionMode)}
                      className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                    >
                      <option value="BUY">Sell (Direct Buy)</option>
                      <option value="EXCHANGE">Exchange / Swap</option>
                      <option value="RENT">Rent per Semester</option>
                      <option value="GIVE_AWAY">Free Gift (Give Away)</option>
                    </select>
                  </div>
                </div>

                {/* Photo Preview & URL input */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Item Photo URL
                  </label>
                  <div className="flex gap-3 items-center">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="h-16 w-16 rounded-2xl object-cover border border-zinc-200 shrink-0"
                    />
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Paste image URL or take photo"
                      className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Demand Match Alert */}
              {matchingNeeds.length > 0 && (
                <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50 text-xs text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span>{matchingNeeds.length} Junior(s) are Looking For This!</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Students on {currentCampus.shortCode} have posted active requests for &ldquo;{title}&rdquo; with budgets up to ₹{Math.max(...matchingNeeds.map((n) => n.maxBudget))}.
                  </p>
                </div>
              )}

              <button
                type="button"
                disabled={!title.trim()}
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs disabled:opacity-50 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Condition Inspection</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Condition & Quality Inspection Checklist */}
          {step === 2 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Step 2: Condition & Inspection
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Item Condition & Standardized Checklist
                </h1>
                <p className="text-xs text-zinc-500">
                  CampuShare requires standardized honesty to eliminate disputes at the meetup spot.
                </p>
              </div>

              {/* Condition pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-700">
                  Overall Condition Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'LIKE_NEW', label: 'Like New (Mint)', desc: 'Zero defects, barely used' },
                    { id: 'EXCELLENT', label: 'Excellent', desc: 'Minimal signs of wear' },
                    { id: 'GOOD', label: 'Good', desc: 'Normal semester use, 100% functional' },
                    { id: 'FAIR', label: 'Fair', desc: 'Heavy notes/highlighting or scuffs' },
                  ].map((c) => (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() => setCondition(c.id as ItemCondition)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        condition === c.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <strong className="text-xs font-bold text-zinc-900 block">{c.label}</strong>
                      <span className="text-[10px] text-zinc-500">{c.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standardized Category Checklists */}
              {categoryId === 'cat-books' && (
                <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-zinc-900">
                    <BookOpen className="h-4 w-4 text-emerald-600" />
                    <span>Standardized Textbook Inspection</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-zinc-200">
                      <input
                        type="checkbox"
                        checked={hasHighlighting}
                        onChange={(e) => setHasHighlighting(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Pen / Highlighting present</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-zinc-200">
                      <input
                        type="checkbox"
                        checked={hasWriting}
                        onChange={(e) => setHasWriting(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Notes in margins</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-zinc-200">
                      <input
                        type="checkbox"
                        checked={missingPages}
                        onChange={(e) => setMissingPages(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Missing or torn pages</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl bg-white border border-zinc-200">
                      <input
                        type="checkbox"
                        checked={coverWear}
                        onChange={(e) => setCoverWear(e.target.checked)}
                        className="rounded text-emerald-600"
                      />
                      <span>Spine / cover crease</span>
                    </label>
                  </div>
                </div>
              )}

              {categoryId === 'cat-calc' && (
                <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-zinc-900">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span>Scientific Calculator Hardware Health</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-600 block mb-1">
                        LCD Display Status
                      </span>
                      <select
                        value={displayCondition}
                        onChange={(e) => setDisplayCondition(e.target.value as 'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS')}
                        className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs"
                      >
                        <option value="CLEAN">Clean & Sharp (No scratches)</option>
                        <option value="MINOR_SCRATCHES">Minor hairline scratches</option>
                        <option value="DEAD_PIXELS">Dead pixel or dark spot</option>
                      </select>
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-zinc-600 block mb-1">
                        Battery Status
                      </span>
                      <select
                        value={batteryCondition}
                        onChange={(e) => setBatteryCondition(e.target.value as 'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT')}
                        className="w-full p-2.5 rounded-xl border border-zinc-200 bg-white text-xs"
                      >
                        <option value="WORKING">Working standard battery</option>
                        <option value="FRESH">Fresh new battery installed</option>
                        <option value="NEEDS_REPLACEMENT">Low battery (Needs coin cell)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mention anything special: original box, bonus notes, lab manual included..."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                />
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
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Pricing & Fair Value</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Price Guidance & Fair Value */}
          {step === 3 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Step 3: Pricing & Value
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Set Your Campus Price
                </h1>
                <p className="text-xs text-zinc-500">
                  CampuShare uses algorithm-backed fair pricing to guarantee fast campus handshakes.
                </p>
              </div>

              {mode !== 'GIVE_AWAY' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Original New Retail MRP (₹)
                      </label>
                      <input
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(Number(e.target.value) || '')}
                        placeholder="e.g. 1595"
                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        Your Listing Price (₹) *
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value) || '')}
                        placeholder="e.g. 750"
                        className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-sm font-black text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Recommendation banner */}
                  <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">
                        ✨ Suggested Fair Price: ₹{fairGuidance.suggested}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPrice(fairGuidance.suggested)}
                        className="text-[11px] font-black text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded-lg hover:bg-emerald-200"
                      >
                        Apply Suggested
                      </button>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      Based on condition ({condition.replace('_', ' ')}) and original MRP, items priced between ₹{fairGuidance.min} and ₹{fairGuidance.max} sell 3x faster on {currentCampus.shortCode}.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl border border-purple-200 bg-purple-50 space-y-2 text-center">
                  <div className="text-2xl">🎁</div>
                  <h3 className="text-sm font-black text-purple-950">Free Campus Giveaway</h3>
                  <p className="text-xs text-purple-800 max-w-sm mx-auto">
                    This item will be listed with price ₹0. You will earn green campus karma and help an incoming junior!
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={mode !== 'GIVE_AWAY' && !price}
                  onClick={() => setStep(4)}
                  className="flex-1 py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-xs disabled:opacity-50 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue to Handshake Spot</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Semester Alignment & CCTV Meetup Spot */}
          {step === 4 && (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Step 4: Campus Spot & Verification
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  Course Alignment & Safe Meetup Spot
                </h1>
                <p className="text-xs text-zinc-500">
                  Select where you prefer to meet on campus and which semester this item is for.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Target Course / Subject
                  </label>
                  <input
                    type="text"
                    value={targetCourse}
                    onChange={(e) => setTargetCourse(e.target.value)}
                    placeholder="e.g. Engineering Mathematics, Mechanics, Workshop..."
                    className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Relevant Semesters
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                      const isSelected = selectedSemesters.includes(sem);
                      return (
                        <button
                          type="button"
                          key={sem}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSemesters(selectedSemesters.filter((s) => s !== sem));
                            } else {
                              setSelectedSemesters([...selectedSemesters, sem]);
                            }
                          }}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                          }`}
                        >
                          Sem {sem}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Preferred Campus CCTV Meetup Spot *
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {exchangeSpots.map((spot) => (
                      <label
                        key={spot.id}
                        className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          preferredSpotId === spot.id
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                            : 'border-zinc-200 bg-white hover:bg-zinc-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="spot"
                          checked={preferredSpotId === spot.id}
                          onChange={() => setPreferredSpotId(spot.id)}
                          className="mt-1 text-emerald-600"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5">
                            <strong className="text-xs font-bold text-zinc-900">{spot.name}</strong>
                            {spot.isRecommended && (
                              <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{spot.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Listing Preview Summary
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-zinc-900 truncate">{title}</span>
                  <span className="text-base font-black text-emerald-700">
                    {mode === 'GIVE_AWAY' ? 'FREE' : `₹${price}`}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  Condition: {condition.replace('_', ' ')} &bull; Campus: {currentCampus.shortCode}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3.5 rounded-2xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Publishing...' : 'Publish to Campus Marketplace'}</span>
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

export default function CreateListingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading Wizard...</div>}>
      <CreateListingContent />
    </Suspense>
  );
}
