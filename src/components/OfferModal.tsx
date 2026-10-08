'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer } from '@/lib/types';
import {
  X,
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
} from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  activeOffer?: Offer | null;
}

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
  } = useMarketplace();

  const [offeredAmount, setOfferedAmount] = useState<number | ''>(
    listing ? listing.price - 50 : 700
  );
  const [offerNotes, setOfferNotes] = useState('');
  const [counterAmount, setCounterAmount] = useState<number | ''>(
    listing ? listing.price - 25 : 725
  );
  const [selectedSpotId, setSelectedSpotId] = useState('spot-lib');
  const [meetingTime, setMeetingTime] = useState('Today at 4:00 PM');
  const [chatInput, setChatInput] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="h-12 w-12 rounded-xl object-cover border border-zinc-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-zinc-900 text-sm">{listing.title}</h3>
                <span className="rounded-full bg-zinc-200 text-zinc-700 text-[10px] font-bold px-2 py-0.5 uppercase">
                  {listing.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium">
                Listed Price: <strong className="text-zinc-900">₹{listing.price}</strong> • Mode: {listing.mode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Active Offer Negotiation State */}
          {currentOffer ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/40 p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200/60 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Offer Status: <span className="text-emerald-700">{currentOffer.status}</span>
                </span>
                <span className="text-xs font-semibold text-zinc-700">
                  Offered: ₹{currentOffer.offeredAmount}
                  {currentOffer.counterAmount && ` (Counter: ₹${currentOffer.counterAmount})`}
                </span>
              </div>

              {/* Status Specific Next Actions */}
              {currentOffer.status === 'PENDING' && (
                <div>
                  {isSeller ? (
                    <div className="space-y-3">
                      <div className="text-xs text-zinc-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        Buyer offered <strong>₹{currentOffer.offeredAmount}</strong> for this item.
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => respondToOffer(currentOffer.id, 'ACCEPT')}
                          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                        >
                          Accept Offer (₹{currentOffer.offeredAmount})
                        </button>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={counterAmount}
                            onChange={(e) => setCounterAmount(Number(e.target.value))}
                            className="w-24 rounded-xl border border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-900"
                            placeholder="Counter ₹"
                          />
                          <button
                            onClick={() => respondToOffer(currentOffer.id, 'COUNTER', Number(counterAmount))}
                            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                          >
                            Counter-Offer
                          </button>
                        </div>
                        <button
                          onClick={() => respondToOffer(currentOffer.id, 'REJECT')}
                          className="rounded-xl border border-red-200 text-red-600 px-3 py-2 text-xs font-semibold hover:bg-red-50"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                      Your offer of <strong>₹{currentOffer.offeredAmount}</strong> was sent to the seller. Awaiting their acceptance or counter-offer.
                    </div>
                  )}
                </div>
              )}

              {/* Countered state */}
              {currentOffer.status === 'COUNTERED' && (
                <div>
                  {isBuyer ? (
                    <div className="space-y-3">
                      <div className="text-xs text-purple-900 bg-purple-50 p-3 rounded-xl border border-purple-200">
                        Seller sent a counter-offer of <strong>₹{currentOffer.counterAmount}</strong>.
                      </div>
                      <button
                        onClick={() => respondToOffer(currentOffer.id, 'ACCEPT')}
                        className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-700"
                      >
                        Accept Counter Offer (₹{currentOffer.counterAmount})
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-600 bg-purple-50 p-3 rounded-xl">
                      You countered with <strong>₹{currentOffer.counterAmount}</strong>. Awaiting buyer confirmation.
                    </div>
                  )}
                </div>
              )}

              {/* Accepted / Schedule Meeting */}
              {currentOffer.status === 'ACCEPTED' && listing.status !== 'MEETING_SCHEDULED' && listing.status !== 'SOLD' && (
                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Offer Accepted! Schedule Safe Campus Exchange Spot (Section 17)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                        Select Campus Meeting Spot
                      </label>
                      <select
                        value={selectedSpotId}
                        onChange={(e) => setSelectedSpotId(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900"
                      >
                        {exchangeSpots.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-600 mb-1">
                        Select Time
                      </label>
                      <input
                        type="text"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        className="w-full rounded-xl border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => scheduleMeeting(currentOffer.id, selectedSpotId, meetingTime)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                  >
                    Confirm Campus Meeting
                  </button>
                </div>
              )}

              {/* Meeting Scheduled State & UPI Payment (Section 18) */}
              {(listing.status === 'MEETING_SCHEDULED' || currentOffer.meetingSpot) && listing.status !== 'SOLD' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    <span>Exchange Scheduled at: {currentOffer.meetingSpot?.name || 'Central Library Foyer'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-800">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    <span>Time: {currentOffer.meetingTime || 'Today at 4:00 PM'}</span>
                  </div>

                  {/* Direct UPI Payment flow */}
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="text-zinc-600">Pay via UPI upon physical inspection: </span>
                      <strong className="text-zinc-900">rahul@okhdfcbank</strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowUpiModal(!showUpiModal)}
                        className="flex items-center gap-1 rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                      >
                        <QrCode className="h-3.5 w-3.5" />
                        <span>{showUpiModal ? 'Hide UPI QR' : 'Show UPI QR'}</span>
                      </button>

                      <button
                        onClick={() => completeTransaction(currentOffer.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        Item Handed Over &amp; Verified (Mark Sold)
                      </button>
                    </div>
                  </div>

                  {showUpiModal && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-center space-y-2">
                      <div className="text-xs font-bold text-zinc-900">Direct Campus UPI Payment</div>
                      <div className="mx-auto h-28 w-28 bg-zinc-100 border border-zinc-200 rounded-lg flex items-center justify-center">
                        <QrCode className="h-20 w-20 text-zinc-800" />
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Scan with GPay / PhonePe / Paytm to pay <strong>₹{currentOffer.counterAmount || currentOffer.offeredAmount}</strong>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Completed / Sold state */}
              {listing.status === 'SOLD' && (
                <div className="rounded-xl bg-emerald-100 p-4 text-center border border-emerald-300">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-extrabold text-sm mb-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>Transaction Successfully Completed!</span>
                  </div>
                  <p className="text-xs text-emerald-800">
                    The item has been reused. Seller reputation score updated (+1 Successful Reuse).
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* No offer exists yet: Buyer can make an offer */
            <form onSubmit={handleCreateOffer} className="rounded-2xl border border-zinc-200 p-5 space-y-4 bg-zinc-50/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Make an Offer to Seller (Section 20)
                </span>
                <span className="text-xs text-zinc-500">
                  Listed Price: <strong>₹{listing.price}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Your Offer Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={offeredAmount}
                    onChange={(e) => setOfferedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-sm font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Note for Seller (Optional)
                  </label>
                  <input
                    type="text"
                    value={offerNotes}
                    onChange={(e) => setOfferNotes(e.target.value)}
                    placeholder="e.g. Can meet today at Library"
                    className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-200"
                >
                  Send Offer (₹{offeredAmount})
                </button>
              </div>
            </form>
          )}

          {/* Controlled Messaging Chat (PRD Section 19) */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Campus Chat (Negotiation &amp; Meetup Details)
            </span>

            <div className="h-36 overflow-y-auto space-y-2 border border-zinc-100 rounded-xl p-3 bg-zinc-50/50 mb-3">
              {relevantMessages.length === 0 ? (
                <div className="text-center text-xs text-zinc-400 py-6">
                  No messages yet. Use chat to coordinate physical condition inspection or campus meetup.
                </div>
              ) : (
                relevantMessages.map((m) => {
                  const isMe = m.senderId === currentProfile.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`rounded-2xl px-3 py-1.5 text-xs max-w-xs ${
                          isMe
                            ? 'bg-zinc-900 text-white rounded-br-xs'
                            : 'bg-white border border-zinc-200 text-zinc-800 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        {m.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about calculator condition, meetup time..."
                className="flex-1 rounded-xl border border-zinc-300 px-3 py-1.5 text-xs text-zinc-900 focus:outline-hidden focus:border-zinc-500"
              />
              <button
                type="submit"
                className="rounded-xl bg-zinc-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors flex items-center gap-1"
              >
                <Send className="h-3 w-3" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
