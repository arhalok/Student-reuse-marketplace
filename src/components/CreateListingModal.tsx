'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ItemCondition, TransactionMode } from '@/lib/types';
import {
  X,
  Upload,
  Sparkles,
  Zap,
  Info,
  DollarSign,
  Check,
  CheckCircle2,
  MapPin,
  BookOpen,
} from 'lucide-react';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (matchedCount: number) => void;
}

const SMART_PRESETS = [
  {
    title: 'Casio FX-991CW ClassWiz Scientific Calculator',
    categoryId: 'cat-calc',
    originalPrice: 1595,
    semesters: [1, 2, 3, 4],
    imageUrl: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&q=80&w=600',
    description: 'Fully working Casio ClassWiz FX-991CW with high-resolution LCD display and hard slip-case. Ideal for Sem 1-4 engineering mathematics and physics.',
  },
  {
    title: 'Erwin Kreyszig Advanced Engineering Mathematics (10th Ed)',
    categoryId: 'cat-books',
    originalPrice: 899,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    description: 'Complete syllabus textbook for engineering mathematics. Clean pages, no torn or missing sheets.',
  },
  {
    title: 'Omega Engineering Mini Drafter + Drawing Board Clips',
    categoryId: 'cat-draw',
    originalPrice: 1150,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=600',
    description: 'Heavy duty mini drafter with steel clamp and smooth swivel head. Storage bag included.',
  },
  {
    title: 'Pure White Cotton Lab Coat (Size M) + Chemical Safety Goggles',
    categoryId: 'cat-coats',
    originalPrice: 450,
    semesters: [1, 2],
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
    description: 'Freshly washed 100% cotton lab coat required for 1st year chemistry and workshop practicals.',
  },
];

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    categories,
    exchangeSpots,
    calculateFairPrice,
    createListing,
  } = useMarketplace();

  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('cat-calc');
  const [mode, setMode] = useState<TransactionMode>('BUY');
  const [condition, setCondition] = useState<ItemCondition>('EXCELLENT');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(1595);
  const [price, setPrice] = useState<number | ''>(750);
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

  // Calculator checklist (Section 6)
  const [calcIsWorking, setCalcIsWorking] = useState(true);
  const [calcDisplay, setCalcDisplay] = useState<'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS'>('CLEAN');
  const [calcBattery, setCalcBattery] = useState<'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT'>('FRESH');

  if (!isOpen) return null;

  // Price assistance recommendation
  const fairPriceEstimate = calculateFairPrice(Number(originalPrice) || 1200, condition);

  const applyPreset = (preset: typeof SMART_PRESETS[0]) => {
    setTitle(preset.title);
    setCategoryId(preset.categoryId);
    setOriginalPrice(preset.originalPrice);
    setImageUrl(preset.imageUrl);
    setDescription(preset.description);
    setSelectedSemesters(preset.semesters);
    const est = calculateFairPrice(preset.originalPrice, condition);
    setPrice(est.suggested);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-zinc-900 text-lg">Smart Fast Listing</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                &lt; 1 Minute
              </span>
            </div>
            <p className="text-xs text-zinc-500">List an item you no longer use so incoming students can reuse it.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Quick Suggest Presets (Section 11) */}
        <div className="border-b border-zinc-100 bg-amber-50/40 p-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
            <span>Auto-fill common semester essentials (1-Click):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {SMART_PRESETS.map((p) => (
              <button
                key={p.title}
                type="button"
                onClick={() => applyPreset(p)}
                className="rounded-lg border border-amber-200/80 bg-white px-2.5 py-1 text-xs font-medium text-amber-950 hover:bg-amber-100 hover:border-amber-300 transition-colors shadow-2xs"
              >
                {p.title.split(' ')[0]} {p.title.split(' ')[1]} (₹{p.originalPrice})
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Item Title / Model *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Casio FX-991CW Calculator or Kreyszig Math 10th Ed"
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {/* Category & Transaction Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Transaction Mode (Section 7)
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as TransactionMode)}
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm text-zinc-900 focus:border-emerald-600 focus:outline-hidden font-medium"
              >
                <option value="BUY">BUY (Resale purchase)</option>
                <option value="EXCHANGE">EXCHANGE (Book / item swap)</option>
                <option value="RENT">RENT (Temporary semester rental)</option>
                <option value="GIVE_AWAY">GIVE AWAY (Free reuse)</option>
              </select>
            </div>
          </div>

          {/* Condition System (Standardized, Section 10) */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Standardized Condition (Section 10)
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['LIKE_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'FOR_PARTS'] as ItemCondition[]).map(
                (cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      setCondition(cond);
                      if (originalPrice) {
                        const est = calculateFairPrice(Number(originalPrice), cond);
                        setPrice(est.suggested);
                      }
                    }}
                    className={`rounded-xl border p-2 text-center text-xs font-semibold transition-all ${
                      condition === cond
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-600/20'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <div>{cond.replace('_', ' ')}</div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Fair Price Assistance (Section 12) */}
          {mode === 'BUY' && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Fair Price Guidance (Rule-Based Assistance)</span>
                </div>
                <span className="text-[11px] font-medium text-indigo-600">
                  Suggested: ₹{fairPriceEstimate.suggested}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-zinc-500">Original / New Retail Price:</span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="font-bold text-zinc-700">₹</span>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setOriginalPrice(val);
                        if (val) {
                          const est = calculateFairPrice(val, condition);
                          setPrice(est.suggested);
                        }
                      }}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500">Your Resale Price:</span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="font-bold text-emerald-700">₹</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full rounded-lg border border-emerald-400 bg-white px-2 py-1 text-xs font-bold text-emerald-800"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[11px] text-indigo-700">
                Recommended fair range for {condition.replace('_', ' ').toLowerCase()}:{' '}
                <strong>₹{fairPriceEstimate.min} – ₹{fairPriceEstimate.max}</strong>
              </div>
            </div>
          )}

          {/* Mode Details */}
          {mode === 'EXCHANGE' && (
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Exchange Preference (e.g. What book or item do you want in return?)
              </label>
              <input
                type="text"
                value={exchangeDetails}
                onChange={(e) => setExchangeDetails(e.target.value)}
                placeholder="e.g. My Sem 2 Math Book + ₹100 for your Sem 3 Data Structures Book"
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs"
              />
            </div>
          )}

          {mode === 'RENT' && (
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Rental Rate Per Week (₹)
              </label>
              <input
                type="number"
                value={rentalRate}
                onChange={(e) => setRentalRate(Number(e.target.value))}
                placeholder="80"
                className="w-32 rounded-xl border border-zinc-300 px-3 py-2 text-xs"
              />
            </div>
          )}

          {/* Book Inspection Specifics (Section 10) */}
          {categoryId === 'cat-books' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-2">
                <BookOpen className="h-3.5 w-3.5 text-zinc-600" />
                Textbook Condition Checklist (Reduces Disputes)
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasWriting}
                    onChange={(e) => setHasWriting(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Has pencil/pen notes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasHighlighting}
                    onChange={(e) => setHasHighlighting(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span>Has highlighter marks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={missingPages}
                    onChange={(e) => setMissingPages(e.target.checked)}
                    className="rounded text-red-600"
                  />
                  <span className="text-red-700">Missing any pages?</span>
                </label>
              </div>
            </div>
          )}

          {/* Calculator Inspection Specifics (Section 6) */}
          {categoryId === 'cat-calc' && (
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Calculator Inspection Checklist (Section 6)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-0.5">Keypad &amp; Power</label>
                  <select
                    value={calcIsWorking ? 'yes' : 'no'}
                    onChange={(e) => setCalcIsWorking(e.target.value === 'yes')}
                    className="w-full rounded-lg border border-zinc-300 p-1.5 text-xs bg-white text-zinc-900"
                  >
                    <option value="yes">✓ Fully Working</option>
                    <option value="no">Needs Repair / New Battery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-0.5">Display Screen</label>
                  <select
                    value={calcDisplay}
                    onChange={(e) => setCalcDisplay(e.target.value as 'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS')}
                    className="w-full rounded-lg border border-zinc-300 p-1.5 text-xs bg-white text-zinc-900"
                  >
                    <option value="CLEAN">Clean, crisp LCD</option>
                    <option value="MINOR_SCRATCHES">Minor hairline scratches</option>
                    <option value="DEAD_PIXELS">Dead pixels visible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 mb-0.5">Battery Health</label>
                  <select
                    value={calcBattery}
                    onChange={(e) => setCalcBattery(e.target.value as 'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT')}
                    className="w-full rounded-lg border border-zinc-300 p-1.5 text-xs bg-white text-zinc-900"
                  >
                    <option value="FRESH">Fresh / New battery</option>
                    <option value="WORKING">Working fine</option>
                    <option value="NEEDS_REPLACEMENT">Needs replacement</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Designated Campus Exchange Point (Section 17) */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Preferred Campus Meetup Spot (Safe Verified Location)
            </label>
            <select
              value={preferredSpotId}
              onChange={(e) => setPreferredSpotId(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
            >
              {exchangeSpots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.description})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-200 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              <span>Publish Listing (<span className="text-emerald-200">&lt; 1 min</span>)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
