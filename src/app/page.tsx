'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, NeedRequest, Offer } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { CampusBanner } from '@/components/CampusBanner';
import { ListingCard } from '@/components/ListingCard';
import { IntelligentSearch } from '@/components/IntelligentSearch';
import { CategoryGrid } from '@/components/CategoryGrid';
import { NeedBoardSpotlight } from '@/components/NeedBoardSpotlight';
import { SemesterPackBanner } from '@/components/SemesterPackBanner';
import { SafeCampusExchangeSection } from '@/components/SafeCampusExchangeSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';

// Modals
import { CreateListingModal } from '@/components/CreateListingModal';
import { NeedBoardModal } from '@/components/NeedBoardModal';
import { SemesterPackModal } from '@/components/SemesterPackModal';
import { SellSemesterModal } from '@/components/SellSemesterModal';
import { OfferModal } from '@/components/OfferModal';
import { ListingDetailsModal } from '@/components/ListingDetailsModal';
import { ActiveOffersModal } from '@/components/ActiveOffersModal';
import { SavedItemsModal } from '@/components/SavedItemsModal';
import { NotificationModal } from '@/components/NotificationModal';
import { StudentProfileModal } from '@/components/StudentProfileModal';
import { OnboardingModal } from '@/components/OnboardingModal';
import { ReportModal } from '@/components/ReportModal';
import { CampusHealthDashboardModal } from '@/components/CampusHealthDashboardModal';
import { Toast } from '@/components/ui/Toast';

