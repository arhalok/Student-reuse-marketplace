'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  ArrowLeft,
  Recycle,
  Leaf,
  Award,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export default function CircularImpactPage() {
  const router = useRouter();
  const { currentCampus, currentProfile, impactStats } = useMarketplace();

  // Metrics
  const itemsReused = impactStats.itemsReused || 18;
  const moneySaved = impactStats.moneySaved || 12450;
  const co2SavedKg = impactStats.co2SavedKg || 42.5;
  const treesEquivalent = Math.round((co2SavedKg / 21) * 10) / 10;

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
            <span>Back to Profile</span>
          </button>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Sustainability Telemetry
          </span>
        </div>

        {/* Hero Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
              <Recycle className="h-3.5 w-3.5" />
              Circular Campus Economy
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Campus Reuse & Sustainability Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Every textbook passed forward, scientific calculator preserved, and drafter reused keeps academic materials out of landfills and money in students&apos; pockets on {currentCampus.name}.
            </p>
          </div>

          {/* 4 Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-center">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-2xl font-black text-emerald-700 block">
                ₹{moneySaved.toLocaleString()}
              </strong>
              <span className="text-xs font-medium text-zinc-500 mt-0.5 block">Student Rupees Saved</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-2xl font-black text-zinc-900 block">
                {itemsReused}
              </strong>
              <span className="text-xs font-medium text-zinc-500 mt-0.5 block">Items Kept in Circulation</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-2xl font-black text-emerald-700 block">
                {co2SavedKg} kg
              </strong>
              <span className="text-xs font-medium text-zinc-500 mt-0.5 block">CO₂ Emissions Diverted</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-2xl font-black text-green-600 block">
                ~{treesEquivalent}
              </strong>
              <span className="text-xs font-medium text-zinc-500 mt-0.5 block">Trees Carbon Offset</span>
            </div>
          </div>
        </div>

        {/* Circular Loop Explanation */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              The Campus Reuse Lifecycle
            </span>
            <h2 className="text-lg font-black text-zinc-950">
              How CampuShare Multiplies Item Lifespans
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="h-7 w-7 rounded-lg bg-amber-100 text-amber-900 font-black text-xs flex items-center justify-center">
                1
              </span>
              <strong className="text-xs font-black text-zinc-900 block">Demand Meets Supply</strong>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Juniors post what courses require before buying new. Seniors clear out previous semester materials directly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs flex items-center justify-center">
                2
              </span>
              <strong className="text-xs font-black text-zinc-900 block">Standardized Honesty</strong>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Checklists for calculator battery life and textbook page marks eliminate disputes before meeting.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
              <span className="h-7 w-7 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center">
                3
              </span>
              <strong className="text-xs font-black text-zinc-900 block">Zero Waste Handshake</strong>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Walk across campus to Central Library Gate. No single-use courier plastic, no shipping fees, zero carbon transit.
              </p>
            </div>
          </div>
        </div>

        {/* Certificate of Circular Stewardship */}
        <div className="rounded-3xl border-2 border-emerald-500/30 bg-radial from-emerald-50/50 to-white p-6 sm:p-8 space-y-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Official Campus Recognition
                </span>
                <h3 className="text-base font-black text-zinc-950">
                  Certificate of Circular Stewardship
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Active Contributor &bull; 2026
            </span>
          </div>

          <div className="space-y-3 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
              Awarded to <strong className="text-zinc-950 font-black">{currentProfile.fullName}</strong> ({currentProfile.collegeEmail}) for verifiable contributions to campus material reuse and sustainability at <strong>{currentCampus.name}</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-zinc-500 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Verified Student Identity
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Leaf className="h-4 w-4 text-emerald-600" />
                Zero-Courier Footprint
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-zinc-100">
            <span className="text-zinc-400 font-mono text-[11px]">
              Credential ID: CS-{currentProfile.id}-{currentCampus.shortCode}
            </span>

            <Link
              href="/browse"
              className="px-4 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Explore Reuse Feed</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
