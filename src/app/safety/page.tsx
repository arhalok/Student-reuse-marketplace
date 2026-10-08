'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import {
  ArrowLeft,
  ShieldCheck,
  Camera,
  Eye,
  UserCheck,
  MapPin,
  QrCode,
  Flag,
  CheckCircle2,
} from 'lucide-react';
import { Report } from '@/lib/types';

export default function SafetyTrustPage() {
  const router = useRouter();
  const { currentCampus, exchangeSpots, reportListing } = useMarketplace();

  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState<Report['reason']>('SCAM');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportListing('general-campus-issue', reportReason, reportDetails);
    setReportSuccess(true);
    setReportDetails('');
  };

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
            <span>Back</span>
          </button>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
            Zero-Scam Protocol
          </span>
        </div>

        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Campus Safety
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Trust & Safe Campus Exchanges
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              CampuShare operates entirely within your university boundaries. No anonymous external accounts, no advance wire deposits, and zero shipping disputes.
            </p>
          </div>
        </div>

        {/* The 4 Golden Rules */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            The 4 Golden Rules of CampuShare
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl border border-zinc-200 bg-white space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-zinc-950">
                  1. Official .ac.in Student Email
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Every student seller and buyer is verified against their official university domain ({currentCampus.domainSuffix}). Strangers outside campus cannot list or message.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 bg-white space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Camera className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-zinc-950">
                  2. Designated CCTV Spots
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Always meet at approved spots with 24/7 security cameras and daylight foot traffic (like Central Library Gate or Student Activity Center).
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 bg-white space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Eye className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-zinc-950">
                  3. Inspect Before Payment
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Never transfer money beforehand. Inspect the textbook edition, test calculator buttons, and check lab coat sizing in person before scanning UPI.
              </p>
            </div>

            <div className="p-5 rounded-3xl border border-zinc-200 bg-white space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
                  <QrCode className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm text-zinc-950">
                  4. Peer UPI at Meetup Only
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Use our in-app peer UPI QR code directly at the physical handshake. No advance deposits, third-party wallet transfers, or cash hassles.
              </p>
            </div>
          </div>
        </div>

        {/* Designated Campus CCTV Spots Directory */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <span>Approved CCTV Spots on {currentCampus.name}</span>
              </h2>
              <p className="text-xs text-zinc-500">
                These campus locations are actively monitored by campus security.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {exchangeSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-xs font-black text-zinc-950">{spot.name}</strong>
                  {spot.isRecommended && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      CCTV Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">{spot.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Moderation & Issue Report Section */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-base font-black text-zinc-950 flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-600" />
                <span>Notice Something Suspicious?</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Report prohibited items, mispriced books, or unresponsive users to campus moderators.
              </p>
            </div>

            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="px-4 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-800 font-bold text-xs transition-colors self-start sm:self-auto"
            >
              {showReportForm ? 'Hide Form' : 'Submit Safety Report'}
            </button>
          </div>

          {showReportForm && (
            <form onSubmit={handleReportSubmit} className="pt-4 border-t border-zinc-100 space-y-4 animate-fadeIn">
              {reportSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Your report has been logged and assigned to campus moderation. Thank you for keeping our community safe.</span>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Reason for Report
                    </label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value as Report['reason'])}
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900"
                    >
                      <option value="SCAM">Suspected Scam or False Advance Request</option>
                      <option value="MISLEADING_PRICE">Misleading Price or Hidden Fee</option>
                      <option value="WRONG_PRODUCT">Wrong Product / Defective Hardware</option>
                      <option value="FAKE_IDENTITY">Fake Student Identity</option>
                      <option value="PROHIBITED">Prohibited Campus Item</option>
                      <option value="OFFENSIVE">Offensive or Inappropriate Behavior</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      Details / Item Link
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Describe what occurred or paste the listing title..."
                      className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                  >
                    Submit Report to Moderators
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
