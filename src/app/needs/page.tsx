'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import {
  Layers,
  Plus,
  Sparkles,
  Calendar,
  ArrowRight,
  Filter,
  Search,
} from 'lucide-react';
import { INITIAL_PROFILES } from '@/lib/mock-data';

export default function NeedBoardPage() {
  const { needRequests, currentCampus, currentProfile } = useMarketplace();

  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'MATCHED'>('OPEN');
  const [searchQuery, setSearchQuery] = useState('');

  const campusNeeds = needRequests.filter((n) => n.campusId === currentCampus.id);

  const filteredNeeds = campusNeeds.filter((need) => {
    if (selectedSemester !== 'ALL' && need.targetSemester !== selectedSemester) return false;
    if (filterStatus === 'OPEN' && need.status !== 'OPEN') return false;
    if (filterStatus === 'MATCHED' && need.status !== 'MATCHED' && need.status !== 'FULFILLED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = need.itemTitle.toLowerCase().includes(q);
      const matchNotes = need.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold">
                <Layers className="h-3.5 w-3.5" />
                <span>Demand Before Supply &bull; Reverse Marketplace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Campus Need Board
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Can&apos;t find an item on {currentCampus.name}? Post what you need. Seniors check this board to sell exactly what juniors are asking for.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/needs/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-98 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Post What You Need</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-zinc-100 text-center">
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-zinc-950 block">
                {campusNeeds.filter((n) => n.status === 'OPEN').length}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Open Requests</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-emerald-700 block">
                {campusNeeds.filter((n) => n.status === 'MATCHED' || n.status === 'FULFILLED').length}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Matched & Handed Off</span>
            </div>
            <div className="p-3 rounded-2xl bg-zinc-50">
              <strong className="text-lg font-black text-amber-700 block">
                ₹{campusNeeds.reduce((acc, curr) => acc + curr.maxBudget, 0).toLocaleString()}
              </strong>
              <span className="text-[11px] text-zinc-500 font-medium">Active Junior Demand</span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search requested books, calculators, lab items..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('OPEN')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  filterStatus === 'OPEN'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Open Demand ({campusNeeds.filter((n) => n.status === 'OPEN').length})
              </button>
              <button
                onClick={() => setFilterStatus('MATCHED')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  filterStatus === 'MATCHED'
                    ? 'bg-zinc-950 text-white'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Fulfilled
              </button>
            </div>
          </div>

          {/* Semester Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Semester:
            </span>
            <button
              onClick={() => setSelectedSemester('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSemester === 'ALL'
                  ? 'bg-amber-500 text-zinc-950 shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              All Semesters
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedSemester === sem
                    ? 'bg-amber-500 text-zinc-950 shadow-xs'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                Sem {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Needs Feed Grid */}
        {filteredNeeds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Layers className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900">No Student Needs Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No open student requests matched your current filter. Post what you need to alert seniors across {currentCampus.shortCode}.
              </p>
            </div>
            <Link
              href="/needs/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Post Request</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNeeds.map((need) => {
              const buyer = INITIAL_PROFILES[need.buyerId] || currentProfile;
              const isOwner = need.buyerId === currentProfile.id;

              return (
                <div
                  key={need.id}
                  className="rounded-3xl border border-zinc-200 bg-white p-5 hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {need.targetSemester && (
                          <span className="rounded-lg bg-amber-100 text-amber-950 text-[10px] font-black px-2 py-0.5 border border-amber-200">
                            Sem {need.targetSemester}
                          </span>
                        )}
                        <span className="rounded-lg bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2 py-0.5">
                          Condition: {need.preferredCondition.replace('_', ' ')}
                        </span>
                        {need.status === 'MATCHED' && (
                          <span className="rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">
                            ✓ Matched
                          </span>
                        )}
                      </div>

                      {need.requiredByDate && (
                        <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 shrink-0">
                          <Calendar className="h-3 w-3" />
                          Needed by {need.requiredByDate}
                        </span>
                      )}
                    </div>

                    <div>
                      <h2 className="text-base font-black text-zinc-950 hover:text-amber-600 transition-colors">
                        <Link href={`/needs/${need.id}`}>{need.itemTitle}</Link>
                      </h2>
                      {need.notes && (
                        <p className="text-xs text-zinc-600 mt-1 line-clamp-2">
                          {need.notes}
                        </p>
                      )}
                    </div>

                    {/* Student Identity */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <img
                        src={buyer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                        alt={buyer.fullName}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-zinc-200"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-zinc-900">{buyer.fullName}</span>
                        <span className="text-zinc-400 ml-1.5 text-[11px]">
                          {buyer.degreeProgram}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                        Max Student Budget
                      </span>
                      <span className="text-lg font-black text-zinc-950">
                        ₹{need.maxBudget}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/needs/${need.id}`}
                        className="px-3 py-2 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs transition-colors"
                      >
                        Details
                      </Link>

                      {!isOwner ? (
                        <Link
                          href={`/sell/create?needId=${need.id}&title=${encodeURIComponent(
                            need.itemTitle
                          )}&budget=${need.maxBudget}`}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs active:scale-98 transition-all flex items-center gap-1.5"
                        >
                          <span>I Have This &bull; Sell</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <span className="text-xs font-bold text-zinc-400 px-3 py-2">
                          Your Request
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Senior Monetization Callout */}
        <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-sm font-black text-amber-950 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Are you a 2nd, 3rd, or 4th Year Senior?</span>
            </h3>
            <p className="text-xs text-amber-800">
              Clear out your drafters, previous semester books, lab manuals, and tools. Juniors have cash ready for direct campus handoffs.
            </p>
          </div>

          <Link
            href="/sell/clearout"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-bold text-xs transition-colors"
          >
            Start Semester Clear-Out
          </Link>
        </div>
      </div>
    </div>
  );
}
