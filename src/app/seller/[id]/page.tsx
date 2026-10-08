'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Star,
  Clock,
  Sparkles,
  MapPin,
  Heart,
  MessageSquare,
  Award,
} from 'lucide-react';
import { Listing } from '@/lib/types';

function SellerProfileContent() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.id as string;

  const {
    listings,
    currentCampus,
    currentProfile,
    savedListingIds,
    toggleSaveListing,
  } = useMarketplace();

  // Find seller profile from initial profiles or match with current profile
  const seller =
    INITIAL_PROFILES[sellerId] ||
    (currentProfile.id === sellerId ? currentProfile : null) ||
    Object.values(INITIAL_PROFILES).find((p) => p.id === sellerId) || {
      id: sellerId,
      campusId: currentCampus.id,
      fullName: 'Campus Senior',
      collegeEmail: 'student@campus.ac.in',
      isStudentVerified: true,
      degreeProgram: 'B.Tech Engineering',
      currentYear: 3,
      currentSemester: 5,
      totalTransactions: 6,
      successfulTransactions: 6,
      responseRatePercent: 96,
      avgResponseMinutes: 12,
      trustRating: 4.9,
      memberSinceYear: 2024,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    };

  // Find seller's active listings
  const sellerListings = listings.filter((l) => l.sellerId === sellerId);
  const isSelf = currentProfile.id === seller.id;

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className="text-xs text-zinc-400 font-medium">Campus Senior Profile</span>
        </div>

        {/* Profile Identity Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative">
              <img
                src={seller.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={seller.fullName}
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
              />
              {seller.isStudentVerified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-1.5 shadow-md"
                  title="Verified Student via college email"
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-zinc-950">
                  {seller.fullName}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified .ac.in Student
                </span>
                {isSelf && (
                  <span className="rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-bold px-2.5 py-0.5">
                    (You)
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                {seller.degreeProgram} &bull; Year {seller.currentYear || 3} (Sem {seller.currentSemester || 5})
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {currentCampus.name}
                </span>
                <span>&bull;</span>
                <span>Active Member since {seller.memberSinceYear || 2024}</span>
              </div>
            </div>

            {!isSelf && (
              <div className="sm:self-center">
                <Link
                  href={`/messages?sellerId=${seller.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </Link>
              </div>
            )}
          </div>

          {/* Trust Metrics Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-zinc-100 text-center">
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center justify-center gap-1 text-emerald-700 font-black text-lg">
                <Star className="h-4 w-4 fill-emerald-600 text-emerald-600" />
                <span>{seller.trustRating || 4.9}</span>
              </div>
              <span className="text-[11px] font-medium text-zinc-500">Student Rating</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-zinc-900 block">
                {seller.successfulTransactions || 6}
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Successful Reuses</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <strong className="text-lg font-black text-emerald-700 block">
                {seller.responseRatePercent || 95}%
              </strong>
              <span className="text-[11px] font-medium text-zinc-500">Response Rate</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
              <div className="flex items-center justify-center gap-1 text-zinc-900 font-black text-lg">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                <span>{seller.avgResponseMinutes || 15}m</span>
              </div>
              <span className="text-[11px] font-medium text-zinc-500">Avg Reply Time</span>
            </div>
          </div>
        </div>

        {/* Verification & Trust Badges */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-600" />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Campus Trust Endorsements
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="rounded-xl bg-emerald-600 text-white p-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-black text-zinc-900 block">Institutional Match</strong>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Identity matched with official university roster.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="rounded-xl bg-blue-600 text-white p-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-black text-zinc-900 block">Item Accuracy 100%</strong>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Items verified to match standardized inspection cards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <div className="rounded-xl bg-amber-600 text-white p-2">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <strong className="text-xs font-black text-zinc-900 block">CCTV Spot Regular</strong>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Exclusively exchanges at official campus security spots.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seller's Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-zinc-950">
                Active Listings ({sellerListings.length})
              </h2>
              <p className="text-xs text-zinc-500">
                Items currently listed on {currentCampus.shortCode}
              </p>
            </div>
          </div>

          {sellerListings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center space-y-2">
              <p className="text-xs font-bold text-zinc-700">No active listings currently</p>
              <p className="text-xs text-zinc-400">
                This senior has handed off all their semester materials or has no active listings right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {sellerListings.map((item: Listing) => {
                const isSaved = savedListingIds.includes(item.id);
                return (
                  <Link
                    key={item.id}
                    href={`/listing/${item.id}`}
                    className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col"
                  >
                    <div className="relative aspect-4/3 w-full bg-zinc-100 overflow-hidden">
                      <img
                        src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSaveListing(item.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                          isSaved ? 'bg-red-50 text-red-500' : 'bg-black/20 text-white hover:bg-black/40'
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-red-500' : ''}`} />
                      </button>
                    </div>

                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Sem {item.relevantSemesters?.join(', ') || '1'}
                        </span>
                        <h3 className="font-bold text-xs text-zinc-900 line-clamp-2 mt-1">
                          {item.title}
                        </h3>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-zinc-100">
                        <span className="text-sm font-black text-zinc-950">₹{item.price}</span>
                        <span className="text-[10px] text-zinc-400">{item.condition.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Safe Campus Meetup Reminder Banner */}
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-5 flex items-start gap-3.5">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-black text-emerald-950">CampuShare Safe Exchange Pledge</h3>
            <p className="text-xs text-emerald-800">
              All exchanges with {seller.fullName} should take place on campus at designated daylight CCTV spots (e.g. Central Library Gate or SAC). Never pay advance deposits or transfer money before physically inspecting items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerProfilePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading senior profile...</div>}>
      <SellerProfileContent />
    </Suspense>
  );
}
