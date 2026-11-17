import React, { useState } from 'react';
import type { PublicCaseData, PlayerProgress, PlayerStats } from '../../shared/types';
import {
  Trophy,
  Flame,
  CheckCircle,
  AlertCircle,
  Share2,
  Lock,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { showToast } from '@devvit/web/client';

type VerdictViewProps = {
  caseData: PublicCaseData;
  progress: PlayerProgress | null;
  playerStats: PlayerStats | null;
  onViewBoard: () => void;
  onViewLeaderboard: () => void;
};

export const VerdictView: React.FC<VerdictViewProps> = ({
  caseData,
  progress,
  playerStats,
  onViewBoard,
  onViewLeaderboard,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const evaluation = progress?.evaluation;
  if (!evaluation) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-serif text-[#F2EFE8]">No Evaluation Record Found</h2>
        <p className="text-xs text-[#9C9B98]">Complete your investigation and submit a theory to view results.</p>
        <button
          onClick={onViewBoard}
          className="bg-[#D5A45B] text-[#101114] text-xs font-bold px-4 py-2 rounded"
        >
          View Evidence Board
        </button>
      </div>
    );
  }

  const score = evaluation.score;

  // Detective Rank calculation
  const getRank = (sc: number): { title: string; color: string } => {
    if (sc >= 85) return { title: 'Senior Detective Inspector', color: '#D5A45B' };
    if (sc >= 70) return { title: 'Lead Investigator', color: '#78A88F' };
    if (sc >= 50) return { title: 'Junior Detective', color: '#9C9B98' };
    return { title: 'Forensic Cadet', color: '#A94E4E' };
  };

  const rank = getRank(score);

  const verdictLabel =
    evaluation.verdict === 'correct'
      ? 'Case Solved'
      : evaluation.verdict === 'mostly_correct'
        ? 'Mostly Solved'
        : evaluation.verdict === 'partially_correct'
          ? 'Partial Deductions'
          : 'Case Unsolved';

  const verdictColor =
    evaluation.verdict === 'correct' || evaluation.verdict === 'mostly_correct'
      ? 'text-[#78A88F] bg-[#78A88F]/15 border-[#78A88F]/40'
      : evaluation.verdict === 'partially_correct'
        ? 'text-[#D5A45B] bg-[#D5A45B]/15 border-[#D5A45B]/40'
        : 'text-[#A94E4E] bg-[#A94E4E]/15 border-[#A94E4E]/40';

  const handleShare = async () => {
    const shareText = `THE UNSEEN — ${caseData.caseNumber}
Verdict: ${verdictLabel} (${score}/100) 🔍
Rank: ${rank.title} 🎖️
Streak: ${playerStats?.currentStreak ?? 1} Days 🔥
Can you see the truth?`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
        showToast('Spoiler-free result copied to clipboard!');
      }
    } catch {
      showToast('Result ready to share!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Cinematic Verdict Banner */}
      <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg shadow-2xl overflow-hidden">
        {/* Ribbon */}
        <div className="bg-[#25272B] px-5 py-3 border-b border-[#33363D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#D5A45B]" />
            <span className="text-[11px] font-mono tracking-widest text-[#D5A45B] uppercase font-bold">
              Forensic Evaluation Verdict
            </span>
          </div>
          <span className="text-xs font-mono text-[#9C9B98]">
            {caseData.caseNumber}
          </span>
        </div>

        <div className="p-5 sm:p-8 space-y-6 text-center sm:text-left">
          {/* Main Score & Rank Display */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-[#33363D]/80">
            <div>
              <span className={`inline-block text-xs font-mono uppercase px-3 py-1 rounded-full border font-bold ${verdictColor}`}>
                {verdictLabel}
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#F2EFE8] mt-2">
                {caseData.title}
              </h1>
              <p className="text-xs font-mono text-[#D5A45B] mt-1 tracking-wider uppercase font-semibold">
                RANK: {rank.title}
              </p>
            </div>

            {/* Score Ring */}
            <div className="relative flex items-center justify-center shrink-0">
              <div className="w-24 h-24 rounded-full border-4 border-[#33363D] flex flex-col items-center justify-center bg-[#101114]">
                <span className="text-3xl font-serif font-bold text-[#D5A45B] leading-none">
                  {score}
                </span>
                <span className="text-[10px] font-mono text-[#9C9B98] uppercase">
                  / 100 PTS
                </span>
              </div>
            </div>
          </div>

          {/* 3 Dimension Scoring Bars */}
          <div className="space-y-3 bg-[#101114] p-4 rounded-lg border border-[#33363D]">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#D5A45B] font-bold text-left">
              Evaluation Dimensions
            </h2>

            <div className="space-y-3 pt-1">
              {/* Conclusion Accuracy */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#F2EFE8] font-medium">Conclusion Accuracy</span>
                  <span className="font-mono text-[#D5A45B] font-bold">
                    {evaluation.conclusionScore} / 40
                  </span>
                </div>
                <div className="w-full bg-[#25272B] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D5A45B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evaluation.conclusionScore / 40) * 100}%` }}
                  />
                </div>
              </div>

              {/* Evidence Usage */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#F2EFE8] font-medium">Evidence Usage</span>
                  <span className="font-mono text-[#78A88F] font-bold">
                    {evaluation.evidenceScore} / 35
                  </span>
                </div>
                <div className="w-full bg-[#25272B] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#78A88F] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evaluation.evidenceScore / 35) * 100}%` }}
                  />
                </div>
              </div>

              {/* Logical Reasoning */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#F2EFE8] font-medium">Logical Reasoning</span>
                  <span className="font-mono text-[#F2EFE8] font-bold">
                    {evaluation.reasoningScore} / 25
                  </span>
                </div>
                <div className="w-full bg-[#25272B] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#F2EFE8] h-full rounded-full transition-all duration-500"
                    style={{ width: `${(evaluation.reasoningScore / 25) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning & Forensic Feedback */}
          <div className="space-y-2 text-left">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#9C9B98] font-semibold">
              Forensic Examiner Notes
            </h3>
            <p className="text-sm text-[#F2EFE8] bg-[#25272B] p-4 rounded border border-[#33363D] leading-relaxed">
              {evaluation.feedback}
            </p>
          </div>

          {/* Matched vs Missing Facts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {/* Matched Facts */}
            <div className="bg-[#101114] p-3.5 rounded border border-[#33363D] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#78A88F] font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Facts Identified ({evaluation.matchedFacts.length})</span>
              </span>
              <ul className="text-xs text-[#9C9B98] space-y-1.5">
                {evaluation.matchedFacts.length > 0 ? (
                  evaluation.matchedFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#78A88F] mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))
                ) : (
                  <li className="italic text-[#9C9B98]/60">None of the core facts were identified.</li>
                )}
              </ul>
            </div>

            {/* Missing Facts */}
            <div className="bg-[#101114] p-3.5 rounded border border-[#33363D] space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#D5A45B] font-bold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Key Details Missed ({evaluation.missingFacts.length})</span>
              </span>
              <ul className="text-xs text-[#9C9B98] space-y-1.5">
                {evaluation.missingFacts.length > 0 ? (
                  evaluation.missingFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#D5A45B] mt-0.5">•</span>
                      <span>{fact}</span>
                    </li>
                  ))
                ) : (
                  <li className="italic text-[#78A88F]">All critical case details were identified!</li>
                )}
              </ul>
            </div>
          </div>

          {/* Official Canonical Solution Reveal Section */}
          <div className="border-t border-[#33363D] pt-4 text-left">
            {caseData.isRevealed && caseData.officialSolution ? (
              <div className="bg-[#1A2E22]/30 border border-[#78A88F]/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-[#78A88F]">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase font-bold tracking-wider">
                    Official Canonical Solution (Publicly Revealed)
                  </span>
                </div>
                <p className="text-sm text-[#F2EFE8] leading-relaxed">
                  {caseData.officialSolution}
                </p>
                {caseData.officialExplanation && (
                  <div className="pt-2 border-t border-[#78A88F]/30 text-xs text-[#9C9B98] italic">
                    {caseData.officialExplanation}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#101114] border border-[#33363D] p-4 rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#25272B] border border-[#33363D] flex items-center justify-center text-[#D5A45B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase font-bold text-[#F2EFE8] block">
                      Canonical Solution Locked
                    </span>
                    <span className="text-xs text-[#9C9B98]">
                      Full solution unlocks 24h after publication to preserve community mystery.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#D5A45B] font-mono shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reveal Scheduled</span>
                </div>
              </div>
            )}
          </div>

          {/* Streak & Player Stats Banner */}
          {playerStats && (
            <div className="flex items-center justify-between bg-[#25272B] p-3.5 rounded border border-[#33363D] text-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D5A45B]" />
                <span className="text-[#9C9B98]">Current Streak:</span>
                <strong className="text-[#F2EFE8] font-bold">{playerStats.currentStreak} Days</strong>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#D5A45B]" />
                <span className="text-[#9C9B98]">Avg Score:</span>
                <strong className="text-[#F2EFE8] font-bold">{playerStats.averageScore} / 100</strong>
              </div>
            </div>
          )}

          {/* Social Share & Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShare}
              className="flex-1 bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] font-bold py-3 px-4 rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Copied to Clipboard!' : 'Share Spoiler-Free Result'}</span>
            </button>

            <button
              onClick={onViewLeaderboard}
              className="bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-3 px-5 rounded text-xs font-medium border border-[#33363D] cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-[#D5A45B]" />
              <span>View Leaderboard</span>
            </button>

            <button
              onClick={onViewBoard}
              className="bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] py-3 px-4 rounded text-xs font-medium border border-[#33363D] cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Evidence</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#9C9B98] flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#D5A45B]" />
              <span>Discuss theories with fellow detectives in the Reddit post comments below.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
