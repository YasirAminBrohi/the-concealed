import React, { useState, useEffect } from 'react';
import type { LeaderboardEntry, CommunityStats } from '../../shared/types';
import { Trophy, Users, CheckCircle2, TrendingUp, Search, Calendar } from 'lucide-react';

type LeaderboardViewProps = {
  daily: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  communityStats: CommunityStats | null;
  onRefresh: () => void;
};

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  daily,
  allTime,
  communityStats,
  onRefresh,
}) => {
  const [tab, setTab] = useState<'daily' | 'allTime'>('daily');

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const activeList = tab === 'daily' ? daily : allTime;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-[#1A1C20] border border-[#33363D] p-5 sm:p-6 rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#D5A45B]" />
              <span className="text-[11px] font-mono tracking-widest text-[#D5A45B] uppercase font-bold">
                Detective Hall of Fame
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8] mt-1">
              Investigator Leaderboard
            </h1>
            <p className="text-xs text-[#9C9B98] mt-0.5">
              Rankings based on conclusion accuracy, physical evidence usage, and logical deduction.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-[#101114] p-1 rounded border border-[#33363D] w-full sm:w-auto">
            <button
              onClick={() => setTab('daily')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'daily'
                  ? 'bg-[#D5A45B] text-[#101114]'
                  : 'text-[#9C9B98] hover:text-[#F2EFE8]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Mystery</span>
            </button>
            <button
              onClick={() => setTab('allTime')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                tab === 'allTime'
                  ? 'bg-[#D5A45B] text-[#101114]'
                  : 'text-[#9C9B98] hover:text-[#F2EFE8]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>All-Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Community Statistics Bar */}
      {communityStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#1A1C20] border border-[#33363D] p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-[#9C9B98]">
              <Users className="w-3.5 h-3.5 text-[#D5A45B]" />
              <span>Detectives</span>
            </div>
            <p className="text-xl font-serif font-bold text-[#F2EFE8] mt-1">
              {communityStats.totalDetectives}
            </p>
          </div>

          <div className="bg-[#1A1C20] border border-[#33363D] p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-[#78A88F]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved Rate</span>
            </div>
            <p className="text-xl font-serif font-bold text-[#78A88F] mt-1">
              {communityStats.correctPercentage}%
            </p>
          </div>

          <div className="bg-[#1A1C20] border border-[#33363D] p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-[#D5A45B]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Avg Score</span>
            </div>
            <p className="text-xl font-serif font-bold text-[#F2EFE8] mt-1">
              {communityStats.averageScore} / 100
            </p>
          </div>

          <div className="bg-[#1A1C20] border border-[#33363D] p-3.5 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-[#9C9B98]">
              <Search className="w-3.5 h-3.5 text-[#D5A45B]" />
              <span>Key Clue</span>
            </div>
            <p className="text-xs font-medium text-[#F2EFE8] mt-2 truncate" title={communityStats.mostInspectedObject}>
              {communityStats.mostInspectedObject}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#33363D] flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#9C9B98] font-bold">
            {tab === 'daily' ? "Today's Top Forensic Deductions" : 'All-Time Highest Detective Scores'}
          </span>
          <span className="text-xs text-[#9C9B98]">
            Showing top {activeList.length} detectives
          </span>
        </div>

        {activeList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101114] text-[#9C9B98] font-mono uppercase border-b border-[#33363D]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4">Detective</th>
                  <th className="py-3 px-4 text-center">Score</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Conclusion</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Evidence</th>
                  <th className="py-3 px-4 text-center hidden sm:table-cell">Reasoning</th>
                  <th className="py-3 px-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#33363D]/60 text-[#F2EFE8]">
                {activeList.map((entry) => (
                  <tr
                    key={`${entry.username}-${entry.rank}`}
                    className="hover:bg-[#25272B]/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {entry.rank === 1 ? (
                        <span className="text-[#D5A45B]">🥇 1</span>
                      ) : entry.rank === 2 ? (
                        <span className="text-gray-300">🥈 2</span>
                      ) : entry.rank === 3 ? (
                        <span className="text-[#CD7F32]">🥉 3</span>
                      ) : (
                        <span className="text-[#9C9B98]">#{entry.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#25272B] border border-[#33363D] flex items-center justify-center text-[10px] text-[#D5A45B] font-bold">
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{entry.username}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#D5A45B]">
                      {entry.score}
                    </td>
                    <td className="py-3 px-4 text-center text-[#9C9B98] font-mono hidden sm:table-cell">
                      {entry.conclusionScore}/40
                    </td>
                    <td className="py-3 px-4 text-center text-[#9C9B98] font-mono hidden sm:table-cell">
                      {entry.evidenceScore}/35
                    </td>
                    <td className="py-3 px-4 text-center text-[#9C9B98] font-mono hidden sm:table-cell">
                      {entry.reasoningScore}/25
                    </td>
                    <td className="py-3 px-4 text-right text-[#9C9B98] font-mono text-[11px]">
                      {new Date(entry.submittedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <Trophy className="w-8 h-8 text-[#33363D] mx-auto" />
            <p className="text-sm text-[#F2EFE8] font-medium">No detective submissions recorded yet today.</p>
            <p className="text-xs text-[#9C9B98]">Be the first to investigate the scene and log your deduction!</p>
          </div>
        )}
      </div>
    </div>
  );
};
