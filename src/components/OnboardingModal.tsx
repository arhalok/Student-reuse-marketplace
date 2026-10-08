'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import {
  School,
  Mail,
  User,
  GraduationCap,
  Calendar,
  X,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { campuses, currentCampus, setCampus, onboardStudent } = useMarketplace();

  const [step, setStep] = useState<number>(1);
  const [selectedCampusId, setSelectedCampusId] = useState(currentCampus.id);
  const [collegeEmail, setCollegeEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('B.Tech Computer Science');
  const [currentYear, setCurrentYear] = useState<number>(1);
  const [currentSemester, setCurrentSemester] = useState<number>(2);

  if (!isOpen) return null;

  const campus = campuses.find((c) => c.id === selectedCampusId) || currentCampus;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    onboardStudent({
      campusId: campus.id,
      fullName,
      collegeEmail: collegeEmail || `${fullName.toLowerCase().replace(/\s+/g, '.')}@${campus.domainSuffix}`,
      degreeProgram,
      currentYear,
      currentSemester,
    });

    onSuccess(fullName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-zinc-200 my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-zinc-900 text-base">Campus Student Onboarding</h2>
              <p className="text-xs text-zinc-500">Fast 30-second setup. Less friction, high trust.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="bg-zinc-50 px-6 py-2 border-b border-zinc-100 flex items-center justify-between text-[11px] font-semibold text-zinc-500">
          <span>Step {step} of 2</span>
          <span>{step === 1 ? 'College & Email Verification' : 'Academic Profile'}</span>
        </div>

        {/* Content */}
        <form onSubmit={handleFinish} className="p-6 space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <School className="h-3.5 w-3.5 text-emerald-600" />
                  Choose Your College / Campus *
                </label>
                <select
                  value={selectedCampusId}
                  onChange={(e) => {
                    setSelectedCampusId(e.target.value);
                    const c = campuses.find((item) => item.id === e.target.value);
                    if (c) setCampus(c);
                  }}
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-xs text-zinc-900 font-medium focus:border-emerald-600 focus:outline-hidden"
                >
                  {campuses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-emerald-600" />
                  College Email (Instant Verification)
                </label>
                <input
                  type="email"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  placeholder={`e.g. rahul.cs24@${campus.domainSuffix}`}
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
                <p className="mt-1 text-[11px] text-zinc-500">
                  Enables the <strong>✓ Verified Student</strong> trust badge for peer buyers &amp; sellers.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <span>Next: Academic Info</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-emerald-600" />
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ananya Sen"
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-emerald-600" />
                  Course / Degree Program
                </label>
                <input
                  type="text"
                  value={degreeProgram}
                  onChange={(e) => setDegreeProgram(e.target.value)}
                  placeholder="e.g. B.Tech Mechanical Engineering"
                  className="w-full rounded-xl border border-zinc-300 px-3.5 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Current Year
                  </label>
                  <select
                    value={currentYear}
                    onChange={(e) => setCurrentYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Current Semester
                  </label>
                  <select
                    value={currentSemester}
                    onChange={(e) => setCurrentSemester(Number(e.target.value))}
                    className="w-full rounded-xl border border-zinc-300 px-3 py-2 text-xs text-zinc-900 focus:border-emerald-600 focus:outline-hidden"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-800"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-200"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Join Campus Marketplace</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
