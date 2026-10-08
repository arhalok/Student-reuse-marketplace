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
} from 'lucide-react';

interface NavbarProps {
  onOpenCreateListing: () => void;
  onOpenNeedBoard: () => void;
  onOpenSemesterPack: () => void;
  onOpenSellSemester: () => void;
  onOpenOffers: () => void;
  onOpenOnboarding?: () => void;
  onOpenHealthDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreateListing,
  onOpenNeedBoard,
  onOpenSemesterPack,
  onOpenSellSemester,
  onOpenOffers,
  onOpenOnboarding,
  onOpenHealthDashboard,
}) => {
  const {
    currentCampus,
    setCampus,
    campuses,
    currentProfile,
    setProfile,
    availableProfiles,
    offers,
  } = useMarketplace();

  const [showCampusDropdown, setShowCampusDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const pendingOffersCount = offers.filter(
    (o) =>
      (o.sellerId === currentProfile.id || o.buyerId === currentProfile.id) &&
      o.status !== 'COMPLETED' &&
      o.status !== 'REJECTED'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
              <ArrowRightLeft className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-zinc-900 text-lg">CampuShare</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200/60">
                  Campus-First Reuse
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">Buy less. Reuse more. Spend less.</p>
            </div>
          </div>

          {/* Campus Switcher */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCampusDropdown(!showCampusDropdown)}
              className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:border-zinc-300 transition-all"
            >
              <School className="h-3.5 w-3.5 text-emerald-600" />
              <span>{currentCampus.shortCode}</span>
              <span className="text-zinc-400">▾</span>
            </button>

            {showCampusDropdown && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl border border-zinc-200 bg-white p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Switch Active Campus
                </div>
                {campuses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCampus(c);
                      setShowCampusDropdown(false);
                    }}
                    className={`flex w-full items-start gap-2.5 rounded-lg p-2.5 text-left text-xs transition-colors ${
                      currentCampus.id === c.id
                        ? 'bg-emerald-50 text-emerald-900 font-medium'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <School className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-zinc-900">{c.name}</div>
                      <div className="text-[11px] text-zinc-500">{c.city}, {c.state}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* What Do I Need Button */}
          <button
            onClick={onOpenSemesterPack}
            className="hidden lg:flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Semester Needs</span>
          </button>

          {/* Need Board (Demand Before Supply) */}
          <button
            onClick={onOpenNeedBoard}
            className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition-colors shadow-xs"
          >
            <Layers className="h-3.5 w-3.5 text-amber-600" />
            <span>Need Board</span>
          </button>

          {/* Passed Semester Prompt */}
          <button
            onClick={onOpenSellSemester}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
          >
            <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
            <span>Passed Semester?</span>
          </button>

          {/* Active Offers & Meetups */}
          <button
            onClick={onOpenOffers}
            className="relative flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
          >
            <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Negotiations</span>
            {pendingOffersCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {pendingOffersCount}
              </span>
            )}
          </button>

          {/* Campus Health Telemetry (Section 31) */}
          {onOpenHealthDashboard && (
            <button
              onClick={onOpenHealthDashboard}
              title="Campus Marketplace Health & Metrics"
              className="hidden lg:flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 shadow-xs"
            >
              <Activity className="h-4 w-4 text-emerald-600" />
            </button>
          )}

          {/* Create Listing (Smart & Quick < 1 Min) */}
          <button
            onClick={onOpenCreateListing}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
          >
            <PlusCircle className="h-4 w-4" />
            <span>List Item</span>
          </button>

          {/* Persona Switcher (For easy demo testing) */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white p-1 pr-3 hover:border-zinc-300 transition-colors shadow-xs"
            >
              <img
                src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={currentProfile.fullName}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500"
              />
              <div className="hidden sm:block text-left text-xs">
                <div className="flex items-center gap-1 font-semibold text-zinc-800">
                  <span>{currentProfile.fullName.split(' ')[0]}</span>
                  {currentProfile.isStudentVerified && (
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 fill-emerald-100" />
                  )}
                </div>
                <div className="text-[10px] text-zinc-400">
                  Yr {currentProfile.currentYear} • Sem {currentProfile.currentSemester}
                </div>
              </div>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-zinc-200 bg-white p-2.5 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Switch Demo Persona</span>
                  {onOpenOnboarding && (
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        onOpenOnboarding();
                      }}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>+ New Student</span>
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
                    className={`flex w-full items-center gap-3 rounded-lg p-2 text-left text-xs transition-colors ${
                      currentProfile.id === p.id
                        ? 'bg-emerald-50 text-emerald-900 font-medium'
                        : 'text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    <img
                      src={p.avatarUrl}
                      alt={p.fullName}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-zinc-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 font-semibold text-zinc-900">
                        <span className="truncate">{p.fullName}</span>
                        {p.isStudentVerified && (
                          <span className="text-[10px] text-emerald-600 font-medium">✓ Verified</span>
                        )}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate">{p.degreeProgram}</div>
                      <div className="text-[10px] text-zinc-400">
                        {p.successfulTransactions} reuses completed • {p.responseRatePercent}% response rate
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
