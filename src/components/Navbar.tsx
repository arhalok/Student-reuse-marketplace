'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import {
  Sparkles,
  School,
  User,
  PlusCircle,
  MessageSquare,
  GraduationCap,
  Package,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  Activity,
  UserPlus,
  Bell,
  Heart,
  Search,
  Compass,
  Grid3X3,
  Home,
  Tag,
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateListing: () => void;
  onOpenNeedBoard: () => void;
  onOpenSemesterPack: () => void;
  onOpenSellSemester: () => void;
  onOpenOffers: () => void;
  onOpenOnboarding?: () => void;
  onOpenHealthDashboard?: () => void;
  onOpenSavedItems?: () => void;
  onOpenNotifications?: () => void;
  onOpenProfileModal?: () => void;
  onNavigateSection?: (section: 'browse' | 'categories' | 'needs' | 'semester-packs') => void;
  currentActiveTab?: 'home' | 'browse' | 'needs' | 'offers';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateListing,
  onOpenNeedBoard,
  onOpenSemesterPack,
  onOpenSellSemester,
  onOpenOffers,
  onOpenOnboarding,
  onOpenHealthDashboard,
  onOpenSavedItems,
  onOpenNotifications,
  onOpenProfileModal,
  onNavigateSection,
  currentActiveTab = 'home',
}) => {
  const {
    currentCampus,
    setCampus,
    campuses,
    currentProfile,
    setProfile,
    availableProfiles,
    offers,
    notifications,
    savedListingIds,
  } = useMarketplace();

  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const pendingOffersCount = offers.filter(
    (o) =>
      (o.sellerId === currentProfile.id || o.buyerId === currentProfile.id) &&
      o.status !== 'COMPLETED' &&
      o.status !== 'REJECTED'
  ).length;

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Logo & Campus Selector */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <ArrowRightLeft className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold tracking-tight text-zinc-950 text-lg">
                    CampuShare
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200/80">
                    Reuse
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-medium tracking-tight mt-0.5 hidden sm:block">
                  Buy less • Reuse more • Spend less
                </p>
              </div>
            </a>

            {/* Campus Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCampusDropdown(!showCampusDropdown)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:border-zinc-300 transition-all active:scale-98"
              >
                <School className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="truncate max-w-[100px] sm:max-w-none">{currentCampus.shortCode}</span>
                <span className="text-zinc-400 text-[10px]">▼</span>
              </button>

              {showCampusDropdown && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl z-50 animate-modal-in">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Switch Active Campus
                  </div>
                  {campuses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCampus(c);
                        setShowCampusDropdown(false);
                      }}
                      className={`flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left text-xs transition-colors ${
                        currentCampus.id === c.id
                          ? 'bg-emerald-50 text-emerald-950 font-semibold'
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <School className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-zinc-900">{c.name}</div>
                        <div className="text-[11px] text-zinc-500">{c.city}, {c.state}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-zinc-600">
            <button
              onClick={() => {
                const el = document.getElementById('marketplace-catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigateSection) onNavigateSection('browse');
              }}
              className="rounded-xl px-3 py-2 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors"
            >
              Browse Campus
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('categories-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else if (onNavigateSection) onNavigateSection('categories');
              }}
              className="rounded-xl px-3 py-2 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors"
            >
              Categories
            </button>
            <button
              onClick={onOpenNeedBoard}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-amber-900 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 transition-colors"
            >
              <Layers className="h-3.5 w-3.5 text-amber-600" />
              <span>Need Board</span>
            </button>
            <button
              onClick={onOpenSemesterPack}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Semester Packs</span>
            </button>
          </nav>

          {/* RIGHT: Tools, Profile & Primary Sell CTA */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Wishlist Saved Items */}
            {onOpenSavedItems && (
              <button
                onClick={onOpenSavedItems}
                aria-label="View Saved Items"
                title="Wishlist / Saved Items"
                className="relative hidden sm:flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 bg-white text-zinc-600 hover:text-rose-600 hover:border-zinc-300 transition-colors shadow-2xs"
              >
                <Heart className={`h-4 w-4 ${savedListingIds.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {savedListingIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-2xs">
                    {savedListingIds.length}
                  </span>
                )}
              </button>
            )}

            {/* Negotiations / Offers */}
            <button
              onClick={onOpenOffers}
              aria-label="View Active Negotiations"
              title="Campus Negotiations & Meetups"
              className="relative flex items-center gap-1.5 rounded-xl border border-zinc-200/80 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-colors shadow-2xs"
            >
              <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden md:inline">Offers</span>
              {pendingOffersCount > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {pendingOffersCount}
                </span>
              )}
            </button>

            {/* Notification Center */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                aria-label="View Notifications"
                title="Smart Notifications"
                className="relative flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 bg-white text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-2xs"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                )}
              </button>
            )}

            {/* Telemetry Dashboard (Hidden on Mobile) */}
            {onOpenHealthDashboard && (
              <button
                onClick={onOpenHealthDashboard}
                aria-label="Campus Health Telemetry"
                title="Campus Marketplace Health"
                className="hidden xl:flex items-center justify-center h-9 w-9 rounded-xl border border-zinc-200/80 bg-white text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition-colors shadow-2xs"
              >
                <Activity className="h-4 w-4 text-emerald-600" />
              </button>
            )}

            {/* PRIMARY SELL CTA (Desktop) */}
            <button
              onClick={onOpenCreateListing}
              className="hidden sm:flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 px-3.5 sm:px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <PlusCircle className="h-4 w-4 stroke-[2.5]" />
              <span>Sell an Item</span>
            </button>

            {/* Student Profile / Persona Trigger */}
            <div className="relative ml-1">
              <button
                onClick={() => {
                  if (onOpenProfileModal) {
                    onOpenProfileModal();
                  } else {
                    setShowProfileDropdown(!showProfileDropdown);
                  }
                }}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white p-0.5 pr-2 sm:pr-2.5 hover:border-zinc-300 transition-colors shadow-2xs active:scale-95"
              >
                <img
                  src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={currentProfile.fullName}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500"
                />
                <div className="hidden sm:block text-left text-xs leading-none">
                  <div className="flex items-center gap-1 font-bold text-zinc-900 text-[11px]">
                    <span>{currentProfile.fullName.split(' ')[0]}</span>
                    {currentProfile.isStudentVerified && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600 fill-emerald-100" />
                    )}
                  </div>
                </div>
              </button>

              {/* Persona switch dropdown (fallback if modal not handled) */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-2xl z-50 animate-modal-in">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                    <span>Demo Student Persona</span>
                    {onOpenOnboarding && (
                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          onOpenOnboarding();
                        }}
                        className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <UserPlus className="h-3 w-3" />
                        <span>+ New</span>
                      </button>
                    )}
                  </div>
                  {availableProfiles.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setProfile(p);
                        setShowProfileDropdown(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl p-2 text-left text-xs transition-colors ${
                        currentProfile.id === p.id
                          ? 'bg-emerald-50 text-emerald-950 font-bold'
                          : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.fullName}
                        className="h-8 w-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="truncate font-bold text-zinc-900">{p.fullName}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{p.degreeProgram}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR */}
      <nav
        aria-label="Mobile Navigation"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-zinc-200/90 shadow-lg px-2 py-1.5 flex items-center justify-around"
      >
        {/* 1. Home */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-bold transition-colors ${
            currentActiveTab === 'home' ? 'text-emerald-700' : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Home className="h-4 w-4 stroke-[2.2]" />
          <span>Home</span>
        </button>

        {/* 2. Browse */}
        <button
          onClick={() => {
            const el = document.getElementById('marketplace-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else if (onNavigateSection) onNavigateSection('browse');
          }}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <Compass className="h-4 w-4 stroke-[2.2]" />
          <span>Browse</span>
        </button>

        {/* 3. Floating Distinctive SELL Action */}
        <button
          onClick={onOpenCreateListing}
          className="-mt-5 flex flex-col items-center justify-center h-12 w-12 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
        >
          <PlusCircle className="h-6 w-6 stroke-[2.5]" />
        </button>

        {/* 4. Need Board */}
        <button
          onClick={onOpenNeedBoard}
          className="flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold text-zinc-500 hover:text-amber-800 transition-colors"
        >
          <Layers className="h-4 w-4 stroke-[2.2] text-amber-600" />
          <span>Needs</span>
        </button>

        {/* 5. Offers / Negotiations */}
        <button
          onClick={onOpenOffers}
          className="relative flex flex-col items-center gap-0.5 py-1 px-3 text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <MessageSquare className="h-4 w-4 stroke-[2.2]" />
          <span>Offers</span>
          {pendingOffersCount > 0 && (
            <span className="absolute top-0 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
              {pendingOffersCount}
            </span>
          )}
        </button>
      </nav>
    </>
  );
};
