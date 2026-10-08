'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  ShieldCheck,
  Tag,
} from 'lucide-react';

const QUICK_REPLIES = [
  'Is this still available on campus?',
  'Can we meet at Central Library Gate?',
  'Can we do ₹50 less?',
  'Are you free today at 5:30 PM?',
  'Clean condition, no missing pages?',
];

function MessageConversationContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const listingId = params.id as string;
  const targetSellerId = searchParams.get('sellerId') || searchParams.get('buyerId') || '';

  const {
    listings,
    messages,
    sendMessage,
    currentProfile,
    currentCampus,
    offers,
  } = useMarketplace();

  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const listing = listings.find((l) => l.id === listingId);

  // Identify counterpart
  const counterpartId =
    targetSellerId ||
    (listing?.sellerId !== currentProfile.id ? listing?.sellerId : 'user-amit') ||
    'user-rahul';

  const counterpart = INITIAL_PROFILES[counterpartId] || {
    id: counterpartId,
    fullName: 'Campus Senior',
    degreeProgram: 'B.Tech Engineering',
    isStudentVerified: true,
    trustRating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  };

  // Find existing offer between these two students for this listing
  const existingOffer = offers.find(
    (o) =>
      o.listingId === listingId &&
      ((o.buyerId === currentProfile.id && o.sellerId === counterpartId) ||
        (o.sellerId === currentProfile.id && o.buyerId === counterpartId))
  );

  // Filter messages between these two users for this listing
  const conversationMessages = messages.filter(
    (m) =>
      m.listingId === listingId &&
      ((m.senderId === currentProfile.id && m.receiverId === counterpartId) ||
        (m.senderId === counterpartId && m.receiverId === currentProfile.id))
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages.length]);

  const handleSend = (text: string) => {
    if (!text.trim() || !listing) return;
    sendMessage(listing.id, counterpartId, text.trim());
    setInputText('');
  };

  return (
    <div className="flex-1 w-full bg-zinc-50/50 flex flex-col h-[calc(100vh-4rem)] pb-20 md:pb-0">
      {/* Pinned Top Navigation Bar */}
      <div className="bg-white border-b border-zinc-200 px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-1 rounded-xl text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <img
              src={counterpart.avatarUrl}
              alt={counterpart.fullName}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500 shrink-0"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-zinc-950 truncate">
                  {counterpart.fullName}
                </span>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-zinc-500 truncate">
                {counterpart.degreeProgram} &bull; {currentCampus.shortCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {existingOffer && (
              <Link
                href={`/offers/${existingOffer.id}`}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                View Offer (₹{existingOffer.offeredAmount})
              </Link>
            )}

            {listing && (
              <Link
                href={`/listing/${listing.id}`}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs hidden sm:inline-flex"
              >
                View Item
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Pinned Item Summary Bar */}
      {listing && (
        <div className="bg-zinc-100/80 border-b border-zinc-200 px-4 py-2 text-xs shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate">
              <Tag className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span className="font-bold text-zinc-900 truncate">{listing.title}</span>
              <span className="text-zinc-400">&bull;</span>
              <span className="font-black text-emerald-700 shrink-0">₹{listing.price}</span>
            </div>

            <Link
              href={`/listing/${listing.id}`}
              className="text-[11px] font-bold text-zinc-600 hover:text-zinc-900 underline shrink-0"
            >
              Item Details
            </Link>
          </div>
        </div>
      )}

      {/* Message History Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-4xl w-full mx-auto space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-12">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900">
                Direct Student Chat with {counterpart.fullName}
              </h3>
              <p className="text-xs text-zinc-500 max-w-xs">
                Ask about textbook condition, calculator battery health, or propose a campus meetup spot.
              </p>
            </div>
          </div>
        ) : (
          conversationMessages.map((msg) => {
            const isMe = msg.senderId === currentProfile.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs ${
                    isMe
                      ? 'bg-zinc-950 text-white rounded-br-xs'
                      : 'bg-white border border-zinc-200 text-zinc-900 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  <p className="leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 px-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Action Area: Quick Replies & Text Input */}
      <div className="bg-white border-t border-zinc-200 p-3 sm:p-4 shrink-0">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Campus Quick Reply Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_REPLIES.map((reply, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(reply)}
                className="px-3 py-1 rounded-full text-[11px] font-bold bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-800 text-zinc-600 border border-zinc-200 whitespace-nowrap transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Chat Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${counterpart.fullName}...`}
              className="flex-1 px-4 py-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 disabled:opacity-40 text-white transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function MessageConversationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading chat...</div>}>
      <MessageConversationContent />
    </Suspense>
  );
}
