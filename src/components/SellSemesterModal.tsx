'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import {
  GraduationCap,
  X,
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
  const { currentProfile, createListing } = useMarketplace();

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

  const handleGiveAwayAll = () => {
    createListing({
      title: `Free Semester ${selectedSemester} Junior Gift Pack (${activeItems.length} items)`,
      categoryId: 'cat-packs',
      mode: 'GIVE_AWAY',
      price: 0,
      condition: 'GOOD',
      isBundle: true,
      bundleItems: activeItems.map((i) => i.name),
      relevantSemesters: [selectedSemester],
      description: `Passing these items down to any 1st/2nd year junior in need. Collect at Library foyer.`,
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
      ],
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-linear-to-r from-emerald-50 via-teal-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-zinc-900 text-lg">Passed Semester? Clear Your Supplies</h2>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  Senior → Junior Loop
                </span>
              </div>
              <p className="text-xs text-zinc-600">
                You completed your semester. Juniors need these exact items right now.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Semester Selection */}
        <div className="p-4 px-6 border-b border-zinc-100 bg-zinc-50 flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-700">Which semester did you just complete?</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSemester(s)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                  selectedSemester === s
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                Sem {s}
              </button>
            ))}
          </div>
        </div>

        {/* Items Checklist */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Select items you no longer need:
            </span>
            <span className="text-xs font-bold text-emerald-700">
              Est. Resale Value: ₹{estimatedValue}
            </span>
          </div>

          <div className="space-y-2">
            {itemsToSell.map((item, index) => (
              <div
                key={item.name}
                onClick={() => toggleItem(index)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  item.checked
                    ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                    : 'border-zinc-200 bg-white text-zinc-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-md flex items-center justify-center border ${
                      item.checked
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-zinc-300 bg-white'
                    }`}
                  >
                    {item.checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold text-zinc-800">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-zinc-900">₹{item.val}</span>
                  <div className="text-[10px] text-zinc-400 line-through">₹{item.retail} new</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Box */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-zinc-800">Bundle Price for Juniors:</span>
              <p className="text-[11px] text-zinc-500">Sell everything in 1 pickup instead of multiple meetings</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-600">₹</span>
              <input
                type="number"
                value={bundlePrice}
                onChange={(e) => setBundlePrice(Number(e.target.value))}
                className="w-28 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-bold text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-zinc-100 bg-zinc-50/70 p-4 px-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleGiveAwayAll}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <HeartHandshake className="h-4 w-4 text-emerald-600" />
            <span>Donate / Give Away to Juniors Free</span>
          </button>

          <button
            onClick={handlePublishBundle}
            disabled={activeItems.length === 0}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-200 transition-colors"
          >
            <Package className="h-4 w-4" />
            <span>Publish Semester {selectedSemester} Bundle (₹{bundlePrice})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
