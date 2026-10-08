'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import {
  School,
  Mail,
  User,
  GraduationCap,
  Calendar,
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
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Verified Student Profile"
      subtitle="30-second campus onboarding • Safe student-only marketplace"
      icon={
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="h-5 w-5" />
        </div>
      }
      badge={
        <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
          Step {step} of 2
        </span>
      }
      maxWidth="md"
    >
      <form onSubmit={handleFinish} className="space-y-4">
        {step === 1 ? (
          <div className="space-y-4 animate-modal-in">
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1.5 block">Select Your Campus</label>
              <div className="space-y-2">
                {campuses.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCampusId(c.id);
                      setCampus(c);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between ${
                      selectedCampusId === c.id
                        ? 'border-emerald-600 bg-emerald-50/70 font-bold ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <School className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {selectedCampusId === c.id && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Campus Email Address</label>
              <input
                type="email"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                placeholder={`yourname@${campus.domainSuffix}`}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Must end with @{campus.domainSuffix} for student verification.
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full mt-2 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-modal-in">
            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-800 mb-1 block">Degree / Major</label>
              <input
                type="text"
                value={degreeProgram}
                onChange={(e) => setDegreeProgram(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs text-zinc-900 focus:border-emerald-600 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">Academic Year</label>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs"
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">Current Semester</label>
                <select
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!fullName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white shadow-xs"
              >
                Activate Campus Account
              </button>
            </div>
          </div>
        )}
      </form>
    </ModalWrapper>
  );
};
