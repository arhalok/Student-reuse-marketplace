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
  TrendingUp,
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

  // Section 14: Listing Quality Indicator
  const qualityChecks = [
    { label: 'Clear photo attached', passed: Boolean(imageUrl) },
    { label: 'Category selected', passed: Boolean(categoryId) },
    { label: 'Accurate condition set', passed: Boolean(condition) },
    { label: 'Fair price specified', passed: mode === 'GIVE_AWAY' || Boolean(price) },
    { label: 'Helpful description added', passed: description.length > 10 },
  ];
  const passedQualityCount = qualityChecks.filter((q) => q.passed).length;
  const qualityPercent = Math.round((passedQualityCount / qualityChecks.length) * 100);

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
      title="Create Campus Listing (< 60s)"
      subtitle={`Move items directly to students on ${currentCampus.name}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Zap className="h-5 w-5 fill-emerald-500 text-emerald-600" />
        </div>
      }
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step Progression Bar */}
        <div className="flex items-center justify-between text-xs font-bold border-b border-zinc-200 pb-3">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 1 ? 'text-emerald-700' : 'text-zinc-400'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px]">1</span>
            <span>Item &amp; Presets</span>
          </button>
          <span className="text-zinc-300">→</span>
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 2 ? 'text-emerald-700' : 'text-zinc-400'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px]">2</span>
            <span>Condition Checklist</span>
          </button>
          <span className="text-zinc-300">→</span>
          <button
            type="button"
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 3 ? 'text-emerald-700' : 'text-zinc-400'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-[10px]">3</span>
            <span>Price &amp; Meetup Spot</span>
          </button>
        </div>

        {/* STEP 1: ITEM DETAILS & 1-CLICK PRESETS */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-modal-in">
            {/* Quick 1-Click Presets */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-3.5 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span>1-Click Popular Campus Presets:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SMART_PRESETS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1.5 text-left text-xs font-medium text-zinc-700 hover:border-emerald-500 hover:text-emerald-900 transition-colors shadow-2xs"
                  >
                    {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">What are you selling / sharing?</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Casio FX-991CW Scientific Calculator"
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>

            {/* Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-medium text-zinc-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-900 block mb-1">Transaction Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as TransactionMode)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-medium text-zinc-800"
                >
                  <option value="BUY">Direct Sale (INR)</option>
                  <option value="EXCHANGE">Exchange / Barter ⇄</option>
                  <option value="RENT">Weekly Rental</option>
                  <option value="GIVE_AWAY">Free Campus Giveaway 🎁</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">Photo Image URL</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
                <div className="h-10 w-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                  <img src={imageUrl} alt="preview" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">Description &amp; Highlights</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention working condition, semester used, or why you're passing it on..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 2: CONDITION & INSPECTION QUALITY CHECKLIST */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-modal-in">
            {/* Condition Rating */}
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">Physical Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-medium text-zinc-800"
              >
                <option value="LIKE_NEW">Like New (Mint, barely opened)</option>
                <option value="EXCELLENT">Excellent (Light semester use, clean)</option>
                <option value="GOOD">Good (Normal wear, fully functional)</option>
                <option value="FAIR">Fair (Visible markings, works)</option>
                <option value="FOR_PARTS">For Parts</option>
              </select>
            </div>

            {/* Calculator Inspection Tests */}
            {categoryId === 'cat-calc' && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                <span className="text-xs font-bold text-zinc-900 block">
                  Scientific Calculator Verification Tests:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">LCD Display</label>
                    <select
                      value={calcDisplay}
                      onChange={(e) => setCalcDisplay(e.target.value as 'CLEAN' | 'MINOR_SCRATCHES' | 'DEAD_PIXELS')}
                      className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-xs"
                    >
                      <option value="CLEAN">Clean / No Scratches</option>
                      <option value="MINOR_SCRATCHES">Minor Superficial Scratches</option>
                      <option value="DEAD_PIXELS">Few Dead Pixels</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-600 block mb-1">Battery Condition</label>
                    <select
                      value={calcBattery}
                      onChange={(e) => setCalcBattery(e.target.value as 'FRESH' | 'WORKING' | 'NEEDS_REPLACEMENT')}
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

            {/* Book Inspection Tests */}
            {categoryId === 'cat-books' && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">Textbook Page Integrity:</span>
                <label className="flex items-center gap-2 text-xs text-zinc-700">
                  <input
                    type="checkbox"
                    checked={hasWriting}
                    onChange={(e) => setHasWriting(e.target.checked)}
                    className="rounded-sm text-emerald-600"
                  />
                  <span>Contains pencil notes or annotations</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-700">
                  <input
                    type="checkbox"
                    checked={hasHighlighting}
                    onChange={(e) => setHasHighlighting(e.target.checked)}
                    className="rounded-sm text-emerald-600"
                  />
                  <span>Contains highlighter marks in key chapters</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-700">
                  <input
                    type="checkbox"
                    checked={missingPages}
                    onChange={(e) => setMissingPages(e.target.checked)}
                    className="rounded-sm text-emerald-600"
                  />
                  <span>Any missing or torn pages (Checked)</span>
                </label>
              </div>
            )}

            {/* Section 14: Quality Meter Card */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                <span>Listing Quality: {qualityPercent === 100 ? 'Excellent' : 'Good'} ({qualityPercent}%)</span>
                <span className="text-emerald-700">{passedQualityCount}/5 checks passed</span>
              </div>
              <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${qualityPercent}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                {qualityChecks.map((q, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-zinc-600">
                    <CheckCircle2 className={`h-3 w-3 ${q.passed ? 'text-emerald-600' : 'text-zinc-300'}`} />
                    <span className={q.passed ? 'font-medium text-zinc-800' : 'text-zinc-400'}>{q.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRICING GUIDANCE & MEETUP LOCATION */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-modal-in">
            {/* Section 15: Smart Price Guidance Card */}
            {mode === 'BUY' && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    <span>Campus Price Guidance:</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    Suggested: ₹{fairPriceEstimate.suggested}
                  </span>
                </div>
                <p className="text-xs text-zinc-600">
                  Similar {condition.toLowerCase().replace('_', ' ')} items usually sell for{' '}
                  <strong>₹{fairPriceEstimate.min}–₹{fairPriceEstimate.max}</strong> on campus.
                </p>
              </div>
            )}

            {/* Price Inputs */}
            {mode === 'BUY' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-xs font-bold text-zinc-900 block mb-1">Your Listing Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value) || '')}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm font-black text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-900 block mb-1">Original Retail Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value) || '')}
                    className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm font-medium text-zinc-600"
                  />
                </div>
              </div>
            )}

            {/* Safe CCTV Meetup Spot */}
            <div>
              <label className="text-xs font-bold text-zinc-900 block mb-1">
                Preferred Campus CCTV Meetup Spot
              </label>
              <select
                value={preferredSpotId}
                onChange={(e) => setPreferredSpotId(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs font-medium text-zinc-800"
              >
                {exchangeSpots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.isRecommended ? 'Recommended CCTV' : 'Hostel spot'})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Modal Wizard Navigation Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white shadow-2xs"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
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
