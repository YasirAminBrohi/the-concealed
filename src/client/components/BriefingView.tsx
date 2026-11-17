import React from 'react';
import type { PublicCaseData, PlayerProgress, PlayerStats } from '../../shared/types';
import { MapPin, Clock, Calendar, AlertTriangle, ArrowRight, Flame, Trophy } from 'lucide-react';

type BriefingViewProps = {
  caseData: PublicCaseData;
  progress: PlayerProgress | null;
  playerStats: PlayerStats | null;
  onStart: () => void;
  onViewBoard: () => void;
};

export const BriefingView: React.FC<BriefingViewProps> = ({
  caseData,
  progress,
  playerStats,
  onStart,
  onViewBoard,
}) => {
  const isStarted = (progress?.inspectedObjectIds.length ?? 0) > 0;
  const isSubmitted = progress?.isSubmitted ?? false;

  const difficultyColor =
    caseData.difficulty === 'Easy'
      ? 'text-[#78A88F] border-[#78A88F]/40 bg-[#78A88F]/10'
      : caseData.difficulty === 'Medium'
        ? 'text-[#D5A45B] border-[#D5A45B]/40 bg-[#D5A45B]/10'
        : 'text-[#A94E4E] border-[#A94E4E]/40 bg-[#A94E4E]/10';

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10 animate-fade-in">
      {/* Dossier Container */}
      <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg shadow-2xl overflow-hidden relative">
        {/* Top Confidential Tape Aesthetic */}
        <div className="bg-[#25272B] px-5 py-2.5 border-b border-[#33363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D5A45B] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#D5A45B] uppercase font-bold">
              Official Police Case Dossier
            </span>
          </div>
          <span className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded border ${difficultyColor}`}>
            Difficulty: {caseData.difficulty}
          </span>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          {/* Mystery Title Header */}
          <div className="border-b border-[#33363D]/80 pb-5">
            <span className="text-xs font-mono tracking-wider text-[#9C9B98] uppercase">
              {caseData.caseNumber}
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F2EFE8] mt-1 tracking-tight">
              {caseData.title}
            </h1>

            {/* Metadata Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 text-xs text-[#9C9B98]">
              <div className="flex items-center gap-2 bg-[#25272B] px-3 py-2 rounded border border-[#33363D]">
                <MapPin className="w-4 h-4 text-[#D5A45B] shrink-0" />
                <span className="truncate">{caseData.location}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#25272B] px-3 py-2 rounded border border-[#33363D]">
                <Clock className="w-4 h-4 text-[#D5A45B] shrink-0" />
                <span>Time: {caseData.incidentTime}</span>
              </div>
              <div className="flex items-center gap-2 bg-[#25272B] px-3 py-2 rounded border border-[#33363D]">
                <Calendar className="w-4 h-4 text-[#D5A45B] shrink-0" />
                <span>{caseData.incidentDate}</span>
              </div>
            </div>
          </div>

          {/* Narrative Premise */}
          <div className="space-y-3">
            <h2 className="text-xs uppercase font-mono tracking-wider text-[#D5A45B]">
              Incident Summary
            </h2>
            <p className="text-sm sm:text-base text-[#F2EFE8]/90 leading-relaxed font-sans">
              {caseData.introduction}
            </p>
          </div>

          {/* Objective Box */}
          <div className="bg-[#25272B] border-l-4 border-[#D5A45B] p-4 rounded-r-md">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#D5A45B] font-bold">
              Investigation Objective
            </h3>
            <p className="text-sm text-[#F2EFE8] mt-1 font-medium">
              {caseData.objective}
            </p>
          </div>

          {/* Investigation Rules Callout */}
          <div className="bg-[#101114] border border-[#33363D] p-3.5 rounded flex items-start gap-3 text-xs text-[#9C9B98]">
            <AlertTriangle className="w-4 h-4 text-[#D5A45B] shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#F2EFE8]">Rule of Evidence:</strong> The crime scene contains 6 inspectable objects, but you are limited to <strong className="text-[#D5A45B]">3 inspections</strong>. Examine clues carefully, connect the dots on your Evidence Board, and submit your theory.
            </p>
          </div>

          {/* Detective Stats Snippet */}
          {playerStats && playerStats.totalPlayed > 0 && (
            <div className="flex items-center justify-between border-t border-[#33363D] pt-4 text-xs text-[#9C9B98]">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#D5A45B]" />
                <span>Current Streak: <strong className="text-[#F2EFE8]">{playerStats.currentStreak} Days</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#D5A45B]" />
                <span>Solved: <strong className="text-[#F2EFE8]">{playerStats.casesSolved} / {playerStats.totalPlayed}</strong></span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onStart}
              className="flex-1 bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] font-bold py-3.5 px-6 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-[#D5A45B]/20 select-none text-sm"
            >
              <span>{isSubmitted ? 'Review Investigation Scene' : isStarted ? 'Resume Investigation' : 'Enter Crime Scene'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isStarted && (
              <button
                onClick={onViewBoard}
                className="bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-3.5 px-6 rounded-md font-medium text-sm transition-colors cursor-pointer border border-[#33363D]"
              >
                Open Evidence Board ({progress?.discoveredEvidence.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
