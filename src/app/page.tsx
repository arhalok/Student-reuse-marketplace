'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, NeedRequest, Offer } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { CampusBanner } from '@/components/CampusBanner';
import { ListingCard } from '@/components/ListingCard';
import { CreateListingModal } from '@/components/CreateListingModal';
import { NeedBoardModal } from '@/components/NeedBoardModal';
import { SemesterPackModal } from '@/components/SemesterPackModal';
import { SellSemesterModal } from '@/components/SellSemesterModal';
import { OfferModal } from '@/components/OfferModal';
import { ListingDetailsModal } from '@/components/ListingDetailsModal';
import { ActiveOffersModal } from '@/components/ActiveOffersModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ReportModal } from '@/components/ReportModal';
import { CampusHealthDashboardModal } from '@/components/CampusHealthDashboardModal';
import {
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudUpload,
  RefreshCw,
  Compass,
  ArrowRightLeft,
  Activity,
  UserPlus,
} from 'lucide-react';

export default function HomePage() {
  const {
    currentCampus,
    currentProfile,
    categories,
    listings,
    needRequests,
    selectedSemester,
    setSelectedSemester,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMode,
    setSelectedMode,
    resetData,
  } = useMarketplace();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNeedBoardModal, setShowNeedBoardModal] = useState(false);
  const [showSemesterPackModal, setShowSemesterPackModal] = useState(false);
  const [showSellSemesterModal, setShowSellSemesterModal] = useState(false);
  const [showActiveOffersModal, setShowActiveOffersModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [reportListingTarget, setReportListingTarget] = useState<Listing | null>(null);

  // Selected item modal state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offerListing, setOfferListing] = useState<Listing | null>(null);
  const [activeOfferForModal, setActiveOfferForModal] = useState<Offer | null>(null);

  // Quick toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
  };

  // Filter listings
  const filteredListings = listings.filter((l) => {
    // Campus match
    if (l.campusId !== currentCampus.id) return false;

    // Semester match
    if (
      selectedSemester !== 'ALL' &&
      l.relevantSemesters &&
      !l.relevantSemesters.includes(selectedSemester)
    ) {
      return false;
    }

    // Category match
    if (selectedCategory !== 'ALL' && l.categoryId !== selectedCategory) {
      return false;
    }

    // Transaction Mode match
    if (selectedMode !== 'ALL' && l.mode !== selectedMode) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = l.title.toLowerCase().includes(q);
      const matchDesc = l.description?.toLowerCase().includes(q);
      const matchCourse = l.targetCourse?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCourse) return false;
    }

    return true;
  });

  const activeCampusNeeds = needRequests.filter(
    (n) => n.campusId === currentCampus.id && n.status === 'OPEN'
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 text-zinc-900 flex flex-col font-sans">
      {/* Navbar with Campus & Persona Switchers */}
      <Navbar
        onOpenCreateListing={() => setShowCreateModal(true)}
        onOpenNeedBoard={() => setShowNeedBoardModal(true)}
        onOpenSemesterPack={() => setShowSemesterPackModal(true)}
        onOpenSellSemester={() => setShowSellSemesterModal(true)}
        onOpenOffers={() => setShowActiveOffersModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenHealthDashboard={() => setShowHealthModal(true)}
      />

      {/* Guided Walkthrough Banner */}
      <div className="bg-zinc-900 text-white text-xs px-4 py-2 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 text-[10px] border border-emerald-500/30">
              Demo Story Guide
            </span>
            <span>
              Active as <strong>{currentProfile.fullName}</strong> ({currentProfile.degreeProgram}). Switch personas in the top right to test Senior Seller ⇄ Junior Buyer lifecycle.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-[11px] hidden md:inline">
              Ready for Supabase + Vercel Deployment
            </span>
            <button
              onClick={resetData}
              className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] underline"
            >
              <RefreshCw className="h-3 w-3" /> Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-zinc-900 text-white p-4 shadow-2xl border border-zinc-700 max-w-md animate-bounce-short">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-sm mb-0.5">Smart Match Engine Alert</div>
              <p className="text-zinc-300">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero & Campus Sustainability Banner */}
      <CampusBanner onOpenSemesterPack={() => setShowSemesterPackModal(true)} />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Search, Discovery & Procurement Bar (PRD Section 22) */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What do you need right now? (e.g. calculator, drawing kit, math book, lab coat...)"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-10 pr-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Mode & Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Transaction Modes Filter */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-zinc-400 mr-1 text-[11px] uppercase tracking-wider">
                Mode:
              </span>
              {(['ALL', 'BUY', 'EXCHANGE', 'RENT', 'GIVE_AWAY'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMode(m)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    selectedMode === m
                      ? 'bg-zinc-900 text-white shadow-2xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {m === 'GIVE_AWAY' ? 'FREE' : m}
                </button>
              ))}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    selectedCategory === c.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demand Before Supply Spotlight: Need Board Widget (PRD Section 5) */}
        {activeCampusNeeds.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-linear-to-r from-amber-50/70 via-orange-50/40 to-yellow-50/50 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Campus Need Board • Students looking for items right now ({activeCampusNeeds.length})
                </h3>
              </div>
              <button
                onClick={() => setShowNeedBoardModal(true)}
                className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
              >
                <span>View All Requests &amp; Post Needs</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeCampusNeeds.slice(0, 3).map((need) => (
                <div
                  key={need.id}
                  className="rounded-xl border border-amber-200/80 bg-white p-3 shadow-2xs hover:border-amber-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-zinc-900 line-clamp-1">{need.itemTitle}</span>
                    <span className="rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5">
                      Max ₹{need.maxBudget}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-1">
                    {need.notes || 'Looking for senior passing this item'}
                  </p>
                  <div className="mt-2 pt-2 border-t border-zinc-100 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Cond: {need.preferredCondition}</span>
                    <button
                      onClick={() => {
                        setShowCreateModal(true);
                      }}
                      className="font-bold text-amber-800 hover:underline"
                    >
                      I have this →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Listings Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-extrabold text-zinc-900">
                Active Campus Items for Reuse
              </h2>
              <p className="text-xs text-zinc-500">
                {filteredListings.length} items available on {currentCampus.name}
              </p>
            </div>

            {selectedSemester !== 'ALL' && (
              <span className="rounded-full bg-zinc-900 text-white text-xs font-semibold px-3 py-1">
                Semester {selectedSemester} Filter Active
              </span>
            )}
          </div>

          {filteredListings.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center space-y-3">
              <Compass className="h-8 w-8 text-zinc-400 mx-auto" />
              <div className="font-bold text-zinc-900 text-sm">No items found matching your filters</div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                No active listing found. Post a request on the <strong>Need Board</strong> so seniors know what to list!
              </p>
              <button
                onClick={() => setShowNeedBoardModal(true)}
                className="mt-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700"
              >
                Post on Need Board
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSelect={(item) => setSelectedListing(item)}
                  onMakeOffer={(item) => {
                    setOfferListing(item);
                    setActiveOfferForModal(null);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Vercel & Supabase Deployment Readiness Footer Banner */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-900 text-white p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-md bg-emerald-500 text-black text-[10px] font-black px-2 py-0.5 uppercase tracking-wider">
                  Deploy Ready
                </span>
                <span className="text-xs font-bold text-zinc-300">
                  Next.js App Router • Supabase Database • Vercel Ready
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                How to deploy to Vercel and Supabase:
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                1) Paste <code>supabase/schema.sql</code> into your Supabase SQL editor. 2) Set <code>NEXT_PUBLIC_SUPABASE_URL</code> &amp; <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Vercel. 3) Deploy in 1 click!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#readme"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Deployment Checklist:\n1. Open Supabase -> SQL Editor -> Run supabase/schema.sql\n2. In Vercel -> New Project -> Import Repository\n3. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n4. Deploy!"
                  );
                }}
                className="rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                View Deployment Guide
              </a>
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-colors"
              >
                Create Listing Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">CampuShare</span>
            <span>• Student Reuse Marketplace</span>
          </div>
          <div>
            Built on core principle: <em>Buy less. Reuse more. Spend less.</em>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateListingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(matchedCount) => {
          if (matchedCount > 0) {
            showToast(
              `🎉 Matching Need Request Found! ${matchedCount} student(s) on your campus were waiting for this item on the Need Board.`
            );
          } else {
            showToast('Item successfully published to your campus reuse marketplace!');
          }
        }}
      />

      <NeedBoardModal
        isOpen={showNeedBoardModal}
        onClose={() => setShowNeedBoardModal(false)}
        onViewListing={(listingId) => {
          const l = listings.find((item) => item.id === listingId);
          if (l) setSelectedListing(l);
          setShowNeedBoardModal(false);
        }}
        onCreateMatchingListing={(need) => {
          setShowNeedBoardModal(false);
          setShowCreateModal(true);
        }}
      />

      <SemesterPackModal
        isOpen={showSemesterPackModal}
        onClose={() => setShowSemesterPackModal(false)}
        onFilterSemesterListings={(sem) => {
          setSelectedSemester(sem);
        }}
      />

      <SellSemesterModal
        isOpen={showSellSemesterModal}
        onClose={() => setShowSellSemesterModal(false)}
        onSuccess={() => {
          showToast('🎓 Semester Pack Bundle successfully published for incoming juniors!');
        }}
      />

      <ListingDetailsModal
        isOpen={Boolean(selectedListing)}
        onClose={() => setSelectedListing(null)}
        listing={selectedListing}
        onMakeOffer={(item) => {
          setSelectedListing(null);
          setOfferListing(item);
          setActiveOfferForModal(null);
        }}
        onReport={(item) => {
          setReportListingTarget(item);
        }}
      />

      <OfferModal
        isOpen={Boolean(offerListing)}
        onClose={() => setOfferListing(null)}
        listing={offerListing}
        activeOffer={activeOfferForModal}
      />

      <ActiveOffersModal
        isOpen={showActiveOffersModal}
        onClose={() => setShowActiveOffersModal(false)}
        onSelectOffer={(offer, listing) => {
          setOfferListing(listing);
          setActiveOfferForModal(offer);
        }}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={(name) => {
          showToast(`Welcome ${name}! Your verified campus profile is now active.`);
        }}
      />

      <ReportModal
        isOpen={Boolean(reportListingTarget)}
        onClose={() => setReportListingTarget(null)}
        listing={reportListingTarget}
        onSuccess={() => {
          showToast('Report submitted to campus moderation team.');
        }}
      />

      <CampusHealthDashboardModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
      />
    </div>
  );
}
