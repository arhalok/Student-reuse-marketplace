'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  GraduationCap,
  Package,
  Sparkles,
  Check,
  CheckCircle2,
  DollarSign,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

interface SellSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SellSemesterModal: React.FC<SellSemesterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { currentProfile, createListing, currentCampus } = useMarketplace();

  const [selectedSemester, setSelectedSemester] = useState<number>(2);
  const [bundlePrice, setBundlePrice] = useState<number>(1100);

  const [itemsToSell, setItemsToSell] = useState([
    { name: 'Erwin Kreyszig Advanced Eng Mathematics (10th Ed)', checked: true, retail: 899, val: 350 },
    { name: 'Omega Mini Drafter & Board Clips', checked: true, retail: 1150, val: 450 },
    { name: 'Engineering Physics Course Book (Gaur & Gupta)', checked: true, retail: 550, val: 200 },
    { name: 'White Cotton Lab Coat (Freshly washed)', checked: true, retail: 450, val: 100 },
  ]);

  if (!isOpen) return null;

  const toggleItem = (index: number) => {
    setItemsToSell((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked: !item.checked } : item))
    );
  };

  const activeItems = itemsToSell.filter((i) => i.checked);
  const estimatedValue = activeItems.reduce((sum, i) => sum + i.val, 0);

  const handlePublishBundle = () => {
    createListing({
      title: `Semester ${selectedSemester} Complete Essentials Bundle (${activeItems.length} items)`,
      categoryId: 'cat-packs',
      mode: 'BUY',
      price: bundlePrice,
      originalNewPrice: activeItems.reduce((sum, i) => sum + i.retail, 0),
      condition: 'EXCELLENT',
      isBundle: true,
      bundleItems: activeItems.map((i) => i.name),
      relevantSemesters: [selectedSemester],
      description: `Passing senior bundle for Semester ${selectedSemester}. Includes: ${activeItems.map((i) => i.name).join(', ')}. Pass it forward to an incoming junior!`,
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
      ],
    });

    onSuccess();
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Passed a Semester? Sell Your Bundle"
      subtitle={`Curate and pass your completed coursework kit to incoming juniors on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <GraduationCap className="h-5 w-5" />
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Semester Selection */}
        <div>
          <label className="text-xs font-bold text-zinc-800 mb-1.5 block">
            Which semester did you just complete?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((sem) => (
              <button
                key={sem}
                type="button"
                onClick={() => setSelectedSemester(sem)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSemester === sem
                    ? 'bg-zinc-950 text-white shadow-2xs'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Items to bundle checklist */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 block">
            Select items you want to include in this bundle:
          </label>

          <div className="space-y-2">
            {itemsToSell.map((item, index) => (
              <div
                key={item.name}
                onClick={() => toggleItem(index)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  item.checked
                    ? 'border-emerald-300 bg-emerald-50/50 shadow-2xs'
                    : 'border-zinc-200 bg-white text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center text-white shrink-0 ${
                      item.checked ? 'bg-emerald-600' : 'border border-zinc-300'
                    }`}
                  >
                    {item.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-bold truncate ${item.checked ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {item.name}
                  </span>
                </div>

                <div className="text-right text-xs shrink-0">
                  <span className="font-bold text-zinc-900">₹{item.val}</span>
                  <span className="text-[10px] text-zinc-400 block line-through">₹{item.retail} new</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Suggestion Card */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              Bundle Price Recommendation
            </span>
            <span className="text-xs text-zinc-600">
              Sum of items: ₹{estimatedValue} &bull; Bundle discount encourages instant sale.
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold text-zinc-700">Set Price: ₹</span>
            <input
              type="number"
              value={bundlePrice}
              onChange={(e) => setBundlePrice(Number(e.target.value) || 0)}
              className="w-24 rounded-xl border border-emerald-300 bg-white p-2 text-sm font-black text-zinc-950 text-center"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handlePublishBundle}
          disabled={activeItems.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 disabled:opacity-40 transition-all"
        >
          <Sparkles className="h-4 w-4" />
          <span>Publish Starter Pack ({activeItems.length} items for ₹{bundlePrice})</span>
        </button>
      </div>
    </ModalWrapper>
  );
};
