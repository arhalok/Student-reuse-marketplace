'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/lib/store';
import { ItemCondition } from '@/lib/types';
import {
  Package,
  Layers,
  Calculator,
  ArrowRight,
  Plus,
  HeartHandshake,
  ShieldCheck,
  Tag,
} from 'lucide-react';

export default function SellHubPage() {
  const {
    listings,
    currentCampus,
    currentProfile,
    calculateFairPrice,
  } = useMarketplace();

  // Fair price calculator state
  const [calcOriginalPrice, setCalcOriginalPrice] = useState<number | ''>(1200);
  const [calcCondition, setCalcCondition] = useState<ItemCondition>('EXCELLENT');

  const fairPriceResult = calculateFairPrice(
    Number(calcOriginalPrice) || 1000,
    calcCondition
  );

  const myListings = listings.filter((l) => l.sellerId === currentProfile.id);

  return (
    <div className="flex-1 w-full bg-zinc-50/50 pb-24 md:pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header Hero */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                <Package className="h-3.5 w-3.5" />
                Senior Student Resale Hub
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                Sell or Pass On to Juniors
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Turn unused textbooks, drafters, calculators, and lab coats into cash. Meet safely on campus at {currentCampus.shortCode} without courier fees or commissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/sell/create"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-98 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>List an Item Now</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Selling Modes */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Choose Your Selling Pathway
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mode 1: Single Item */}
            <Link
              href="/sell/create"
              className="rounded-3xl border border-zinc-200 bg-white p-6 hover:border-emerald-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Tag className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 group-hover:text-emerald-700 transition-colors">
                    Single Item Listing
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    List a textbook, scientific calculator, drafter, or tech gadget in under 2 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-emerald-700 gap-1.5 pt-2 border-t border-zinc-100">
                <span>Start Single Listing</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Mode 2: Semester Clear-Out */}
            <Link
              href="/sell/clearout"
              className="rounded-3xl border border-zinc-200 bg-white p-6 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-black text-zinc-950 group-hover:text-amber-700 transition-colors">
                      Semester Clear-Out
                    </h3>
                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      Popular
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Passed your semester? Bundle your previous coursework kit for incoming juniors.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-amber-800 gap-1.5 pt-2 border-t border-zinc-100">
                <span>Bundle Course Kit</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Mode 3: Give Away / Free */}
            <Link
              href="/sell/create?mode=GIVE_AWAY"
              className="rounded-3xl border border-zinc-200 bg-white p-6 hover:border-purple-400 hover:shadow-xs transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-3">
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950 group-hover:text-purple-700 transition-colors">
                    Pass Forward (Free)
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Gift unused notebooks, notes, or older editions to junior batches. Earn green campus karma.
                  </p>
                </div>
              </div>

              <div className="flex items-center text-xs font-bold text-purple-700 gap-1.5 pt-2 border-t border-zinc-100">
                <span>Post Free Handover</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* Fair Price Calculator Widget */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <Calculator className="h-4 w-4 text-emerald-600" />
                <span>Fair Campus Price Calculator</span>
              </div>
              <h2 className="text-lg font-black text-zinc-950">
                How Much Should You Price Your Item?
              </h2>
            </div>
            <span className="hidden sm:inline-flex text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-xl">
              Prevents Price Gouging
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Original Retail Price (₹)
                  </label>
                  <input
                    type="number"
                    value={calcOriginalPrice}
                    onChange={(e) => setCalcOriginalPrice(Number(e.target.value) || '')}
                    placeholder="e.g. 1200"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm font-bold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Item Condition
                  </label>
                  <select
                    value={calcCondition}
                    onChange={(e) => setCalcCondition(e.target.value as ItemCondition)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                  >
                    <option value="LIKE_NEW">Like New (Mint)</option>
                    <option value="EXCELLENT">Excellent (Light signs of use)</option>
                    <option value="GOOD">Good (Standard wear)</option>
                    <option value="FAIR">Fair (Highlights / marks)</option>
                    <option value="FOR_PARTS">For Parts / Functional Only</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-zinc-500">
                Campus buyers prioritize items priced fairly between 40% to 65% of original retail prices. Realistic pricing leads to 3x faster meetups.
              </p>
            </div>

            {/* Calculated recommendation box */}
            <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Suggested Campus Price
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1">
                  ₹{fairPriceResult.suggested}
                </div>
                <div className="text-xs text-emerald-800 mt-1 font-medium">
                  Acceptable Range: ₹{fairPriceResult.min} &ndash; ₹{fairPriceResult.max}
                </div>
              </div>

              <Link
                href={`/sell/create?price=${fairPriceResult.suggested}&original=${calcOriginalPrice}&condition=${calcCondition}`}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs text-center transition-colors shadow-xs"
              >
                Use this price &bull; List item
              </Link>
            </div>
          </div>
        </div>

        {/* My Current Active Listings Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-zinc-950">
              My Active Campus Listings ({myListings.length})
            </h2>
            <Link
              href="/profile"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-900"
            >
              Manage in Profile &rarr;
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-center space-y-3">
              <p className="text-xs font-bold text-zinc-700">You don&apos;t have any active listings yet</p>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Got items you no longer use? List them to clear out your hostel room and earn cash.
              </p>
              <Link
                href="/sell/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-950 text-white font-bold text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create First Listing</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {myListings.map((item) => (
                <Link
                  key={item.id}
                  href={`/listing/${item.id}`}
                  className="rounded-2xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 hover:shadow-xs transition-all flex items-center gap-3.5 group"
                >
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    className="h-16 w-16 rounded-xl object-cover shrink-0 ring-1 ring-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {item.status}
                    </span>
                    <h3 className="font-bold text-xs text-zinc-900 truncate mt-1">{item.title}</h3>
                    <span className="text-sm font-black text-zinc-950 block mt-0.5">
                      ₹{item.price}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Safety & Protocol Footer */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 flex items-start gap-4">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-black text-zinc-950">Campus Seller Code of Conduct</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Always disclose item condition truthfully (torn textbook pages, calculator display issues). Meet junior buyers inside the university campus at designated daylight CCTV spots like Central Library Gate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
