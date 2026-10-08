'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ItemCondition, NeedRequest } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  Layers,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Bell,
  ArrowRight,
  Send,
  X,
  Filter,
} from 'lucide-react';

interface NeedBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewListing: (listingId: string) => void;
  onCreateMatchingListing: (need: NeedRequest) => void;
}

export const NeedBoardModal: React.FC<NeedBoardModalProps> = ({
  isOpen,
  onClose,
  onViewListing,
  onCreateMatchingListing,
}) => {
  const {
    needRequests,
    createNeedRequest,
    currentCampus,
    currentProfile,
    categories,
    listings,
  } = useMarketplace();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [maxBudget, setMaxBudget] = useState<number | ''>(850);
  const [preferredCondition, setPreferredCondition] = useState<ItemCondition>('EXCELLENT');
  const [requiredByDate, setRequiredByDate] = useState('2026-10-25');
  const [notes, setNotes] = useState('');
  const [targetSemester, setTargetSemester] = useState<number>(2);
  const [matchNotification, setMatchNotification] = useState<{ count: number; listingId?: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    const { need, matchedListingsCount } = createNeedRequest({
      itemTitle,
      maxBudget: Number(maxBudget) || 1000,
      preferredCondition,
      requiredByDate,
      notes,
      targetSemester,
    });

    setMatchNotification({
      count: matchedListingsCount,
      listingId: need.matchedListingId,
    });
    setShowCreateForm(false);
    setItemTitle('');
    setNotes('');
  };

  const campusNeeds = needRequests.filter((n) => n.campusId === currentCampus.id);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Campus Need Board"
      subtitle={`Demand before supply: Seniors see what juniors need on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
          <Layers className="h-5 w-5" />
        </div>
      }
      badge={
        <span className="rounded-full bg-amber-100 text-amber-950 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
          Reverse Marketplace
        </span>
      }
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Proactive Match Notification Banner */}
        {matchNotification !== null && (
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-modal-in">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                {matchNotification.count > 0 ? (
                  <>
                    <strong>Match found!</strong> There are {matchNotification.count} active listing(s) matching your request.
                  </>
                ) : (
                  <>
                    <strong>Your request is live on {currentCampus.shortCode}!</strong> Relevant seniors will be alerted as soon as they list it.
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {matchNotification.listingId && (
                <button
                  onClick={() => {
                    if (matchNotification.listingId) {
                      onViewListing(matchNotification.listingId);
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-2xs"
                >
                  View Matched Listing →
                </button>
              )}
              <button
                onClick={() => setMatchNotification(null)}
                className="text-emerald-800 font-bold hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <span className="text-xs font-semibold text-zinc-700">
            {campusNeeds.length} Student Requests Looking for Items
          </span>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{showCreateForm ? 'Cancel Request' : 'Post What You Need'}</span>
          </button>
        </div>

        {/* Create Request Drawer Form */}
        {showCreateForm && (
          <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-amber-200 bg-amber-50/30 space-y-4 animate-modal-in">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Bell className="h-4 w-4 text-amber-600" />
                Broadcast Demand to Campus
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">Item You Need *</label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Casio FX-991CW under ₹900"
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-amber-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Maximum Budget (₹) *</label>
                <input
                  type="number"
                  required
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value) || '')}
                  placeholder="900"
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-amber-600 focus:outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Acceptable Condition</label>
                <select
                  value={preferredCondition}
                  onChange={(e) => setPreferredCondition(e.target.value as ItemCondition)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900"
                >
                  <option value="LIKE_NEW">Like New</option>
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good (Light wear)</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Required By Date</label>
                <input
                  type="date"
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-800 block mb-1">Course / Urgency Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needed for upcoming Monday mid-sem exam, can meet at SAC cafe."
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-amber-600 focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publish Request</span>
              </button>
            </div>
          </form>
        )}

        {/* Requests Feed */}
        <div className="space-y-3">
          {campusNeeds.map((need) => (
            <div
              key={need.id}
              className="p-4 rounded-2xl border border-zinc-200/80 bg-white hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-zinc-900">{need.itemTitle}</span>
                  <span className="rounded-lg bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5">
                    Max ₹{need.maxBudget}
                  </span>
                  <span className="rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-semibold px-2 py-0.5">
                    Cond: {need.preferredCondition.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  {need.notes || 'Looking for fellow student or senior passing this item.'}
                </p>

                {need.requiredByDate && (
                  <span className="text-[11px] text-zinc-400 block">
                    Needed by: {need.requiredByDate}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {need.matchedListingId ? (
                  <button
                    onClick={() => onViewListing(need.matchedListingId!)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>View Match</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onCreateMatchingListing(need)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80 text-xs font-bold transition-colors"
                  >
                    <span>I have this →</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalWrapper>
  );
};
