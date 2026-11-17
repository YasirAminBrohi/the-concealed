import React from 'react';
import type { GameView } from '../hooks/useDetectiveGame';
import type { PublicCaseData, PlayerProgress } from '../../shared/types';
import { Search, Compass, BookOpen, Edit3, Award, Shield } from 'lucide-react';

type HeaderProps = {
  currentView: GameView;
  setCurrentView: (view: GameView) => void;
  caseData: PublicCaseData | null;
  progress: PlayerProgress | null;
  isModerator: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  caseData,
  progress,
  isModerator,
}) => {
  const remaining = progress?.remainingInspections ?? 3;
  const discoveredCount = progress?.discoveredEvidence.length ?? 0;

  return (
    <header className="sticky top-0 z-40 bg-[#101114]/95 backdrop-blur border-b border-[#33363D] px-3 py-2.5 sm:px-6 sm:py-3 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        {/* Brand & Active Case Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div
            onClick={() => setCurrentView('briefing')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-8 h-8 rounded bg-[#1A1C20] border border-[#D5A45B]/60 flex items-center justify-center text-[#D5A45B] group-hover:border-[#D5A45B] transition-colors">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-widest text-xs uppercase text-[#D5A45B] font-bold">
                  THE UNSEEN
                </span>
                <span className="text-[10px] bg-[#25272B] text-[#9C9B98] px-1.5 py-0.2 rounded border border-[#33363D]">
                  DAILY
                </span>
              </div>
              <p className="text-xs text-[#F2EFE8] font-medium leading-none mt-0.5 truncate max-w-[200px]">
                {caseData ? `${caseData.caseNumber}: ${caseData.title}` : 'Loading case...'}
              </p>
            </div>
          </div>

          {/* Remaining Inspections Badge (Mobile/Desktop) */}
          <div className="flex items-center gap-1.5 bg-[#1A1C20] border border-[#33363D] px-2.5 py-1 rounded-full text-xs">
            <span className="text-[#9C9B98]">Inspections:</span>
            <span
              className={`font-mono font-bold ${
                remaining > 0 ? 'text-[#D5A45B]' : 'text-[#A94E4E]'
              }`}
            >
              {remaining}/3
            </span>
            <div className="flex gap-0.5 ml-1">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx < remaining ? 'bg-[#D5A45B]' : 'bg-[#33363D]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-0.5 text-xs">
          <button
            onClick={() => setCurrentView('briefing')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'briefing'
                ? 'bg-[#25272B] text-[#D5A45B] border border-[#D5A45B]/40 font-semibold'
                : 'text-[#9C9B98] hover:text-[#F2EFE8] hover:bg-[#1A1C20]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Briefing</span>
          </button>

          <button
            onClick={() => setCurrentView('scene')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'scene'
                ? 'bg-[#25272B] text-[#D5A45B] border border-[#D5A45B]/40 font-semibold'
                : 'text-[#9C9B98] hover:text-[#F2EFE8] hover:bg-[#1A1C20]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Scene</span>
          </button>

          <button
            onClick={() => setCurrentView('board')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer relative ${
              currentView === 'board'
                ? 'bg-[#25272B] text-[#D5A45B] border border-[#D5A45B]/40 font-semibold'
                : 'text-[#9C9B98] hover:text-[#F2EFE8] hover:bg-[#1A1C20]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Board</span>
            {discoveredCount > 0 && (
              <span className="bg-[#D5A45B] text-[#101114] text-[10px] font-bold px-1 rounded-full leading-tight">
                {discoveredCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentView('deduce')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'deduce'
                ? 'bg-[#25272B] text-[#D5A45B] border border-[#D5A45B]/40 font-semibold'
                : 'text-[#9C9B98] hover:text-[#F2EFE8] hover:bg-[#1A1C20]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Deduce</span>
          </button>

          <button
            onClick={() => setCurrentView('leaderboard')}
            className={`px-2.5 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer ${
              currentView === 'leaderboard'
                ? 'bg-[#25272B] text-[#D5A45B] border border-[#D5A45B]/40 font-semibold'
                : 'text-[#9C9B98] hover:text-[#F2EFE8] hover:bg-[#1A1C20]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Ranks</span>
          </button>

          {isModerator && (
            <button
              onClick={() => setCurrentView('admin')}
              className={`px-2 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-[#A94E4E]/30 text-[#A94E4E] border border-[#A94E4E]/50 font-semibold'
                  : 'text-[#9C9B98] hover:text-[#A94E4E]'
              }`}
              title="Moderator Case Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
