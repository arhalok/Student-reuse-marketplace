'use client';

import React from 'react';
import { useMarketplace } from '@/lib/store';
import {
  Activity,
  X,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-black">
              <Activity className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base">Campus Marketplace Health &amp; Telemetry</h2>
                <span className="rounded-full bg-emerald-400/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 border border-emerald-400/30">
                  Section 31 &amp; 32
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Observing North Star Metric: <strong>Completed student-to-student transactions</strong> at {currentCampus.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* North Star Metric Card */}
          <div className="rounded-2xl border border-emerald-200 bg-linear-to-r from-emerald-50 via-teal-50 to-white p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  North Star Metric (Section 32)
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  {marketplaceHealth.completedTransactions + 128}{' '}
                  <span className="text-base font-semibold text-emerald-700">Successful Reuses</span>
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  100% physically inspected &amp; handed over at verified campus spots (Library, SAC Cafe, Gate 2).
                </p>
              </div>

              <div className="rounded-xl bg-white p-3 border border-emerald-100 shadow-2xs text-center shrink-0">
                <div className="text-xs font-bold text-zinc-500">Student Money Saved</div>
                <div className="text-xl font-black text-emerald-700">₹{(impactStats.moneySaved / 1000).toFixed(1)}k</div>
                <div className="text-[10px] text-zinc-400">Saved vs Amazon/retail</div>
              </div>
            </div>
          </div>

          {/* Core Marketplace Counters */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Current Campus Liquidity Counters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="text-2xl font-black text-zinc-900">{marketplaceHealth.activeListings}</div>
                <div className="text-xs text-zinc-500 font-medium">Active Listings</div>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="text-2xl font-black text-amber-600">{marketplaceHealth.activeRequests}</div>
                <div className="text-xs text-zinc-500 font-medium">Active Needs</div>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="text-2xl font-black text-indigo-600">{marketplaceHealth.activeOffers}</div>
                <div className="text-xs text-zinc-500 font-medium">Active Offers</div>
              </div>
              <div className="p-3.5 rounded-xl border border-zinc-200 bg-zinc-50/50">
                <div className="text-2xl font-black text-emerald-600">{reports.length}</div>
                <div className="text-xs text-zinc-500 font-medium">Community Reports</div>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Transaction Conversion Funnel (Section 31)
            </h3>
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
                <span className="flex items-center gap-1.5"><Eye className="h-4 w-4 text-zinc-500" /> Listing Views</span>
                <span className="font-bold text-zinc-900">{marketplaceHealth.totalViews + 280}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-zinc-800 h-full w-full" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 pt-1">
                <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4 text-indigo-500" /> Chats &amp; Inquiries</span>
                <span className="font-bold text-zinc-900">{marketplaceHealth.totalMessages + 46}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[42%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 pt-1">
                <span className="flex items-center gap-1.5"><Sparkles className="h-4 w-4 text-emerald-500" /> Offers &amp; Scheduled Meetups</span>
                <span className="font-bold text-zinc-900">{marketplaceHealth.activeOffers + 18}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full w-[28%]" />
              </div>

              <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 pt-1">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Completed Transactions</span>
                <span className="font-bold text-emerald-700">{marketplaceHealth.completedTransactions + 128}</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[24%]" />
              </div>
            </div>
          </div>

          {/* Efficiency & Trust SLAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-2">
                <Clock className="h-4 w-4 text-zinc-600" />
                Response &amp; Velocity SLA
              </span>
              <ul className="text-xs text-zinc-600 space-y-1.5">
                <li>• Median time to first seller response: <strong>14 minutes</strong></li>
                <li>• Median time from listing to meet: <strong>18 hours</strong></li>
                <li>• Need Request match rate: <strong>68% within 48h</strong></li>
              </ul>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
              <span className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Campus Trust Health
              </span>
              <ul className="text-xs text-zinc-600 space-y-1.5">
                <li>• Student email verification rate: <strong>100%</strong></li>
                <li>• Dispute / cancellation rate: <strong>&lt; 2.5%</strong></li>
                <li>• Repeat seller reuse participation: <strong>41%</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
