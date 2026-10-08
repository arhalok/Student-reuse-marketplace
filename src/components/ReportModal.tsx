'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Report } from '@/lib/types';
import {
  ShieldAlert,
  X,
  AlertTriangle,
  UserX,
  CheckCircle2,
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSuccess: () => void;
}

const REPORT_REASONS: { key: Report['reason']; label: string; desc: string }[] = [
  { key: 'SCAM', label: 'Suspected Scam or Non-delivery', desc: 'Seller asking for pre-payment or suspicious behaviour' },
  { key: 'WRONG_PRODUCT', label: 'Wrong Product or Edition', desc: 'Item does not match photo or book edition differs' },
  { key: 'MISLEADING_PRICE', label: 'Misleading Price', desc: 'Price listed is unreasonable or bait-and-switch' },
  { key: 'FAKE_IDENTITY', label: 'Non-College / Fake Identity', desc: 'Person does not belong to this college campus' },
  { key: 'PROHIBITED', label: 'Prohibited or Non-Academic Item', desc: 'Item violates campus reuse safety guidelines' },
  { key: 'OFFENSIVE', label: 'Offensive or Inappropriate Content', desc: 'Abusive language or inappropriate imagery' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSuccess,
}) => {
  const { reportListing, blockUser } = useMarketplace();

  const [selectedReason, setSelectedReason] = useState<Report['reason']>('SCAM');
  const [details, setDetails] = useState('');
  const [alsoBlockUser, setAlsoBlockUser] = useState(false);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reportListing(listing.id, selectedReason, details);
    if (alsoBlockUser) {
      blockUser(listing.sellerId);
    }
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-red-50/40">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-zinc-900 text-base">Report Listing or Seller</h2>
              <p className="text-xs text-zinc-500">Protecting the campus community from scams and bad actors.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-xs font-semibold text-zinc-700">
            Reporting: <span className="font-bold text-zinc-900">{listing.title}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Select Violation Reason (Section 20)
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.key}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                    selectedReason === r.key
                      ? 'border-red-500 bg-red-50/50 text-red-950 ring-1 ring-red-500'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    checked={selectedReason === r.key}
                    onChange={() => setSelectedReason(r.key)}
                    className="mt-0.5 text-red-600"
                  />
                  <div>
                    <div className="font-bold">{r.label}</div>
                    <div className="text-[11px] text-zinc-500">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Additional Details (Optional)
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what occurred during chat or condition inspection..."
              className="w-full rounded-xl border border-zinc-300 p-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-red-500"
            />
          </div>

          {/* Block User checkbox */}
          <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={alsoBlockUser}
              onChange={(e) => setAlsoBlockUser(e.target.checked)}
              className="rounded text-red-600"
            />
            <span className="flex items-center gap-1">
              <UserX className="h-3.5 w-3.5 text-red-600" />
              <span>Block this student seller from contacting you</span>
            </span>
          </label>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-xs"
            >
              Submit Report to Campus Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
