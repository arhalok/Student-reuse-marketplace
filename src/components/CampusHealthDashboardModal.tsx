'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  Activity,
  TrendingUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Users,
  Layers,
  ArrowRight,
  Eye,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface CampusHealthDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusHealthDashboardModal: React.FC<CampusHealthDashboardModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentCampus, marketplaceHealth, reports, impactStats } = useMarketplace();

  if (!isOpen) return null;

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Campus Marketplace Health & Telemetry"
      subtitle={`Observing North Star Metric: Successful reuses on ${currentCampus.name}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 text-emerald-400">
          <Activity className="h-5 w-5 stroke-[2.5]" />
        </div>
      }
      badge={
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
          Live Telemetry
        </span>
      }
      maxWidth="3xl"
      headerBg="bg-zinc-900 text-white"
    >
      <div className="space-y-6">
        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Active Supply
            </span>
            <div className="mt-1 text-2xl font-black text-zinc-950">
              {marketplaceHealth.activeListings}
            </div>
            <span className="text-[11px] text-zinc-500">Live Campus Listings</span>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Active Demand
            </span>
            <div className="mt-1 text-2xl font-black text-amber-700">
              {marketplaceHealth.activeRequests}
            </div>
            <span className="text-[11px] text-zinc-500">Need Board Requests</span>
          </div>

          <div className="p-4 rounded-2xl border border-zinc-200/90 bg-white">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              In Negotiation
            </span>
            <div className="mt-1 text-2xl font-black text-indigo-700">
              {marketplaceHealth.activeOffers}
            </div>
            <span className="text-[11px] text-zinc-500">Active Offers &amp; Meetups</span>
          </div>

          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              North Star
            </span>
            <div className="mt-1 text-2xl font-black text-emerald-700">
              {impactStats.itemsReused}
            </div>
            <span className="text-[11px] text-emerald-900 font-semibold">Total Completed Reuses</span>
          </div>
        </div>

        {/* Telemetry Engagement Table */}
        <div className="rounded-2xl border border-zinc-200/90 bg-zinc-50/50 p-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Marketplace Liquidity &amp; Engagement
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-zinc-200">
              <span className="text-zinc-400 block text-[10px]">Total Item Views</span>
              <strong className="text-base text-zinc-900">{marketplaceHealth.totalViews}</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-zinc-200">
              <span className="text-zinc-400 block text-[10px]">Total Peer Messages</span>
              <strong className="text-base text-zinc-900">{marketplaceHealth.totalMessages}</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-zinc-200">
              <span className="text-zinc-400 block text-[10px]">Trust &amp; Moderation Reports</span>
              <strong className="text-base text-zinc-900">{reports.length} (Safe)</strong>
            </div>
          </div>
        </div>

        {/* Impact Calculations */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
            <span>Campus Sustainability Telemetry</span>
            <span className="text-emerald-700">Calculated via peer transactions</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-zinc-400 block text-[10px]">Student Savings</span>
              <strong className="text-base text-emerald-700">₹{impactStats.moneySaved.toLocaleString()}</strong>
            </div>
            <div className="bg-white p-3 rounded-xl border border-emerald-100">
              <span className="text-zinc-400 block text-[10px]">CO₂ Avoided</span>
              <strong className="text-base text-zinc-900">{impactStats.co2SavedKg} kg</strong>
            </div>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};
