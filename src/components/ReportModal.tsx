'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { Listing, Report } from '@/lib/types';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  ShieldAlert,
  AlertTriangle,
  UserX,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing | null;
  onSuccess: () => void;
}

const REPORT_REASONS: { key: Report['reason']; label: string; desc: string }[] = [
  { key: 'SCAM', label: 'Suspected Scam or Advance Payment Request', desc: 'Seller asking for money before meeting on campus' },
  { key: 'WRONG_PRODUCT', label: 'Misleading Listing or Wrong Edition', desc: 'Item does not match photo, damage hidden, or edition differs' },
  { key: 'MISLEADING_PRICE', label: 'Bait-and-Switch Pricing', desc: 'Price listed differs from chat agreement' },
  { key: 'FAKE_IDENTITY', label: 'Fake Identity / Non-College Student', desc: 'Person does not belong to this campus community' },
  { key: 'PROHIBITED', label: 'Prohibited or Non-Academic Item', desc: 'Commercial listing or prohibited campus goods' },
  { key: 'OFFENSIVE', label: 'Harassment or Inappropriate Content', desc: 'Disrespectful messages or inappropriate behavior' },
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
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Report Listing / User"
      subtitle="Campus Trust & Safety Moderation"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200">
          <ShieldAlert className="h-5 w-5" />
        </div>
      }
      maxWidth="lg"
      headerBg="bg-red-50/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-600 flex items-center gap-2">
          <Lock className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Your report is 100% confidential. The seller will not be notified of your identity.</span>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-800 block">Select Reason:</label>
          {REPORT_REASONS.map((r) => (
            <label
              key={r.key}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                selectedReason === r.key
                  ? 'border-red-300 bg-red-50/40 shadow-2xs'
                  : 'border-zinc-200/80 bg-white hover:bg-zinc-50'
              }`}
            >
              <input
                type="radio"
                name="report_reason"
                checked={selectedReason === r.key}
                onChange={() => setSelectedReason(r.key)}
                className="mt-0.5 text-red-600"
              />
              <div className="text-xs">
                <span className="font-bold text-zinc-900 block">{r.label}</span>
                <span className="text-[11px] text-zinc-500">{r.desc}</span>
              </div>
            </label>
          ))}
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-800 block mb-1">Additional Context (Optional)</label>
          <textarea
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Help campus moderators understand what occurred."
            className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 focus:border-red-600 focus:outline-hidden"
          />
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-zinc-700 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={alsoBlockUser}
            onChange={(e) => setAlsoBlockUser(e.target.checked)}
            className="rounded text-red-600"
          />
          <span>Block this user from messaging me or viewing my listings</span>
        </label>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-xs"
          >
            Submit Confidential Report
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};
