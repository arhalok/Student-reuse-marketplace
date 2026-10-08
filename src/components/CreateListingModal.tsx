'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ItemCondition, TransactionMode } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  Upload,
  Sparkles,
  Zap,
  Info,
  DollarSign,
  Check,
  CheckCircle2,
  MapPin,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Camera,
  Layers,
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (matchedCount: number) => void;
  prefilledTitle?: string;
  prefilledBudget?: number;
}

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

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  prefilledTitle = '',
  prefilledBudget,
}) => {
  const {
    categories,
    exchangeSpots,
    calculateFairPrice,
    createListing,
    currentCampus,
  } = useMarketplace();

  // Step state (1: Details & Preset, 2: Condition & Quality, 3: Pricing & Location)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [title, setTitle] = useState(prefilledTitle);
  const [categoryId, setCategoryId] = useState('cat-calc');
  const [mode, setMode] = useState<TransactionMode>('BUY');
  const [condition, setCondition] = useState<ItemCondition>('EXCELLENT');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(prefilledBudget ? prefilledBudget * 1.5 : 1595);
  const [price, setPrice] = useState<number | ''>(prefilledBudget || 750);
  const [exchangeDetails, setExchangeDetails] = useState('');
  const [rentalRate, setRentalRate] = useState<number | ''>(80);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600');
  const [preferredSpotId, setPreferredSpotId] = useState('spot-lib');
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([1, 2]);

  // Book checklist
  const [hasWriting, setHasWriting] = useState(false);
  const [hasHighlighting, setHasHighlighting] = useState(false);
  const [missingPages, setMissingPages] = useState(false);

  // Calculator checklist
  const [calcIsWorking, setCalcIsWorking] = useState(true);
  const [calcDisplay, setCalcDisplay] = useState<'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS'>('CLEAN');
  const [calcBattery, setCalcBattery] = useState<'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT'>('FRESH');

  if (!isOpen) return null;

  const fairPriceEstimate = calculateFairPrice(Number(originalPrice) || 1200, condition);

  const applyPreset = (preset: typeof SMART_PRESETS[0]) => {
    setTitle(preset.title);
    setCategoryId(preset.categoryId);
    setOriginalPrice(preset.originalPrice);
    setImageUrl(preset.imageUrl);
    setDescription(preset.description);
    setSelectedSemesters(preset.semesters);
    setPrice(preset.suggestedPrice);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const { matchedNeedsCount } = createListing({
      title,
      categoryId,
      mode,
      condition,
      price: mode === 'GIVE_AWAY' ? 0 : Number(price) || fairPriceEstimate.suggested,
      originalNewPrice: originalPrice ? Number(originalPrice) : undefined,
      exchangeDetails: mode === 'EXCHANGE' ? exchangeDetails : undefined,
      rentalRatePerWeek: mode === 'RENT' ? Number(rentalRate) : undefined,
      description,
      images: [imageUrl],
      preferredSpotId,
      relevantSemesters: selectedSemesters,
      distanceKm: 0.4,
      bookInspection: categoryId === 'cat-books' ? {
        hasWriting,
        hasHighlighting,
        missingPages,
        coverWear: false,
      } : undefined,
      calculatorInspection: categoryId === 'cat-calc' ? {
        model: title,
        isWorking: calcIsWorking,
        displayCondition: calcDisplay,
        batteryCondition: calcBattery,
      } : undefined,
    });

    onSuccess(matchedNeedsCount);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Sell Academic Item"
      subtitle={`Publish directly on ${currentCampus.shortCode} • Takes under 60 seconds`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Camera className="h-5 w-5" />
        </div>
      }
      badge={
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
          Step {currentStep} of 3
        </span>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                step <= currentStep ? 'bg-emerald-600' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Photos, Title & Category */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-modal-in">
            {/* 1-Click Fast Presets */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950 mb-2">
                <Zap className="h-4 w-4 text-amber-600 fill-amber-500" />
                <span>1-Click Auto-Fill Common Semester Essentials:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SMART_PRESETS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-xl border border-amber-200 bg-white px-2.5 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100/70 transition-colors shadow-2xs"
                  >
                    {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview & Dropzone */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-4 aspect-4/3 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-2xs">
                <img src={imageUrl} alt="Item preview" className="h-full w-full object-cover" />
              </div>
              <div className="sm:col-span-8 space-y-1">
                <label className="text-xs font-bold text-zinc-700">Image Source URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                />
                <p className="text-[11px] text-zinc-400">
                  Tip: Add clear, front-facing photos for 3x faster campus selling.
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">What are you selling? *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio ClassWiz FX-991CW Calculator"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden font-medium"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Item Details / Notes</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention working condition, accessories included, or exam approval."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Condition & Quality Check */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-modal-in">
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1.5 block">Item Condition</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR'] as ItemCondition[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      condition === c
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {c.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Checklist based on category */}
            {categoryId === 'cat-calc' && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Calculator Quality Check
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Display</label>
                    <select
                      value={calcDisplay}
                      onChange={(e) => setCalcDisplay(e.target.value as any)}
                      className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-xs"
                    >
                      <option value="CLEAN">Clean / No Scratches</option>
                      <option value="MINOR_SCRATCHES">Minor Superficial Scratches</option>
                      <option value="DEAD_PIXELS">Few Dead Pixels</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Battery</label>
                    <select
                      value={calcBattery}
                      onChange={(e) => setCalcBattery(e.target.value as any)}
                      className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-xs"
                    >
                      <option value="FRESH">Fresh / New Battery</option>
                      <option value="WORKING">Working fine</option>
                      <option value="NEEDS_REPLACEMENT">Needs Replacement</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {categoryId === 'cat-books' && (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5 mb-1">
                  <BookOpen className="h-4 w-4 text-zinc-700" />
                  Textbook Condition Inspection
                </span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={missingPages}
                    onChange={(e) => setMissingPages(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Any missing or torn pages?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWriting}
                    onChange={(e) => setHasWriting(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Has handwritten pencil / pen notes?</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHighlighting}
                    onChange={(e) => setHasHighlighting(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Has marker highlighting?</span>
                </label>
              </div>
            )}

            {/* Relevant Semesters */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1.5 block">Relevant Semesters</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((sem) => (
                  <button
                    key={sem}
                    type="button"
                    onClick={() =>
                      setSelectedSemesters((prev) =>
                        prev.includes(sem) ? prev.filter((s) => s !== sem) : [...prev, sem]
                      )
                    }
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      selectedSemesters.includes(sem)
                        ? 'bg-zinc-950 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Sem {sem}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing, Mode & Safe Meetup Location */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-modal-in">
            {/* Mode Selector */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1.5 block">Listing Mode</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { m: 'BUY' as const, label: 'Sell (Standard)' },
                  { m: 'EXCHANGE' as const, label: 'Exchange ⇄' },
                  { m: 'RENT' as const, label: 'Rent Out' },
                  { m: 'GIVE_AWAY' as const, label: 'Free Giveaway 🎁' },
                ].map(({ m, label }) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      mode === m
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Fair Guidance */}
            {mode !== 'GIVE_AWAY' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-zinc-800 mb-1 block">Your Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || '')}
                    placeholder="e.g. 750"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-sm font-black text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-800 mb-1 block">Original Retail Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value) || '')}
                    placeholder="e.g. 1595"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-sm font-medium text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            {/* Fair price recommendation pill */}
            {mode === 'BUY' && originalPrice && (
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                <span>Fair Campus Price Recommendation:</span>
                <strong>₹{fairPriceEstimate.min} – ₹{fairPriceEstimate.max} (Suggested: ₹{fairPriceEstimate.suggested})</strong>
              </div>
            )}

            {/* Safe Exchange Spot */}
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Preferred Safe Meeting Spot</label>
              <select
                value={preferredSpotId}
                onChange={(e) => setPreferredSpotId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden font-medium"
              >
                {exchangeSpots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.description})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step Buttons */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <span />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              disabled={!title.trim()}
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-xs font-bold text-white shadow-2xs"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
            >
              <Check className="h-4 w-4" />
              <span>Publish Listing to Campus</span>
            </button>
          )}
        </div>
      </form>
    </ModalWrapper>
  );
};
