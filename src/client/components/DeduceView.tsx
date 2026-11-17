import React, { useState } from 'react';
import type { PublicCaseData, PlayerProgress } from '../../shared/types';
import {
  Send,
  AlertCircle,
  FileText,
  Loader2,
  CheckCircle,
  X,
  Compass,
} from 'lucide-react';

type DeduceViewProps = {
  caseData: PublicCaseData;
  progress: PlayerProgress | null;
  onSubmit: (theory: string) => Promise<boolean>;
  onGoToScene: () => void;
  onGoToBoard: () => void;
  isDeducing: boolean;
  error: string | null;
};

export const DeduceView: React.FC<DeduceViewProps> = ({
  caseData,
  progress,
  onSubmit,
  onGoToScene,
  onGoToBoard,
  isDeducing,
  error,
}) => {
  const [theoryText, setTheoryText] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);

  const discovered = progress?.discoveredEvidence ?? [];
  const charCount = theoryText.trim().length;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (charCount < 15) {
      setInputError('Please provide a more detailed theory (minimum 15 characters).');
      return;
    }
    setInputError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmModal(false);
    await onSubmit(theoryText.trim());
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Dossier Deduction Card */}
      <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#25272B] px-5 py-3 border-b border-[#33363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5A45B]" />
            <span className="text-[11px] font-mono tracking-widest text-[#D5A45B] uppercase font-bold">
              Final Forensic Theory Submission
            </span>
          </div>
          <span className="text-xs font-mono text-[#9C9B98]">
            {caseData.caseNumber}
          </span>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Question Prompt */}
          <div className="space-y-2 border-b border-[#33363D]/80 pb-4">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8]">
              What really happened?
            </h1>
            <p className="text-sm text-[#9C9B98]">
              Explain your theory using the evidence you discovered. Describe who was involved, what transpired, and how the clues connect.
            </p>
          </div>

          {/* Quick Evidence Reference Box */}
          <div className="bg-[#101114] p-3.5 rounded border border-[#33363D] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono uppercase text-[#D5A45B] font-bold">
                Your Discovered Clues ({discovered.length}/3)
              </span>
              <button
                type="button"
                onClick={onGoToBoard}
                className="text-[11px] text-[#9C9B98] hover:text-[#F2EFE8] underline cursor-pointer"
              >
                View on Evidence Board
              </button>
            </div>
            {discovered.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {discovered.map((clue, idx) => (
                  <span
                    key={clue.objectId}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#25272B] text-[#F2EFE8] px-2 py-1 rounded border border-[#33363D]"
                  >
                    <CheckCircle className="w-3 h-3 text-[#78A88F]" />
                    <strong className="text-[#D5A45B]">#{idx + 1}</strong> {clue.title}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#9C9B98] italic">
                You haven't inspected any clues yet.{' '}
                <button
                  onClick={onGoToScene}
                  className="text-[#D5A45B] hover:underline font-medium"
                >
                  Visit the Crime Scene first
                </button>
                .
              </p>
            )}
          </div>

          {/* Theory Form */}
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="deduction-input"
                className="block text-xs font-mono uppercase tracking-wider text-[#F2EFE8] font-semibold"
              >
                Investigator's Formal Theory
              </label>
              <textarea
                id="deduction-input"
                rows={6}
                value={theoryText}
                onChange={(e) => {
                  setTheoryText(e.target.value);
                  if (inputError) setInputError(null);
                }}
                disabled={isDeducing}
                placeholder="Example: Attendant Daniel was facing heavy financial debts and staged his disappearance. He arranged for trainee Miller to wear his uniform as a decoy on CCTV, while Daniel secretly escaped on the 11:15 freight train..."
                className="w-full bg-[#101114] border border-[#33363D] focus:border-[#D5A45B] rounded p-3.5 text-sm text-[#F2EFE8] placeholder-[#9C9B98]/50 focus:outline-none transition-colors leading-relaxed font-sans resize-y"
              />
              <div className="flex items-center justify-between text-xs text-[#9C9B98]">
                <span>Natural language semantic evaluation. Explain the sequence of events.</span>
                <span
                  className={`font-mono ${
                    charCount < 15
                      ? 'text-[#9C9B98]'
                      : charCount > 900
                        ? 'text-[#A94E4E]'
                        : 'text-[#78A88F]'
                  }`}
                >
                  {charCount} / 1000 characters
                </span>
              </div>
            </div>

            {/* Error alerts */}
            {(inputError || error) && (
              <div className="bg-[#A94E4E]/15 border border-[#A94E4E]/40 text-[#F2EFE8] p-3 rounded text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#A94E4E] shrink-0" />
                <span>{inputError || error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isDeducing || charCount < 15}
                className="w-full sm:flex-1 bg-[#D5A45B] hover:bg-[#B88942] disabled:opacity-50 disabled:cursor-not-allowed text-[#101114] font-bold py-3.5 px-6 rounded flex items-center justify-center gap-2 text-sm cursor-pointer transition-all shadow-lg select-none"
              >
                {isDeducing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Forensic Theory...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Final Deduction</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onGoToScene}
                disabled={isDeducing}
                className="w-full sm:w-auto bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-3.5 px-5 rounded text-xs font-medium border border-[#33363D] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Check Scene Clues</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1A1C20] border border-[#D5A45B] rounded-lg max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-scale-up">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 text-[#D5A45B]">
                <FileText className="w-5 h-5" />
                <h3 className="font-serif font-bold text-lg text-[#F2EFE8]">
                  Confirm Final Deduction
                </h3>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-[#9C9B98] hover:text-[#F2EFE8] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#F2EFE8]/90 leading-relaxed">
              Are you ready to submit your theory for evaluation?
            </p>

            <div className="bg-[#101114] p-3 rounded border border-[#33363D] text-xs text-[#9C9B98] space-y-1">
              <p>
                <strong className="text-[#D5A45B]">Important:</strong> Each detective receives only <strong>one final deduction</strong> per daily case.
              </p>
              <p>
                Your written theory will be evaluated by the forensic engine across Conclusion Accuracy, Evidence Usage, and Logical Reasoning.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-2.5 px-4 rounded text-xs font-semibold border border-[#33363D] cursor-pointer transition-colors"
              >
                Revise Theory
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                className="flex-1 bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] py-2.5 px-4 rounded text-xs font-bold cursor-pointer transition-colors shadow"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
