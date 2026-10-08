'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowLeft,
  Layers,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageSquare,
  Plus,
} from 'lucide-react';

function NeedDetailContent() {
  const params = useParams();
  const router = useRouter();
  const needId = params.id as string;

  const {
    needRequests,
    listings,
    currentCampus,
    currentProfile,
  } = useMarketplace();

  const need = needRequests.find((n) => n.id === needId);

  if (!need) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8 bg-zinc-50">
        <div className="text-center space-y-3 max-w-sm">
          <div className="text-3xl">📋</div>
          <h2 className="text-lg font-black text-zinc-950">Request Not Found</h2>
          <p className="text-xs text-zinc-500">
            This student request may have already been fulfilled or closed.
          </p>
          <Link
            href="/needs"
            className="inline-block px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
          >
            Return to Need Board
          </Link>
        </div>
      </div>
    );
  }

  const buyer = INITIAL_PROFILES[need.buyerId] || currentProfile;
  const isOwner = need.buyerId === currentProfile.id;

  // Find candidate listings matching this need
  const matchingListings = listings.filter((l) =>
    l.campusId === currentCampus.id &&
    l.status === 'ACTIVE' &&
    (l.title.toLowerCase().includes(need.itemTitle.toLowerCase()) ||
      need.itemTitle.toLowerCase().includes(l.title.toLowerCase()))
  );

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Need Board</span>
          </button>
          <span className="text-xs text-zinc-400 font-medium">Request #{need.id}</span>
        </div>

        {/* Main Request Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 text-amber-950 text-xs font-black px-2.5 py-0.5 border border-amber-200">
                  <Layers className="h-3 w-3" />
                  Campus Demand
                </span>
                {need.targetSemester && (
                  <span className="rounded-full bg-zinc-100 text-zinc-700 text-xs font-bold px-2.5 py-0.5">
                    Semester {need.targetSemester}
                  </span>
                )}
                {need.status === 'MATCHED' && (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5">
                    ✓ Matched
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950">
                {need.itemTitle}
              </h1>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-center sm:text-right shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Max Student Budget
              </span>
              <span className="text-2xl font-black text-zinc-950">₹{need.maxBudget}</span>
            </div>
          </div>

          {/* Details breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Acceptable Condition
              </span>
              <strong className="text-sm font-bold text-zinc-900 block mt-0.5">
                {need.preferredCondition.replace('_', ' ')} or better
              </strong>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Required By Date
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <strong className="text-sm font-bold text-zinc-900">
                  {need.requiredByDate || 'Anytime this semester'}
                </strong>
              </div>
            </div>
          </div>

          {need.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                Specific Notes from Student
              </span>
              <p className="text-xs text-zinc-800 leading-relaxed">{need.notes}</p>
            </div>
          )}

          {/* Requesting Student Profile Card */}
          <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={buyer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={buyer.fullName}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-zinc-900">{buyer.fullName}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <p className="text-xs text-zinc-500">
                  {buyer.degreeProgram} &bull; Year {buyer.currentYear || 1} &bull; {currentCampus.shortCode}
                </p>
              </div>
            </div>

            {!isOwner && (
              <div className="flex items-center gap-2">
                <Link
                  href={`/messages?buyerId=${buyer.id}`}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-800 hover:bg-zinc-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Message Student</span>
                </Link>

                <Link
                  href={`/sell/create?needId=${need.id}&title=${encodeURIComponent(
                    need.itemTitle
                  )}&budget=${need.maxBudget}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
                >
                  <span>Sell Mine to Student</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Existing Matching Listings on Campus */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Available on Campus Right Now ({matchingListings.length})</span>
            </h2>
          </div>

          {matchingListings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center space-y-3">
              <p className="text-xs font-bold text-zinc-700">No active listings matching this yet</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Are you a senior who took this course? List yours now to instantly fulfill this junior&apos;s request.
              </p>
              <Link
                href={`/sell/create?needId=${need.id}&title=${encodeURIComponent(
                  need.itemTitle
                )}&budget=${need.maxBudget}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>List This Item</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchingListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:shadow-xs transition-all flex items-center gap-4 group"
                >
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    className="h-16 w-16 rounded-xl object-cover ring-1 ring-zinc-200 shrink-0 group-hover:scale-102 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-zinc-900 truncate">{item.title}</h3>
                    <p className="text-[11px] text-zinc-500">
                      Condition: {item.condition.replace('_', ' ')}
                    </p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-sm font-black text-zinc-950">₹{item.price}</span>
                      {item.price <= need.maxBudget && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Within Budget
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NeedDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading student request...</div>}>
      <NeedDetailContent />
    </Suspense>
  );
}
