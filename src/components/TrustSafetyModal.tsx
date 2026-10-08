'use client';

import React from 'react';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import { useMarketplace } from '@/lib/store';
import {
  ShieldCheck,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileCheck,
  Lock,
  UserCheck,
  Flag,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface TrustSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReport?: () => void;
}

export const TrustSafetyModal: React.FC<TrustSafetyModalProps> = ({
  isOpen,
  onClose,
  onOpenReport,
}) => {
  const { currentCampus, exchangeSpots } = useMarketplace();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Trust & Safety on Campus"
      subtitle={`Peer-to-peer student reuse protocols for ${currentCampus.name}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-5 w-5" />
        </div>
      }
      badge={
        <span className="rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 border border-emerald-200">
          Zero-Scam Architecture
        </span>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Core Principles Banner */}
        <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50/40 to-white p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
            <Lock className="h-4 w-4 text-emerald-600" />
            <span>The 4 Golden Rules of CampuShare</span>
          </div>
          <p className="text-xs text-emerald-900/80 leading-relaxed">
            CampuShare is built strictly inside your verified university community. No shipping delays, no anonymous external sellers, and zero upfront wire transfers.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <UserCheck className="h-4 w-4" />
              </div>
              <h4 className="font-extrabold text-xs text-zinc-950">1. Verified College Email</h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Every seller and buyer is authenticated via their official institutional domain ({currentCampus.domainSuffix}). Unverified accounts cannot message or list items.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Camera className="h-4 w-4" />
              </div>
              <h4 className="font-extrabold text-xs text-zinc-950">2. Designated CCTV Spots</h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Exchanges take place at verified, high-footfall campus locations like the Central Library Foyer and Student Activity Center (SAC) with active campus security coverage.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Eye className="h-4 w-4" />
              </div>
              <h4 className="font-extrabold text-xs text-zinc-950">3. Inspect Before Payment</h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Never pay before meeting. Inspect scientific calculator keys, LCD screen, textbook edition, and page integrity in person at the meeting spot before scanning UPI.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                <QrCode className="h-4 w-4" />
              </div>
              <h4 className="font-extrabold text-xs text-zinc-950">4. Direct UPI Handoff</h4>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed">
              We never hold student funds or charge middleman fees. Payment is made directly from student to student via Google Pay, PhonePe, or Paytm UPI QR at the meetup.
            </p>
          </div>
        </div>

        {/* Safe Campus Exchange Spots Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>Official Safe Meetup Spots on {currentCampus.shortCode}</span>
            </h4>
          </div>

          <div className="space-y-2">
            {exchangeSpots.map((spot) => (
              <div
                key={spot.id}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50/60 text-xs"
              >
                <div>
                  <strong className="text-zinc-900 block">{spot.name}</strong>
                  <span className="text-[11px] text-zinc-500">{spot.description}</span>
                </div>
                {spot.isRecommended ? (
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 shrink-0">
                    Recommended CCTV
                  </span>
                ) : (
                  <span className="text-zinc-400 text-[10px]">Hostel Point</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reporting and Moderation */}
        <div className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-4">
          <div>
            <h5 className="font-bold text-xs text-zinc-900 flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5 text-red-600" />
              <span>Notice Suspicious Activity or Prohibited Items?</span>
            </h5>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Our campus peer review team reviews all reports within 2 hours. Misleading listings and uncooperative accounts are suspended immediately.
            </p>
          </div>
          {onOpenReport && (
            <button
              onClick={() => {
                onClose();
                onOpenReport();
              }}
              className="px-3.5 py-2 rounded-xl bg-white border border-zinc-300 hover:border-red-300 hover:text-red-600 text-xs font-bold text-zinc-700 shadow-2xs shrink-0 transition-colors"
            >
              Submit Report
            </button>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};
