'use client';

import React from 'react';
import { Camera, MessageSquare, QrCode, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onOpenCreateListing: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onOpenCreateListing,
}) => {
  return (
    <section className="rounded-3xl border border-zinc-200/90 bg-linear-to-b from-zinc-50/50 to-white p-6 sm:p-8 space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
          Peer-To-Peer Flow
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">
          How CampuShare Works in 3 Simple Steps
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 font-normal">
          No shipping delays. No random strangers. True campus circular economy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step 1 */}
        <div className="relative p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Camera className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-zinc-300">01</span>
          </div>
          <h3 className="font-extrabold text-sm text-zinc-900">
            List in Under 60 Seconds
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Snap photos of your calculator, textbooks, drawing kit, or lab coat. Our fair price assistant suggests optimal campus pricing.
          </p>
        </div>

        {/* Step 2 */}
        <div className="relative p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <MessageSquare className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-zinc-300">02</span>
          </div>
          <h3 className="font-extrabold text-sm text-zinc-900">
            Chat &amp; Schedule Meetup
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Negotiate directly with fellow students. Choose from pre-approved campus CCTV spots like Central Library Foyer or SAC.
          </p>
        </div>

        {/* Step 3 */}
        <div className="relative p-5 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
              <QrCode className="h-5 w-5" />
            </div>
            <span className="text-xs font-black text-zinc-300">03</span>
          </div>
          <h3 className="font-extrabold text-sm text-zinc-900">
            Inspect &amp; Pay via UPI
          </h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            Check the item condition in person before releasing funds. Scan peer UPI QR code to complete the reuse transaction safely.
          </p>
        </div>
      </div>
    </section>
  );
};
