import React from 'react';
import type { PublicCaseData, PlayerProgress, ClueEvidence } from '../../shared/types';
import { ClueVisual } from './ClueVisual';
import { ArrowRight, Lock, Eye, Compass, HelpCircle } from 'lucide-react';

type BoardViewProps = {
  caseData: PublicCaseData;
  progress: PlayerProgress | null;
  onSelectClue: (clue: ClueEvidence) => void;
  onGoToScene: () => void;
  onGoToDeduce: () => void;
};

export const BoardView: React.FC<BoardViewProps> = ({
  caseData,
  progress,
  onSelectClue,
  onGoToScene,
  onGoToDeduce,
}) => {
  const discovered = progress?.discoveredEvidence ?? [];
  const remaining = progress?.remainingInspections ?? 3;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in">
      {/* Evidence Board Banner */}
      <div className="bg-[#1A1C20] border border-[#33363D] p-4 sm:p-6 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5A45B]" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#D5A45B] font-bold">
              Detective Evidence Corkboard
            </h2>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8] mt-1">
            {caseData.caseNumber}: Evidence File
          </h1>
          <p className="text-xs text-[#9C9B98] mt-1">
            Revisit your discovered clues at no cost. You have collected{' '}
            <strong className="text-[#F2EFE8]">{discovered.length}</strong> clues. Remaining inspections:{' '}
            <strong className="text-[#D5A45B]">{remaining}/3</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {remaining > 0 && (
            <button
              onClick={onGoToScene}
              className="flex-1 sm:flex-none bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] px-4 py-2.5 rounded text-xs font-medium border border-[#33363D] cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#D5A45B]" />
              <span>Back to Scene</span>
            </button>
          )}

          <button
            onClick={onGoToDeduce}
            className="flex-1 sm:flex-none bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] px-5 py-2.5 rounded text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Draft Theory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Discovered Clues Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {discovered.map((clue, index) => (
          <div
            key={clue.objectId}
            onClick={() => onSelectClue(clue)}
            className="group bg-[#1A1C20] hover:bg-[#202227] border border-[#33363D] hover:border-[#D5A45B]/60 rounded-lg p-5 flex flex-col justify-between transition-all cursor-pointer shadow-lg hover:shadow-xl relative overflow-hidden"
          >
            {/* Top Tape Aesthetic */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 bg-[#33363D]/60 rounded-b" />

            <div>
              <div className="flex items-center justify-between text-xs text-[#9C9B98] pb-3 border-b border-[#33363D]">
                <span className="font-mono font-bold text-[#D5A45B]">
                  CLUE #{index + 1}
                </span>
                <span className="text-[10px] font-mono uppercase bg-[#25272B] px-1.5 py-0.5 rounded border border-[#33363D]">
                  {clue.visualType}
                </span>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="shrink-0 bg-[#101114] p-2 rounded border border-[#33363D] group-hover:border-[#D5A45B]/40 transition-colors">
                  <ClueVisual type={clue.visualType} className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#F2EFE8] group-hover:text-[#D5A45B] transition-colors leading-snug">
                    {clue.title}
                  </h3>
                  <span className="text-[10px] font-mono text-[#9C9B98] uppercase">
                    ID: {clue.objectId}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#F2EFE8]/80 line-clamp-3 leading-relaxed">
                {clue.evidenceText}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#33363D]/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#78A88F] italic truncate max-w-[200px]">
                "{clue.detailedObservation.slice(0, 45)}..."
              </span>
              <span className="flex items-center gap-1 text-[#D5A45B] font-medium text-[11px] group-hover:translate-x-0.5 transition-transform">
                <Eye className="w-3.5 h-3.5" />
                <span>Examine</span>
              </span>
            </div>
          </div>
        ))}

        {/* Empty / Uninspected Slots */}
        {Array.from({ length: Math.max(0, 3 - discovered.length) }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            onClick={remaining > 0 ? onGoToScene : undefined}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all min-h-[220px] ${
              remaining > 0
                ? 'border-[#33363D] bg-[#1A1C20]/30 hover:border-[#D5A45B]/50 hover:bg-[#1A1C20]/60 cursor-pointer'
                : 'border-[#25272B] bg-[#101114]/50 opacity-50 cursor-not-allowed'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-[#1A1C20] border border-[#33363D] flex items-center justify-center text-[#9C9B98] mb-3">
              {remaining > 0 ? (
                <HelpCircle className="w-5 h-5 text-[#D5A45B]" />
              ) : (
                <Lock className="w-5 h-5 text-[#9C9B98]" />
              )}
            </div>
            <h4 className="font-serif font-bold text-sm text-[#F2EFE8]">
              {remaining > 0 ? 'Uninspected Clue Slot' : 'Locked Slot'}
            </h4>
            <p className="text-xs text-[#9C9B98] mt-1 max-w-[220px]">
              {remaining > 0
                ? `You have ${remaining} inspection${remaining > 1 ? 's' : ''} left. Tap to investigate the crime scene.`
                : 'You have used all 3 available inspections.'}
            </p>
            {remaining > 0 && (
              <span className="inline-block mt-3 text-xs font-semibold text-[#D5A45B]">
                + Inspect Object in Scene
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Case Objective Reminder */}
      <div className="bg-[#25272B] border-l-4 border-[#D5A45B] p-4 rounded-r-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#D5A45B] font-bold">
            Investigation Objective
          </span>
          <p className="text-xs sm:text-sm text-[#F2EFE8] mt-0.5">
            {caseData.objective}
          </p>
        </div>
        <button
          onClick={onGoToDeduce}
          className="shrink-0 bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] text-xs font-bold py-2 px-4 rounded transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Submit Final Theory</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
