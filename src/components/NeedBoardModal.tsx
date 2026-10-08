'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ItemCondition, NeedRequest } from '@/lib/types';
import {
  Layers,
  X,
  Plus,
  Sparkles,
  Calendar,
  DollarSign,
  CheckCircle2,
  Bell,
  ArrowRight,
  Send,
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
  const [requiredByDate, setRequiredByDate] = useState('2026-10-18');
  const [notes, setNotes] = useState('');
  const [targetSemester, setTargetSemester] = useState<number>(2);
  const [matchNotification, setMatchNotification] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemTitle.trim()) return;

    const { matchedListingsCount } = createNeedRequest({
      itemTitle,
      maxBudget: Number(maxBudget) || 1000,
      preferredCondition,
      requiredByDate,
      notes,
      targetSemester,
    });

    setMatchNotification(matchedListingsCount);
    setShowCreateForm(false);
    setItemTitle('');
    setNotes('');
  };

  const campusNeeds = needRequests.filter((n) => n.campusId === currentCampus.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-zinc-900 text-lg">Need Board</h2>
                <span className="rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                  Demand Engine (Reverse Marketplace)
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Can&apos;t find what you need? Post a request. We match sellers when they list it.
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

        {/* Notification Banner if Matched */}
        {matchNotification !== null && (
          <div className="border-b border-emerald-200 bg-emerald-50 p-3.5 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-emerald-900 font-semibold">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>
                {matchNotification > 0
                  ? `Success! We found ${matchNotification} matching active listing(s) on your campus!`
                  : 'Your request is live on the campus board! You will be alerted as soon as a senior lists it.'}
              </span>
            </div>
            <button
              onClick={() => setMatchNotification(null)}
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Action bar */}
        <div className="border-b border-zinc-100 px-6 py-3 flex items-center justify-between bg-zinc-50/50">
          <span className="text-xs font-semibold text-zinc-600">
            {campusNeeds.length} Student Requests Active on {currentCampus.shortCode}
          </span>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition-colors shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{showCreateForm ? 'Close Form' : 'Post a Need Request'}</span>
          </button>
        </div>

        {/* Create Form Drawer */}
        {showCreateForm && (
          <form onSubmit={handleSubmit} className="border-b border-zinc-200 bg-amber-50/20 p-6 space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-amber-600" />
              Post What You Are Looking For
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Item Name / Model *
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Casio FX-991CW or Engineering Drawing Kit"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Max Budget (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="850"
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Target Semester
                </label>
                <select
                  value={targetSemester}
                  onChange={(e) => setTargetSemester(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                  <option value={3}>Semester 3</option>
                  <option value={4}>Semester 4</option>
                  <option value={5}>Semester 5+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Acceptable Condition
                </label>
                <select
                  value={preferredCondition}
                  onChange={(e) => setPreferredCondition(e.target.value as ItemCondition)}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                >
                  <option value="LIKE_NEW">Like New only</option>
                  <option value="EXCELLENT">Excellent or better</option>
                  <option value="GOOD">Good (Fully usable)</option>
                  <option value="FAIR">Fair (Visible wear ok)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Required By Date
                </label>
                <input
                  type="date"
                  value={requiredByDate}
                  onChange={(e) => setRequiredByDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Context / Notes for Seniors
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Needed for mid-term differential equations exam; can meet at SAC cafe."
                className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
              >
                Post Need &amp; Trigger Match
              </button>
            </div>
          </form>
        )}

        {/* List of Requests */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {campusNeeds.map((need) => {
            const matchedListing = need.matchedListingId
              ? listings.find((l) => l.id === need.matchedListingId)
              : listings.find(
                  (l) =>
                    l.campusId === need.campusId &&
                    l.price <= need.maxBudget &&
                    l.title.toLowerCase().includes(need.itemTitle.toLowerCase().split(' ')[0])
                );

            const isRequester = need.buyerId === currentProfile.id;

            return (
              <div
                key={need.id}
                className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 transition-all shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-zinc-900 text-sm">{need.itemTitle}</h4>
                      <span className="rounded-md bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 border border-amber-200">
                        Max Budget: ₹{need.maxBudget}
                      </span>
                      {need.targetSemester && (
                        <span className="rounded-md bg-zinc-100 text-zinc-700 text-[10px] font-medium px-2 py-0.5">
                          Sem {need.targetSemester}
                        </span>
                      )}
                    </div>
                    {need.notes && (
                      <p className="mt-1 text-xs text-zinc-600">&ldquo;{need.notes}&rdquo;</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-400">
                      <span>Condition: {need.preferredCondition.replace('_', ' ')}</span>
                      {need.requiredByDate && <span>• Needed by {need.requiredByDate}</span>}
                      <span>• Posted by {isRequester ? 'You' : 'Student Peer'}</span>
                    </div>
                  </div>

                  {/* Actions / Match Badge */}
                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    {matchedListing ? (
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Listing Available: ₹{matchedListing.price}</span>
                        </span>
                        <button
                          onClick={() => onViewListing(matchedListing.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>View Match</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md">
                          Waiting for seller
                        </span>
                        {!isRequester && (
                          <button
                            onClick={() => onCreateMatchingListing(need)}
                            className="rounded-lg bg-zinc-900 px-3 py-1 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors"
                          >
                            I have this! List it
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
