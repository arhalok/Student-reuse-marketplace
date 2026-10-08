'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Offer } from '@/lib/types';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Layers,
  Compass,
  MessageSquare,
  QrCode,
  MapPin,
  X,
  Zap,
} from 'lucide-react';

interface InteractiveDemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  onInspectListing: (listing: Listing) => void;
  onOpenOffer: (listing: Listing) => void;
  onOpenNeedBoard: () => void;
  onOpenCreateListing: (title: string, budget?: number) => void;
  onOpenHealthDashboard: () => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    title: '1. What is CampuShare?',
    subtitle: 'Campus-first reuse marketplace for verified students',
    description:
      'CampuShare solves the semester procurement cycle. Seniors finish calculators, drawing tools, and textbooks; incoming juniors need them immediately on the same campus.',
    keyBadge: 'Value Proposition',
    ctaLabel: 'Next: Find Calculator →',
  },
  {
    step: 2,
    title: '2. Instant Discovery & Search',
    subtitle: 'Browse verified campus inventory with condition checks',
    description:
      'Students search specifically by course, semester, or tool name. Real condition ratings, photo checks, and campus distance are visible at a glance.',
    keyBadge: 'Fast Discovery',
    ctaLabel: 'Inspect Casio FX-991CW →',
  },
  {
    step: 3,
    title: '3. Standardized Condition & Trust',
    subtitle: 'Tested keypad, display health & verified seller identity',
    description:
      'Unlike generic classifieds, CampuShare requires verified condition checks: screen scratches, battery health, and syllabus edition match.',
    keyBadge: 'Trust System',
    ctaLabel: 'Simulate Making Offer (₹750) →',
  },
  {
    step: 4,
    title: '4. Peer Negotiation Lifecycle',
    subtitle: 'Direct counteroffers with zero middleman fee',
    description:
      'Buyers propose fair prices based on campus price guidance. Seniors can accept, counter, or decline with 1 click.',
    keyBadge: 'Negotiation',
    ctaLabel: 'Accept Offer & Reserve Item →',
  },
  {
    step: 5,
    title: '5. Safe Campus Meetup Mode',
    subtitle: 'Scheduled handoff at pre-designated CCTV spots',
    description:
      'Once accepted, both students agree on a safe, high-traffic spot on campus like Central Library Foyer or Student Activity Center (SAC).',
    keyBadge: 'Safe Handoff',
    ctaLabel: 'Confirm Meetup at Library →',
  },
  {
    step: 6,
    title: '6. In-Person Inspection & UPI Payment',
    subtitle: 'Inspect physical goods before releasing funds',
    description:
      'Students meet, verify the calculator keys and display, and scan peer UPI QR code to complete the transfer directly.',
    keyBadge: 'Zero Scam',
    ctaLabel: 'Complete Exchange & Mark Sold →',
  },
  {
    step: 7,
    title: '7. Closed Loop: Review & Impact',
    subtitle: 'Student reputation updated, campus carbon savings logged',
    description:
      'The seller receives a verified 5-star transaction review. Real-time campus counters log the rupees saved and kilograms of waste avoided.',
    keyBadge: 'Circular Impact',
    ctaLabel: 'Next: The Killer Feature (Need Board) →',
  },
  {
    step: 8,
    title: '8. The Need Board (Demand Before Supply)',
    subtitle: 'The core differentiator: students broadcast what they need',
    description:
      'When an item is out of stock, students post a request. As soon as a graduating senior lists that tool, CampuShare alerts both parties instantly.',
    keyBadge: 'Reverse Demand',
    ctaLabel: 'Finish Tour 🎉',
  },
];

export const InteractiveDemoTour: React.FC<InteractiveDemoTourProps> = ({
  isOpen,
  onClose,
  onInspectListing,
  onOpenOffer,
  onOpenNeedBoard,
  onOpenCreateListing,
  onOpenHealthDashboard,
}) => {
  const { listings, makeOffer, respondToOffer, scheduleMeeting, completeTransaction, offers, resetData } =
    useMarketplace();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const step = DEMO_STEPS[currentStepIndex];

  // Helper to trigger actions along the tour
  const handleStepAction = () => {
    const calcListing = listings.find((l) => l.title.includes('Casio') || l.categoryId === 'cat-calc') || listings[0];

    switch (step.step) {
      case 1:
        // Scroll to hero or catalog
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStepIndex(1);
        break;
      case 2:
        // Inspect calculator listing
        if (calcListing) {
          onInspectListing(calcListing);
        }
        setCurrentStepIndex(2);
        break;
      case 3:
        // Open offer modal on calculator
        if (calcListing) {
          onOpenOffer(calcListing);
        }
        setCurrentStepIndex(3);
        break;
      case 4:
        // Simulate offer creation and acceptance
        if (calcListing) {
          try {
            const newOffer = makeOffer(calcListing.id, 750, 'Can pick up today between lectures');
            respondToOffer(newOffer.id, 'ACCEPT');
          } catch {
            // offer already active
          }
        }
        setCurrentStepIndex(4);
        break;
      case 5:
        // Schedule meeting
        if (calcListing) {
          const active = offers.find((o) => o.listingId === calcListing.id);
          if (active) {
            scheduleMeeting(active.id, 'spot-lib', 'Today at 5:00 PM');
          }
        }
        setCurrentStepIndex(5);
        break;
      case 6:
        // Complete transaction
        if (calcListing) {
          const active = offers.find((o) => o.listingId === calcListing.id);
          if (active) {
            completeTransaction(active.id);
          }
        }
        setCurrentStepIndex(6);
        break;
      case 7:
        // Open need board to show reverse demand
        onOpenNeedBoard();
        setCurrentStepIndex(7);
        break;
      case 8:
        onClose();
        break;
    }
  };

  return (
    <aside aria-label="Demo Tour Guide" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-sheet-up">
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 text-white p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs shadow-md shadow-emerald-500/30">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-white block">
                2-Minute Evaluator Tour
              </span>
              <span className="text-[10px] text-zinc-400">
                Step {step.step} of {DEMO_STEPS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 text-[10px] border border-emerald-500/30">
              {step.keyBadge}
            </span>
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <h4 className="font-extrabold text-sm text-zinc-100">{step.title}</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1">
          {DEMO_STEPS.map((s, idx) => (
            <div
              key={s.step}
              className={`h-1.5 rounded-full transition-all ${
                idx === currentStepIndex
                  ? 'w-6 bg-emerald-400'
                  : idx < currentStepIndex
                  ? 'w-2 bg-emerald-700'
                  : 'w-2 bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
          <button
            onClick={() => {
              if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
            }}
            disabled={currentStepIndex === 0}
            className="px-3 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white disabled:opacity-20 flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back</span>
          </button>

          <button
            onClick={handleStepAction}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all truncate"
          >
            <span>{step.ctaLabel}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
