'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  ArrowRightLeft,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  QrCode,
  DollarSign,
  AlertCircle,
  ThumbsUp,
  X,
  Sparkles,
  Star,
  Recycle,
  Calendar,
} from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  activeOffer?: Offer | null;
}

const QUICK_REPLIES = [
  'Is this still available?',
  'Can we meet at Central Library?',
  'Does the keypad work smoothly?',
  'Can you do ₹50 less?',
  'I am available at 5 PM today.',
];

export const OfferModal: React.FC<OfferModalProps> = ({
  isOpen,
  onClose,
  listing,
  activeOffer,
}) => {
  const {
    currentProfile,
    exchangeSpots,
    makeOffer,
    respondToOffer,
    scheduleMeeting,
    completeTransaction,
    offers,
    messages,
    sendMessage,
    currentCampus,
  } = useMarketplace();

  const [offeredAmount, setOfferedAmount] = useState<number | ''>(
    listing ? (listing.price > 100 ? listing.price - 50 : listing.price) : 700
  );
  const [offerNotes, setOfferNotes] = useState('');
  const [counterAmount, setCounterAmount] = useState<number | ''>(
    listing ? listing.price - 25 : 725
  );
  const [selectedSpotId, setSelectedSpotId] = useState('spot-lib');
  const [meetingTime, setMeetingTime] = useState('Today at 5:30 PM');
  const [chatInput, setChatInput] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isOpen || !listing) return null;

  const currentOffer =
    activeOffer ||
    offers.find(
      (o) =>
        o.listingId === listing.id &&
        (o.buyerId === currentProfile.id || o.sellerId === currentProfile.id)
    );

  const isSeller = listing.sellerId === currentProfile.id;
  const isBuyer = !isSeller;

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    makeOffer(listing.id, Number(offeredAmount) || listing.price, offerNotes);
    setOfferNotes('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const targetUserId = isSeller ? currentOffer?.buyerId || 'user-amit' : listing.sellerId;
    sendMessage(listing.id, targetUserId, chatInput);
    setChatInput('');
  };

  const relevantMessages = messages.filter((m) => m.listingId === listing.id);
  const meetingSpot = exchangeSpots.find((s) => s.id === (currentOffer?.meetingSpotId || selectedSpotId));

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-zinc-950 text-base truncate">
            {listing.status === 'MEETING_SCHEDULED' ? 'Meetup Mode' : `Negotiate: ${listing.title}`}
          </span>
          <span className="rounded-full bg-zinc-100 text-zinc-700 text-[10px] font-bold px-2 py-0.5 uppercase shrink-0">
            {listing.status.replace('_', ' ')}
          </span>
        </div>
      }
      subtitle={`Listed Price: ₹${listing.price} • ${listing.mode} on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
      }
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Status Lifecycle Stepper (Section 16 of spec) */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
            <span className={listing.status === 'ACTIVE' ? 'text-emerald-700 font-black' : 'text-zinc-600'}>
              1. Listed
            </span>
            <span>→</span>
            <span className={listing.status === 'OFFER_RECEIVED' ? 'text-amber-700 font-black' : 'text-zinc-600'}>
              2. Offer Sent
            </span>
            <span>→</span>
            <span className={listing.status === 'RESERVED' ? 'text-indigo-700 font-black' : 'text-zinc-600'}>
              3. Reserved
            </span>
            <span>→</span>
            <span className={listing.status === 'MEETING_SCHEDULED' ? 'text-blue-700 font-black' : 'text-zinc-600'}>
              4. Meetup Mode
            </span>
            <span>→</span>
            <span className={listing.status === 'SOLD' ? 'text-emerald-700 font-black' : 'text-zinc-600'}>
              5. Completed 🎉
            </span>
          </div>
        </div>

        {/* Existing Active Offer State Box */}
        {currentOffer ? (
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Offer Status: <strong className="text-emerald-700">{currentOffer.status}</strong>
              </span>
              <span className="text-xs font-bold text-zinc-900">
                Offered: ₹{currentOffer.offeredAmount}
                {currentOffer.counterAmount && ` (Counter: ₹${currentOffer.counterAmount})`}
              </span>
            </div>

            {/* If Offer is PENDING */}
            {currentOffer.status === 'PENDING' && (
              <div>
                {isSeller ? (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                      Buyer offered <strong>₹{currentOffer.offeredAmount}</strong> for your listing.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => respondToOffer(currentOffer.id, 'ACCEPT')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-2xs"
                      >
                        Accept Offer (₹{currentOffer.offeredAmount})
                      </button>
                      <button
                        onClick={() => respondToOffer(currentOffer.id, 'COUNTER', Number(counterAmount))}
                        className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                      >
                        Counter: ₹{counterAmount}
                      </button>
                      <button
                        onClick={() => respondToOffer(currentOffer.id, 'REJECT')}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    Your offer of <strong>₹{currentOffer.offeredAmount}</strong> was sent to the senior. Awaiting their acceptance or counteroffer.
                  </div>
                )}
              </div>
            )}

            {/* If Offer is COUNTERED */}
            {currentOffer.status === 'COUNTERED' && (
              <div className="space-y-3">
                <div className="text-xs text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-200">
                  Seller countered with <strong>₹{currentOffer.counterAmount}</strong>.
                </div>
                {isBuyer && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => respondToOffer(currentOffer.id, 'ACCEPT')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white shadow-2xs"
                    >
                      Accept Counter (₹{currentOffer.counterAmount}) 🤝
                    </button>
                    <button
                      onClick={() => respondToOffer(currentOffer.id, 'REJECT')}
                      className="px-3 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-red-600"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* If Offer is ACCEPTED or RESERVED -> Meetup Scheduler (Section 17 of spec) */}
            {(currentOffer.status === 'ACCEPTED' || listing.status === 'RESERVED') && (
              <div className="space-y-3 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Reserved for Buyer! Schedule Safe Campus Meetup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Designated Safe CCTV Spot
                    </label>
                    <select
                      value={selectedSpotId}
                      onChange={(e) => setSelectedSpotId(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-xs font-medium"
                    >
                      {exchangeSpots.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-700 block mb-1">
                      Handoff Time
                    </label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-white p-2 text-xs font-medium"
                    />
                  </div>
                </div>

                <button
                  onClick={() => scheduleMeeting(currentOffer.id, selectedSpotId, meetingTime)}
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs transition-all active:scale-98"
                >
                  Confirm Meeting at Spot → Enter Meetup Mode
                </button>
              </div>
            )}

            {/* SECTION 18 OF SPEC: DEDICATED MEETUP MODE */}
            {listing.status === 'MEETING_SCHEDULED' && (
              <div className="p-5 rounded-2xl bg-linear-to-br from-blue-50/90 to-indigo-50/50 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between border-b border-blue-200/80 pb-3">
                  <span className="font-extrabold text-blue-950 text-xs sm:text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span>Safe Meetup Mode Active</span>
                  </span>
                  <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                    CCTV Monitored
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 block">Meetup Location</span>
                    <strong className="text-zinc-900 text-sm block mt-0.5">{meetingSpot?.name || 'Central Library Ground Foyer'}</strong>
                    <span className="text-[11px] text-zinc-500">Safe, public, security guards present</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 block">Scheduled Time</span>
                    <strong className="text-blue-900 text-sm block mt-0.5 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <span>{currentOffer.meetingTime || 'Today at 5:30 PM'}</span>
                    </strong>
                    <span className="text-[11px] text-zinc-500">Buyer &amp; Seller agreed</span>
                  </div>
                </div>

                <div className="pt-1 flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowUpiModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold shadow-md hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <span>Scan UPI QR Code (₹{currentOffer.counterAmount || currentOffer.offeredAmount})</span>
                  </button>

                  <button
                    onClick={() => {
                      completeTransaction(currentOffer.id);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Handoff Complete (Mark Sold)</span>
                  </button>
                </div>
              </div>
            )}

            {/* SECTION 19 OF SPEC: POST-TRANSACTION EXPERIENCE & REVIEW */}
            {currentOffer.status === 'COMPLETED' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <span className="font-extrabold text-sm text-emerald-950">Exchange completed 🎉</span>
                </div>
                <p className="text-zinc-600 leading-relaxed">
                  Congratulations! This item has been successfully reused on {currentCampus.name}. Academic waste avoided: ~4.2 kg CO₂.
                </p>

                {/* Star review form */}
                {!reviewSubmitted ? (
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-2">
                    <span className="font-bold text-zinc-900 block">Leave a quick review for the senior:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 text-amber-400 hover:text-amber-500 transition-colors"
                        >
                          <Star className={`h-5 w-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-zinc-700 ml-2">{reviewRating}.0 / 5.0</span>
                    </div>

                    <input
                      type="text"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="e.g. Great condition, punctual at library meetup!"
                      className="w-full rounded-lg border border-zinc-200 p-2 text-xs text-zinc-900"
                    />

                    <button
                      type="button"
                      onClick={() => setReviewSubmitted(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 shadow-2xs"
                    >
                      Submit Review
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Review submitted! Campus reputation score updated.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Create New Offer Form */
          <form onSubmit={handleCreateOffer} className="p-5 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Submit Direct Campus Offer
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">Your Offer (₹)</label>
                <input
                  type="number"
                  required
                  value={offeredAmount}
                  onChange={(e) => setOfferedAmount(Number(e.target.value) || '')}
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-sm font-black text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Meetup Note</label>
                <input
                  type="text"
                  value={offerNotes}
                  onChange={(e) => setOfferNotes(e.target.value)}
                  placeholder="e.g. Can meet after 2 PM at SAC"
                  className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white shadow-xs"
            >
              Send Offer to Senior (₹{offeredAmount || listing.price})
            </button>
          </form>
        )}

        {/* Section 20 of spec: Commerce Chat Thread */}
        <div className="space-y-3 pt-2 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-zinc-400">
              Campus Chat &amp; Negotiation
            </span>
            <span className="text-zinc-400 text-[11px]">{relevantMessages.length} messages</span>
          </div>

          {/* Quick Replies */}
          <div className="flex flex-wrap gap-1.5">
            {QUICK_REPLIES.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => {
                  const targetUserId = isSeller ? currentOffer?.buyerId || 'user-amit' : listing.sellerId;
                  sendMessage(listing.id, targetUserId, reply);
                }}
                className="rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shadow-2xs"
              >
                &ldquo;{reply}&rdquo;
              </button>
            ))}
          </div>

          {/* Messages list */}
          <div className="max-h-48 overflow-y-auto space-y-2 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
            {relevantMessages.length === 0 ? (
              <div className="py-6 text-center text-zinc-400 text-xs">
                No conversation yet. Send a quick question above or make an offer!
              </div>
            ) : (
              relevantMessages.map((m) => {
                const isMe = m.senderId === currentProfile.id;
                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-zinc-950 text-white rounded-br-2xs'
                          : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-2xs shadow-2xs'
                      }`}
                    >
                      <p>{m.content}</p>
                      <span className="text-[9px] opacity-60 block text-right mt-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask senior a question about condition or meetup..."
              className="flex-1 rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="px-3.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* UPI QR Code Overlay Modal */}
        {showUpiModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="rounded-3xl bg-white p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-modal-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <QrCode className="h-6 w-6" />
              </div>

              <div>
                <h3 className="font-extrabold text-zinc-950 text-base">Direct Peer UPI QR</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Pay directly to senior at meeting spot after inspecting condition.
                </p>
              </div>

              {/* QR Code Graphic */}
              <div className="mx-auto p-4 bg-zinc-50 border border-zinc-200 rounded-2xl w-48 h-48 flex flex-col items-center justify-center gap-2">
                <div className="w-36 h-36 border-4 border-zinc-900 rounded-xl flex items-center justify-center p-2 bg-white">
                  <div className="grid grid-cols-4 gap-1.5 w-full h-full">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-xs ${
                          i % 2 === 0 || i % 5 === 0 ? 'bg-zinc-900' : 'bg-zinc-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-zinc-500 block">Amount:</span>
                <span className="text-xl font-black text-zinc-950">
                  ₹{currentOffer?.counterAmount || currentOffer?.offeredAmount || listing.price}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">UPI ID: rahul.iitd@okhdfcbank</span>
              </div>

              <button
                onClick={() => {
                  setShowUpiModal(false);
                  if (currentOffer) completeTransaction(currentOffer.id);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xs"
              >
                Payment Confirmed &bull; Mark Sold
              </button>

              <button
                onClick={() => setShowUpiModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600 font-semibold"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
