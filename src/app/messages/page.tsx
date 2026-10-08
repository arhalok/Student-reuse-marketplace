'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { INITIAL_PROFILES } from '@/lib/mock-data';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function MessagesInboxPage() {
  const { messages, listings, currentProfile, currentCampus, offers } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState('');

  // Group messages by conversation (listingId + counterpartId)
  const conversationMap = new Map<string, {
    listingId: string;
    counterpartId: string;
    lastMessage: string;
    lastTimestamp: string;
    count: number;
  }>();

  messages.forEach((msg) => {
    const counterpartId = msg.senderId === currentProfile.id ? msg.receiverId : msg.senderId;
    const key = `${msg.listingId}_${counterpartId}`;
    const existing = conversationMap.get(key);

    if (!existing || new Date(msg.createdAt) > new Date(existing.lastTimestamp)) {
      conversationMap.set(key, {
        listingId: msg.listingId,
        counterpartId,
        lastMessage: msg.content,
        lastTimestamp: msg.createdAt,
        count: (existing?.count || 0) + 1,
      });
    }
  });

  // If no stored messages yet, seed a default friendly conversation for active offers
  offers.forEach((offer) => {
    const isSeller = offer.sellerId === currentProfile.id;
    const counterpartId = isSeller ? offer.buyerId : offer.sellerId;
    const key = `${offer.listingId}_${counterpartId}`;
    if (!conversationMap.has(key)) {
      conversationMap.set(key, {
        listingId: offer.listingId,
        counterpartId,
        lastMessage: offer.notes || `Offer of ₹${offer.offeredAmount} submitted on campus.`,
        lastTimestamp: offer.createdAt,
        count: 1,
      });
    }
  });

  const conversations = Array.from(conversationMap.values());

  const filteredConversations = conversations.filter((conv) => {
    const listing = listings.find((l) => l.id === conv.listingId);
    const counterpart = INITIAL_PROFILES[conv.counterpartId];
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchListing = listing?.title.toLowerCase().includes(q);
    const matchUser = counterpart?.fullName.toLowerCase().includes(q);
    const matchMsg = conv.lastMessage.toLowerCase().includes(q);
    return matchListing || matchUser || matchMsg;
  });

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
              <MessageSquare className="h-3.5 w-3.5" />
              Campus Peer Messages
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
              Messages & Inquiries
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600">
              Direct discussions with verified students on {currentCampus.shortCode}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-xl">
              {conversations.length} Active Conversations
            </span>
          </div>
        </div>

        {/* Search Conversations */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, book, calculator..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-12 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-500">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-zinc-900">No conversations yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Inquire about an item or make an offer to start chatting with verified students.
              </p>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => {
              const listing = listings.find((l) => l.id === conv.listingId);
              const counterpart = INITIAL_PROFILES[conv.counterpartId] || {
                fullName: 'Campus Senior',
                degreeProgram: 'B.Tech Engineering',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              };

              return (
                <Link
                  key={`${conv.listingId}_${conv.counterpartId}`}
                  href={`/messages/${conv.listingId}?sellerId=${conv.counterpartId}`}
                  className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 hover:border-emerald-300 hover:shadow-xs transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative">
                      <img
                        src={counterpart.avatarUrl}
                        alt={counterpart.fullName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm font-black text-zinc-950 truncate">
                          {counterpart.fullName}
                        </strong>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[10px] text-zinc-400 font-medium truncate hidden sm:inline">
                          &bull; {counterpart.degreeProgram}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        {listing && (
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded text-[11px] truncate max-w-48">
                            {listing.title}
                          </span>
                        )}
                        <span className="text-zinc-500 truncate text-[11px]">
                          {conv.lastMessage}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex items-center gap-3">
                    <span className="text-[11px] text-zinc-400 font-medium hidden sm:inline">
                      {new Date(conv.lastTimestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Safety Note */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 flex items-start gap-3.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <strong className="font-black text-zinc-950 block">Campus Communication Safety</strong>
            <p className="text-zinc-500 leading-relaxed">
              Never share OTPs, bank passwords, or agree to meet outside university boundaries. Arrange exchanges exclusively at designated daylight spots like Central Library Gate or Student Activity Center.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