import {
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Compass,
  ArrowRightLeft,
  Activity,
  UserPlus,
  SlidersHorizontal,
  Flame,
  Tag,
  BookOpen,
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
    sortOption,
    setSortOption,
    savedListingIds,
    resetData,
  } = useMarketplace();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalPrefill, setCreateModalPrefill] = useState<{ title: string; budget?: number }>({
    title: '',
  });
  const [showNeedBoardModal, setShowNeedBoardModal] = useState(false);
  const [showSemesterPackModal, setShowSemesterPackModal] = useState(false);
  const [showSellSemesterModal, setShowSellSemesterModal] = useState(false);
  const [showActiveOffersModal, setShowActiveOffersModal] = useState(false);
  const [showSavedItemsModal, setShowSavedItemsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [reportListingTarget, setReportListingTarget] = useState<Listing | null>(null);

  // Selected item modal state
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offerListing, setOfferListing] = useState<Listing | null>(null);
  const [activeOfferForModal, setActiveOfferForModal] = useState<Offer | null>(null);

  // Mobile filters sheet state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Quick toast state
  const [toastData, setToastData] = useState<{ message: string; title?: string } | null>(null);

  const showToast = (message: string, title?: string) => {
    setToastData({ message, title });
    setTimeout(() => setToastData(null), 5000);
  };

  // 1. Filter listings
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

  // 2. Sort listings
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case 'NEWEST':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'PRICE_LOW':
        return a.price - b.price;
      case 'PRICE_HIGH':
        return b.price - a.price;
      case 'BEST_SAVINGS': {
        const savA = a.originalNewPrice ? (a.originalNewPrice - a.price) / a.originalNewPrice : 0;
        const savB = b.originalNewPrice ? (b.originalNewPrice - b.price) / b.originalNewPrice : 0;
        return savB - savA;
      }
      case 'RECOMMENDED':
      default:
        return 0;
    }
  });

  // 3. Editorial subsets
  const bestDeals = listings.filter((l) => {
    if (l.campusId !== currentCampus.id) return false;
    if (!l.originalNewPrice) return false;
    const sav = (l.originalNewPrice - l.price) / l.originalNewPrice;
    return sav >= 0.4 && l.status === 'ACTIVE';
  });

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-950 flex flex-col font-sans antialiased pb-20 sm:pb-0">
      {/* Top Demo Simulation Banner */}
      <aside aria-label="Demo Bar" className="bg-zinc-950 text-white text-xs px-4 py-2 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 text-[10px] border border-emerald-500/30">
              Campus Simulation
            </span>
            <span className="text-zinc-300">
              Signed in as <strong>{currentProfile.fullName}</strong> ({currentProfile.degreeProgram}).
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfileModal(true)}
              className="text-zinc-400 hover:text-white text-[11px] underline"
            >
              Switch Persona
            </button>
            <button
              onClick={resetData}
              className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px] underline"
            >
              <RefreshCw className="h-3 w-3" /> Reset Data
            </button>
          </div>
        </div>
      </aside>

      {/* Global Navigation (Desktop Header + Mobile Bottom Bar) */}
      <Navbar
        onOpenCreateListing={() => {
          setCreateModalPrefill({ title: '' });
          setShowCreateModal(true);
        }}
        onOpenNeedBoard={() => setShowNeedBoardModal(true)}
        onOpenSemesterPack={() => setShowSemesterPackModal(true)}
        onOpenSellSemester={() => setShowSellSemesterModal(true)}
        onOpenOffers={() => setShowActiveOffersModal(true)}
        onOpenSavedItems={() => setShowSavedItemsModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
        onOpenHealthDashboard={() => setShowHealthModal(true)}
      />

      {/* Toast Alert */}
      {toastData && (
        <Toast
          message={toastData.message}
          title={toastData.title}
          onClose={() => setToastData(null)}
        />
      )}

      {/* 1. Hero & Campus Sustainability Banner */}
      <CampusBanner
        onOpenSemesterPack={() => setShowSemesterPackModal(true)}
        onOpenCreateListing={() => {
          setCreateModalPrefill({ title: '' });
          setShowCreateModal(true);
        }}
      />

      {/* Main Content Feed */}
      <main className="mx-auto max-w-7xl flex-1 px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        {/* 2. Intelligent Campus Search Bar */}
        <IntelligentSearch />

        {/* 3. Category Discovery Grid */}
        <CategoryGrid />

        {/* 4. Need Board Spotlight (Reverse Demand Engine) */}
        <NeedBoardSpotlight
          onOpenNeedBoard={() => setShowNeedBoardModal(true)}
          onOpenCreateListingForNeed={(need) => {
            setCreateModalPrefill({ title: need.itemTitle, budget: need.maxBudget });
            setShowCreateModal(true);
          }}
        />

        {/* 5. Best Deals Spotlight (High % Discounted Items) */}
        {bestDeals.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                    Best Campus Deals
                  </h2>
                  <p className="text-xs text-zinc-500 font-normal">
                    Verified items with over 40% savings vs. retail
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestDeals.slice(0, 4).map((listing) => (
                <ListingCard
                  key={`deal-${listing.id}`}
                  listing={listing}
                  onSelect={(item) => setSelectedListing(item)}
                  onMakeOffer={(item) => {
                    setOfferListing(item);
                    setActiveOfferForModal(null);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {/* 6. Main Marketplace Catalog */}
        <section id="marketplace-catalog" className="space-y-6 pt-4">
          {/* Section Header & Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/90">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
                Fresh on Campus
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-normal">
                {sortedListings.length} reusable essentials available on {currentCampus.name}
              </p>
            </div>

            {/* Sort & Filter Controls */}
            <div className="flex items-center gap-2.5">
              {/* Semester Filter Indicator Pill */}
              {selectedSemester !== 'ALL' && (
                <span className="rounded-xl bg-zinc-950 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5">
                  <BookOpen className="h-3 w-3 text-emerald-400" />
                  <span>Sem {selectedSemester}</span>
                  <button
                    onClick={() => setSelectedSemester('ALL')}
                    className="ml-1 text-zinc-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Category Filter Indicator Pill */}
              {selectedCategory !== 'ALL' && (
                <span className="rounded-xl bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 flex items-center gap-1.5">
                  <Tag className="h-3 w-3" />
                  <span>Filtered</span>
                  <button
                    onClick={() => setSelectedCategory('ALL')}
                    className="ml-1 text-emerald-200 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Sort Selector Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-zinc-400 hidden sm:inline">Sort:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  className="rounded-xl border border-zinc-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-800 shadow-2xs focus:border-emerald-600 focus:outline-hidden"
                >
                  <option value="RECOMMENDED">Recommended</option>
                  <option value="NEWEST">Newest Listings</option>
                  <option value="PRICE_LOW">Price: Low → High</option>
                  <option value="PRICE_HIGH">Price: High → Low</option>
                  <option value="BEST_SAVINGS">Highest Savings %</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid / Empty State */}
          {sortedListings.length === 0 ? (
            <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                <Compass className="h-7 w-7" />
              </div>
              <div className="font-extrabold text-zinc-950 text-base">
                No items found matching your filters
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
                No active listing found. Post a request on the <strong>Need Board</strong> so passing seniors know you need it!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setShowNeedBoardModal(true)}
                  className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-amber-700 shadow-xs"
                >
                  Post on Need Board
                </button>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedMode('ALL');
                    setSelectedSemester('ALL');
                  }}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {sortedListings.map((listing) => (
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
        </section>

        {/* 7. Semester Starter Pack Bundle Experience */}
        <SemesterPackBanner
          onOpenSemesterPack={() => setShowSemesterPackModal(true)}
          onOpenSellSemester={() => setShowSellSemesterModal(true)}
        />

        {/* 8. Safe Campus Exchange Section */}
        <SafeCampusExchangeSection />

        {/* 9. How Campus Reuse Works */}
        <HowItWorksSection
          onOpenCreateListing={() => {
            setCreateModalPrefill({ title: '' });
            setShowCreateModal(true);
          }}
        />

        {/* 10. Final Call to Action */}
        <section className="rounded-3xl border border-zinc-200 bg-zinc-950 text-white p-8 sm:p-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Join Your Campus Circular Community</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white max-w-xl mx-auto">
            Got academic gear sitting in a drawer? Give it another semester.
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            List in under 60 seconds. Keep textbook costs down and academic supplies inside your college.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setCreateModalPrefill({ title: '' });
                setShowCreateModal(true);
              }}
              className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              List an Item on Campus (&lt; 60s)
            </button>
            <button
              onClick={() => setShowNeedBoardModal(true)}
              className="px-5 py-3 rounded-2xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs sm:text-sm font-bold transition-all"
            >
              Browse What Students Need
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/90 bg-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs">
              CS
            </div>
            <span className="font-extrabold text-zinc-900 text-sm">CampuShare</span>
            <span>&bull; Campus-First Student Reuse Marketplace</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-zinc-400">
            Core thesis: <em>Buy less. Reuse more. Spend less.</em> &bull; Running on {currentCampus.name}
          </div>
        </div>
      </footer>

      {/* ALL MODALS (Standardized Modal System) */}
      <CreateListingModal
        isOpen={showCreateModal}
        prefilledTitle={createModalPrefill.title}
        prefilledBudget={createModalPrefill.budget}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(matchedCount) => {
          if (matchedCount > 0) {
            showToast(
              `Matching Need Request Found! ${matchedCount} student(s) were waiting for this item on the Need Board.`,
              'Smart Match Alert'
            );
          } else {
            showToast('Item successfully published to your campus reuse marketplace!', 'Listing Published');
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
          setCreateModalPrefill({ title: need.itemTitle, budget: need.maxBudget });
          setShowCreateModal(true);
        }}
      />

      <SemesterPackModal
        isOpen={showSemesterPackModal}
        onClose={() => setShowSemesterPackModal(false)}
        onFilterSemesterListings={(sem) => {
          setSelectedSemester(sem);
          const el = document.getElementById('marketplace-catalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <SellSemesterModal
        isOpen={showSellSemesterModal}
        onClose={() => setShowSellSemesterModal(false)}
        onSuccess={() => {
          showToast('Semester Pack Bundle successfully published for incoming juniors!', 'Bundle Published');
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

      <SavedItemsModal
        isOpen={showSavedItemsModal}
        onClose={() => setShowSavedItemsModal(false)}
        onSelectListing={(listing) => {
          setSelectedListing(listing);
        }}
      />

      <NotificationModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onOpenNeedBoard={() => setShowNeedBoardModal(true)}
        onOpenOffers={() => setShowActiveOffersModal(true)}
      />

      <StudentProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onOpenOnboarding={() => setShowOnboardingModal(true)}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={(name) => {
          showToast(`Welcome ${name}! Your verified campus profile is now active.`, 'Account Activated');
        }}
      />

      <ReportModal
        isOpen={Boolean(reportListingTarget)}
        onClose={() => setReportListingTarget(null)}
        listing={reportListingTarget}
        onSuccess={() => {
          showToast('Report submitted confidentially to campus moderation team.', 'Report Received');
        }}
      />

      <CampusHealthDashboardModal
        isOpen={showHealthModal}
        onClose={() => setShowHealthModal(false)}
      />
    </div>
  );
}
