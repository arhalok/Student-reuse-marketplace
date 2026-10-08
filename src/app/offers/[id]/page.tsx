'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowLeft,
  ArrowRightLeft,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  QrCode,
  Star,
  MessageSquare,
  ArrowRight,
  Send,
} from 'lucide-react';

function OfferDetailContent() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const {
    offers,
    listings,
    currentProfile,
    currentCampus,
    exchangeSpots,
    respondToOffer,
    scheduleMeeting,
    completeTransaction,
    sendMessage,
  } = useMarketplace();

  const offer = offers.find((o) => o.id === offerId);

  // Component state
  const [counterInput, setCounterInput] = useState<number | ''>('');
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [selectedSpotId, setSelectedSpotId] = useState(offer?.meetingSpotId || 'spot-lib');
  const [meetingTime, setMeetingTime] = useState(offer?.meetingTime || 'Today at 5:30 PM');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [quickMsg, setQuickMsg] = useState('');

  if (!offer) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8 bg-zinc-50">
        <div className="text-center space-y-3 max-w-sm">
          <div className="text-3xl">🤝</div>
          <h2 className="text-lg font-black text-zinc-950">Offer Not Found</h2>
          <p className="text-xs text-zinc-500">
            This negotiation may have been completed, expired, or removed.
          </p>
          <Link
            href="/offers"
            className="inline-block px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
          >
            Back to Offers
          </Link>
        </div>
      </div>
    );
  }

  const listing = listings.find((l) => l.id === offer.listingId);
  const isSeller = offer.sellerId === currentProfile.id;
  const otherUserId = isSeller ? offer.buyerId : offer.sellerId;
  const otherUser = INITIAL_PROFILES[otherUserId] || currentProfile;

  const currentPrice = offer.counterAmount || offer.offeredAmount;
  const activeSpot = exchangeSpots.find((s) => s.id === (offer.meetingSpotId || selectedSpotId));

  const handleRespond = (action: 'ACCEPT' | 'REJECT' | 'COUNTER') => {
    if (action === 'COUNTER') {
      if (!counterInput) return;
      respondToOffer(offer.id, 'COUNTER', Number(counterInput));
      setShowCounterForm(false);
    } else {
      respondToOffer(offer.id, action);
    }
  };

  const handleScheduleSpot = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleMeeting(offer.id, selectedSpotId, meetingTime);
  };

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsg.trim() || !listing) return;
    sendMessage(listing.id, otherUserId, quickMsg);
    setQuickMsg('');
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
            <span>Back to Offers</span>
          </button>
          <span className="text-xs text-zinc-400 font-medium">Transaction #{offer.id}</span>
        </div>

        {/* Pinned Listing Header */}
        {listing && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={listing.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                alt={listing.title}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-1 ring-zinc-200 shrink-0"
              />
              <div className="min-w-0 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  {listing.targetCourse} &bull; Sem {listing.relevantSemesters?.join(', ') || '1'}
                </span>
                <h1 className="font-black text-base sm:text-lg text-zinc-950 truncate">
                  <Link href={`/listing/${listing.id}`} className="hover:underline">
                    {listing.title}
                  </Link>
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span>Listed: ₹{listing.price}</span>
                  <span>&bull;</span>
                  <span>
                    Condition: <strong className="text-zinc-700">{listing.condition.replace('_', ' ')}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right sm:border-l sm:border-zinc-100 sm:pl-6 shrink-0">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                Agreed / Proposed Price
              </span>
              <span className="text-2xl font-black text-emerald-700">₹{currentPrice}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase mt-1 ${
                  offer.status === 'ACCEPTED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : offer.status === 'COUNTERED'
                    ? 'bg-purple-100 text-purple-800'
                    : offer.status === 'COMPLETED'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                {offer.status}
              </span>
            </div>
          </div>
        )}

        {/* Counterpart Student Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={otherUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={otherUser.fullName}
              className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-zinc-950">{otherUser.fullName}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
                  {isSeller ? 'Junior Buyer' : 'Senior Seller'}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {otherUser.degreeProgram} &bull; Rating: {otherUser.trustRating || 4.9}★ &bull; {currentCampus.shortCode}
              </p>
            </div>
          </div>

          {listing && (
            <Link
              href={`/messages/${listing.id}?sellerId=${otherUserId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-800 hover:bg-zinc-50 font-bold text-xs transition-colors shrink-0"
            >
              <MessageSquare className="h-3.5 w-3.5 text-zinc-500" />
              <span className="hidden sm:inline">Open Chat</span>
            </Link>
          )}
        </div>

        {/* Quick Message Input */}
        {listing && (
          <form
            onSubmit={handleSendQuickMessage}
            className="flex items-center gap-2 p-2 rounded-2xl border border-zinc-200 bg-white"
          >
            <input
              type="text"
              value={quickMsg}
              onChange={(e) => setQuickMsg(e.target.value)}
              placeholder={`Send quick message to ${otherUser.fullName} (e.g. "On my way to Library gate")...`}
              className="flex-1 px-3 py-1.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!quickMsg.trim()}
              className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <Send className="h-3 w-3" />
              <span>Send</span>
            </button>
          </form>
        )}

        {/* PHASE 1: NEGOTIATION / COUNTER OFFER CONTROLS */}
        {(offer.status === 'PENDING' || offer.status === 'COUNTERED') && (
          <div className="rounded-3xl border border-amber-200 bg-white p-6 space-y-5 shadow-xs">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                <ArrowRightLeft className="h-3 w-3" />
                Active Price Negotiation
              </span>
              <h2 className="text-lg font-black text-zinc-950">
                {isSeller ? `${otherUser.fullName} offered ₹${offer.offeredAmount}` : `You offered ₹${offer.offeredAmount}`}
              </h2>
              {offer.notes && (
                <p className="text-xs text-zinc-600 italic">
                  &ldquo;{offer.notes}&rdquo;
                </p>
              )}
            </div>

            {/* Seller Action Controls */}
            {isSeller ? (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleRespond('ACCEPT')}
                    className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Accept ₹{currentPrice}</span>
                  </button>

                  <button
                    onClick={() => setShowCounterForm(!showCounterForm)}
                    className="py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Counter Offer</span>
                  </button>

                  <button
                    onClick={() => handleRespond('REJECT')}
                    className="py-3 px-4 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs transition-colors"
                  >
                    Decline Offer
                  </button>
                </div>

                {showCounterForm && (
                  <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/50 space-y-3 animate-fadeIn">
                    <label className="block text-xs font-bold text-purple-950">
                      Enter Your Counter Offer Amount (₹)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={counterInput}
                        onChange={(e) => setCounterInput(Number(e.target.value) || '')}
                        placeholder={`e.g. ${listing ? listing.price - 50 : 750}`}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => handleRespond('COUNTER')}
                        className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-black text-xs hover:bg-purple-500 transition-colors"
                      >
                        Send Counter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-50 text-xs text-zinc-600">
                Awaiting response from senior {otherUser.fullName}. You will be notified immediately when they accept or counter.
              </div>
            )}
          </div>
        )}

        {/* PHASE 2: ACCEPTED → MEETUP SPOT SCHEDULING */}
        {offer.status === 'ACCEPTED' && !offer.meetingSpotId && (
          <form onSubmit={handleScheduleSpot} className="rounded-3xl border border-emerald-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Offer Accepted & Item Reserved
              </span>
              <h2 className="text-xl font-black text-zinc-950">
                Schedule Safe Campus Meetup
              </h2>
              <p className="text-xs text-zinc-500">
                Select an official CCTV-monitored student spot on {currentCampus.name} for the physical handoff.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-2">
                  Select Campus CCTV Exchange Spot
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {exchangeSpots.map((spot) => (
                    <label
                      key={spot.id}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedSpotId === spot.id
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="spot"
                        checked={selectedSpotId === spot.id}
                        onChange={() => setSelectedSpotId(spot.id)}
                        className="mt-1 text-emerald-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <strong className="text-xs font-bold text-zinc-950">{spot.name}</strong>
                          {spot.isRecommended && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-0.5">{spot.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Proposed Meetup Date & Time
                </label>
                <input
                  type="text"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  placeholder="e.g. Today at 5:30 PM, Tomorrow after lunch..."
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm Meetup Spot & Activate Meetup Mode</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* PHASE 3: MEETUP MODE ACTIVE */}
        {offer.status === 'ACCEPTED' && offer.meetingSpotId && (
          <div className="space-y-5 animate-fadeIn">
            {/* Live Handshake Dashboard */}
            <div className="rounded-3xl border border-emerald-300 bg-white p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    <ShieldCheck className="h-4 w-4" />
                    Meetup Mode Active &bull; Safe CCTV Spot
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                    Ready for Physical Campus Exchange
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Bring the item to the designated spot, inspect thoroughly, and settle payment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowUpiModal(true)}
                    className="px-4 py-2.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <QrCode className="h-4 w-4" />
                    <span>View Peer UPI QR</span>
                  </button>
                </div>
              </div>

              {/* Meetup Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Designated CCTV Spot
                    </span>
                    <strong className="text-sm font-black text-zinc-900 block mt-0.5">
                      {activeSpot?.name || 'Central Library Main Gate'}
                    </strong>
                    <p className="text-xs text-zinc-500 mt-0.5">{activeSpot?.description}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Scheduled Meetup Time
                    </span>
                    <strong className="text-sm font-black text-zinc-900 block mt-0.5">
                      {offer.meetingTime || 'Today at 5:30 PM'}
                    </strong>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Check in with {otherUser.fullName} if delayed.
                    </p>
                  </div>
                </div>
              </div>

              {/* CCTV Safety Protocol */}
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
                <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>3-Point Exchange Checklist</span>
                </span>
                <ul className="text-xs text-zinc-600 space-y-1 list-disc pl-5">
                  <li><strong>Physical Inspection:</strong> Test calculator battery or flip through book pages before transferring money.</li>
                  <li><strong>Zero Advance Deposit:</strong> Never send UPI money before meeting in person.</li>
                  <li><strong>Cashless Handshake:</strong> Use peer UPI QR code directly at the meetup spot.</li>
                </ul>
              </div>

              {/* Final Complete Transaction Button */}
              <button
                onClick={() => completeTransaction(offer.id)}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5" />
                <span>Confirm Physical Handshake & Complete Reuse</span>
              </button>
            </div>
          </div>
        )}

        {/* PHASE 4: COMPLETED TRANSACTION & REUSE TELEMETRY */}
        {offer.status === 'COMPLETED' && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn text-center">
            <div className="mx-auto h-16 w-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h2 className="text-2xl font-black text-zinc-950">
                Handshake Verified & Completed!
              </h2>
              <p className="text-xs text-zinc-600">
                Thank you for participating in {currentCampus.shortCode}&apos;s circular reuse ecosystem. Another item diverted from waste!
              </p>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-center pt-2">
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <strong className="text-lg font-black text-emerald-700 block">
                  ₹{listing?.originalNewPrice ? listing.originalNewPrice - currentPrice : 500}
                </strong>
                <span className="text-[11px] text-zinc-500 font-medium">Money Saved</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                <strong className="text-lg font-black text-zinc-900 block">1.8 kg</strong>
                <span className="text-[11px] text-zinc-500 font-medium">CO₂ Diverted</span>
              </div>
            </div>

            {/* Student Review Form */}
            {!reviewSubmitted ? (
              <div className="max-w-md mx-auto p-5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-3 text-left">
                <span className="text-xs font-bold text-zinc-900 block">
                  Leave a Student Trust Endorsement for {otherUser.fullName}
                </span>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-zinc-300 hover:text-amber-400"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= reviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-zinc-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setReviewSubmitted(true)}
                  className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs hover:bg-zinc-800 transition-colors"
                >
                  Submit Trust Endorsement
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-50 text-xs font-bold text-emerald-900">
                ✓ Thank you! Your trust rating was added to {otherUser.fullName}&apos;s campus profile.
              </div>
            )}
          </div>
        )}

        {/* UPI QR Code Modal Simulator */}
        {showUpiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-3xl border border-zinc-200 bg-white p-6 space-y-4 shadow-xl text-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Campus Peer UPI Pay
                </span>
                <button
                  onClick={() => setShowUpiModal(false)}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700"
                >
                  &times;
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col items-center space-y-3">
                <div className="h-44 w-44 rounded-2xl bg-white border border-zinc-200 p-3 shadow-inner flex items-center justify-center">
                  <QrCode className="h-36 w-36 text-zinc-950" />
                </div>
                <div>
                  <span className="text-xs font-black text-zinc-900 block">
                    Paying: ₹{currentPrice}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {otherUser.collegeEmail.split('@')[0]}@campusupi
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 leading-snug">
                Scan with Google Pay, PhonePe, or Paytm once you meet {otherUser.fullName} at {activeSpot?.name || 'the campus spot'} and inspect the item.
              </p>

              <button
                onClick={() => setShowUpiModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-bold text-xs"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OfferDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading negotiation & meetup...</div>}>
      <OfferDetailContent />
    </Suspense>
  );
}
