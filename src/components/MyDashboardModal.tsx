'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer, NeedRequest } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  User,
  ShoppingBag,
  Tag,
  Layers,
  Recycle,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle2,
  MapPin,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface MyDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectListing: (listing: Listing) => void;
  onOpenOffer: (offer: Offer, listing: Listing) => void;
  onOpenCreateListing: () => void;
  onOpenNeedBoard: () => void;
  onOpenSavedItems: () => void;
}

export const MyDashboardModal: React.FC<MyDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectListing,
  onOpenOffer,
  onOpenCreateListing,
  onOpenNeedBoard,
  onOpenSavedItems,
}) => {
  const {
    currentProfile,
    currentCampus,
    listings,
    offers,
    needRequests,
    savedListingIds,
    impactStats,
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'buying' | 'selling' | 'needs' | 'impact'>('buying');

  if (!isOpen) return null;

  // Buying subsets
  const mySavedListings = listings.filter((l) => savedListingIds.includes(l.id));
  const mySentOffers = offers.filter((o) => o.buyerId === currentProfile.id);
  const myPurchases = offers.filter((o) => o.buyerId === currentProfile.id && o.status === 'COMPLETED');

  // Selling subsets
  const myListings = listings.filter((l) => l.sellerId === currentProfile.id);
  const myActiveSales = myListings.filter((l) => l.status === 'ACTIVE' || l.status === 'OFFER_RECEIVED');
  const myReservedSales = myListings.filter((l) => l.status === 'RESERVED' || l.status === 'MEETING_SCHEDULED');
  const mySoldListings = myListings.filter((l) => l.status === 'SOLD');
  const myReceivedOffers = offers.filter((o) => o.sellerId === currentProfile.id);

  // Needs subsets
  const myNeeds = needRequests.filter((n) => n.buyerId === currentProfile.id);

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="My CampuShare"
      subtitle={`Personal marketplace activity for ${currentProfile.fullName} on ${currentCampus.shortCode}`}
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/20">
          <User className="h-5 w-5" />
        </div>
      }
      maxWidth="3xl"
    >
      <div className="space-y-5">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-200">
          <button
            onClick={() => setActiveTab('buying')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'buying'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Buying ({mySentOffers.length + mySavedListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('selling')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'selling'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Selling ({myListings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('needs')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'needs'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>My Needs ({myNeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'impact'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Recycle className="h-4 w-4" />
            <span>My Impact</span>
          </button>
        </div>

        {/* TAB 1: BUYING */}
        {activeTab === 'buying' && (
          <div className="space-y-4">
            {/* Outgoing Offers */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                <span>Active Offers &amp; Negotiations ({mySentOffers.length})</span>
              </div>
              {mySentOffers.length === 0 ? (
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-500 text-center">
                  You haven&apos;t made any offers yet. Explore the marketplace to negotiate with fellow students!
                </div>
              ) : (
                <div className="space-y-2">
                  {mySentOffers.map((o) => {
                    const l = listings.find((item) => item.id === o.listingId);
                    if (!l) return null;
                    return (
                      <div
                        key={o.id}
                        onClick={() => {
                          onClose();
                          onOpenOffer(o, l);
                        }}
                        className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={l.images[0]}
                            alt={l.title}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <span className="font-bold text-zinc-900 block truncate max-w-xs">{l.title}</span>
                            <span className="text-[11px] text-zinc-500">
                              Offered: ₹{o.offeredAmount} {o.counterAmount && `(Counter: ₹${o.counterAmount})`}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-700">
                            {o.status}
                          </span>
                          <span className="text-zinc-400">→</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Saved Items Preview */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                <span>Wishlist / Saved Items ({mySavedListings.length})</span>
                {mySavedListings.length > 0 && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSavedItems();
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    View All →
                  </button>
                )}
              </div>
              {mySavedListings.length === 0 ? (
                <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-500 text-center">
                  No saved items. Click the ❤️ on any card to monitor price changes.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mySavedListings.slice(0, 4).map((l) => (
                    <div
                      key={l.id}
                      onClick={() => {
                        onClose();
                        onSelectListing(l);
                      }}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 cursor-pointer text-xs"
                    >
                      <img src={l.images[0]} alt={l.title} className="h-10 w-10 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <span className="font-bold text-zinc-900 truncate block">{l.title}</span>
                        <span className="text-emerald-700 font-black">₹{l.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SELLING */}
        {activeTab === 'selling' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                Your Campus Listings ({myListings.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenCreateListing();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ List New Item</span>
              </button>
            </div>

            {myListings.length === 0 ? (
              <div className="p-8 rounded-2xl border border-zinc-200 bg-zinc-50 text-center space-y-2">
                <span className="text-sm font-bold text-zinc-800">No active listings</span>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Have textbooks, drawing kits, or calculators sitting in your dorm? List them in under 60 seconds!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenCreateListing();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors"
                >
                  Create Listing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {myListings.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      onClose();
                      onSelectListing(l);
                    }}
                    className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={l.images[0]} alt={l.title} className="h-10 w-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-zinc-900 block truncate max-w-xs">{l.title}</span>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                          <span className="font-black text-zinc-950">₹{l.price}</span>
                          <span>•</span>
                          <span>{l.viewsCount} views</span>
                          <span>•</span>
                          <span>{l.savesCount} saves</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          l.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : l.status === 'RESERVED'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {l.status}
                      </span>
                      <span className="text-zinc-400">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: NEEDS */}
        {activeTab === 'needs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                My Broadcasted Requests ({myNeeds.length})
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenNeedBoard();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors shadow-2xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ Post a Need</span>
              </button>
            </div>

            {myNeeds.length === 0 ? (
              <div className="p-8 rounded-2xl border border-zinc-200 bg-zinc-50 text-center space-y-2">
                <span className="text-sm font-bold text-zinc-800">No open requests</span>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Can&apos;t find an item on the marketplace? Post a request on the Need Board so graduating seniors know what you need!
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onOpenNeedBoard();
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition-colors"
                >
                  Post on Need Board
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {myNeeds.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-zinc-900 font-extrabold">{n.itemTitle}</strong>
                      <span className="rounded-md bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold">
                        Budget: Max ₹{n.maxBudget}
                      </span>
                    </div>
                    <p className="text-zinc-600 text-[11px]">{n.notes || 'Looking for passing senior who no longer needs this.'}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-amber-200/50 text-[10px] text-zinc-500">
                      <span>Status: <strong className="text-amber-800 uppercase">{n.status}</strong></span>
                      <span>Target Sem: {n.targetSemester || 2}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: IMPACT */}
        {activeTab === 'impact' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-sm">
                <Recycle className="h-5 w-5 text-emerald-600" />
                <span>Your Campus Circular Footprint</span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                By purchasing and selling reusable academic supplies through CampuShare, you keep functional calculators, tools, and textbooks from being discarded.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs text-center">
                  <span className="text-2xl font-black text-zinc-950 block">{myPurchases.length + mySoldListings.length + 3}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">Items Reused By You</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs text-center">
                  <span className="text-2xl font-black text-emerald-700 block">₹{((myPurchases.length + mySoldListings.length + 3) * 650).toLocaleString()}</span>
                  <span className="text-[11px] text-zinc-500 font-medium">Rupees Saved / Recouped</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs text-center">
                  <span className="text-2xl font-black text-zinc-800 block">{((myPurchases.length + mySoldListings.length + 3) * 4.2).toFixed(1)} kg</span>
                  <span className="text-[11px] text-zinc-500 font-medium">CO₂ Diverted</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalWrapper>
  );
};
