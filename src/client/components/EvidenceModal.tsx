import React from 'react';
import type { ClueEvidence } from '../../shared/types';
import { ClueVisual } from './ClueVisual';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

type EvidenceModalProps = {
  clue: ClueEvidence | null;
  onClose: () => void;
  onGoToBoard?: () => void;
  remainingInspections: number;
};

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  clue,
  onClose,
  onGoToBoard,
  remainingInspections,
}) => {
  if (!clue) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-[#1A1C20] border border-[#D5A45B]/60 rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-modal-title"
      >
        {/* Header Ribbon */}
        <div className="bg-[#25272B] px-5 py-3 border-b border-[#33363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#78A88F]" />
            <span className="text-[11px] font-mono tracking-widest text-[#D5A45B] uppercase font-bold">
              Evidence Log #{clue.objectId}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9C9B98] hover:text-[#F2EFE8] transition-colors p-1 rounded hover:bg-[#33363D] cursor-pointer"
            aria-label="Close evidence panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#101114] p-4 rounded border border-[#33363D]">
            <div className="shrink-0 bg-[#1A1C20] p-2 rounded border border-[#33363D]">
              <ClueVisual type={clue.visualType} className="w-20 h-20" />
            </div>
            <div>
              <h3
                id="evidence-modal-title"
                className="text-lg font-serif font-bold text-[#F2EFE8]"
              >
                {clue.title}
              </h3>
              <p className="text-xs text-[#9C9B98] mt-1 font-mono uppercase">
                Forensic Classification: {clue.visualType.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Detailed Forensic Discovery */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#D5A45B] font-semibold">
              Discovered Detail
            </span>
            <p className="text-sm text-[#F2EFE8] leading-relaxed bg-[#25272B] p-3.5 rounded border border-[#33363D]">
              {clue.evidenceText}
            </p>
          </div>

          {/* Forensic Deductive Observation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#78A88F] font-semibold">
              Detective Observation
            </span>
            <p className="text-xs text-[#9C9B98] italic bg-[#101114] p-3 rounded border border-[#33363D]">
              "{clue.detailedObservation}"
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-between text-xs text-[#78A88F] pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Added to Evidence Board</span>
            </div>
            <span className="text-[#9C9B98] font-mono">
              Remaining Inspections: <strong className="text-[#D5A45B]">{remainingInspections}/3</strong>
            </span>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-2.5 px-4 rounded text-xs font-semibold cursor-pointer transition-colors border border-[#33363D]"
            >
              Continue Inspecting Scene
            </button>
            {onGoToBoard && (
              <button
                onClick={() => {
                  onClose();
                  onGoToBoard();
                }}
                className="bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] py-2.5 px-4 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>Evidence Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
