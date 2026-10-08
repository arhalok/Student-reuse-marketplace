'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  CheckCircle2,
  School,
  GraduationCap,
  Sparkles,
  TrendingDown,
  Recycle,
  Clock,
  ShieldCheck,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOnboarding: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOnboarding,
}) => {
  const {
    currentProfile,
    currentCampus,
    availableProfiles,
    setProfile,
    impactStats,
    listings,
    offers,
  } = useMarketplace();

  const userListings = listings.filter((l) => l.sellerId === currentProfile.id);
  const userOffers = offers.filter(
    (o) => o.buyerId === currentProfile.id || o.sellerId === currentProfile.id
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Student Campus Profile"
      subtitle={`Verified campus member on ${currentCampus.name}`}
      maxWidth="lg"
      headerBg="bg-linear-to-r from-emerald-50/70 to-zinc-50"
    >
      <div className="space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-200/90 bg-white">
          <div className="relative">
            <img
              src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt={currentProfile.fullName}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-md"
            />
            {currentProfile.isStudentVerified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-emerald-600 text-white p-0.5 shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-zinc-900 truncate">
                {currentProfile.fullName}
              </h3>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                ✓ Verified Student
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-medium truncate mt-0.5">
              {currentProfile.degreeProgram}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
              <span>Year {currentProfile.currentYear} • Semester {currentProfile.currentSemester}</span>
              <span>•</span>
              <span className="truncate">{currentProfile.collegeEmail}</span>
            </div>
          </div>
        </div>

        {/* Reputation & Trust Grid */}
        <div>
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Campus Trust Score
          </h4>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl border border-zinc-200/80 bg-zinc-50">
              <div className="text-lg font-black text-zinc-900">{currentProfile.successfulTransactions}</div>
              <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Successful Reuses</div>
            </div>
            <div className="p-3 rounded-2xl border border-zinc-200/80 bg-zinc-50">
              <div className="text-lg font-black text-emerald-600">{currentProfile.responseRatePercent}%</div>
              <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Response Rate</div>
            </div>
            <div className="p-3 rounded-2xl border border-zinc-200/80 bg-zinc-50">
              <div className="text-lg font-black text-zinc-800">{currentProfile.avgResponseMinutes} min</div>
              <div className="text-[11px] text-zinc-500 font-medium mt-0.5">Avg Response</div>
            </div>
          </div>
        </div>

        {/* Circular Economy Contribution */}
        <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Recycle className="h-4 w-4 text-emerald-600" />
              Your Circular Reuse Impact
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Real-time
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <div className="text-base font-extrabold text-zinc-900">{userListings.length} Active Items</div>
              <div className="text-[10px] text-zinc-500">Listed on Campus</div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-emerald-100">
              <div className="text-base font-extrabold text-emerald-600">₹{(impactStats.moneySaved / 1000).toFixed(1)}k Saved</div>
              <div className="text-[10px] text-zinc-500">By Community Reuse</div>
            </div>
          </div>
        </div>

        {/* Switch Demo Persona Bar */}
        <div className="pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Switch Demo Persona
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="text-emerald-700 text-xs font-bold hover:underline flex items-center gap-1"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>+ Register New Student</span>
            </button>
          </div>

          <div className="space-y-2">
            {availableProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProfile(p);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                  p.id === currentProfile.id
                    ? 'border-emerald-300 bg-emerald-50/80 font-semibold'
                    : 'border-zinc-200/80 bg-white hover:bg-zinc-50 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={p.avatarUrl}
                    alt={p.fullName}
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-zinc-900 truncate">{p.fullName}</div>
                    <div className="text-[10px] text-zinc-500 truncate">{p.degreeProgram}</div>
                  </div>
                </div>
                {p.id === currentProfile.id && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
