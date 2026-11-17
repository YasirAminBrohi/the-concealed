import { useState, useEffect, useCallback } from 'react';
import type {
  CaseInitResponse,
  InvestigateResponse,
  DeduceResponse,
  LeaderboardResponse,
  PublicCaseData,
  PlayerProgress,
  PlayerStats,
  LeaderboardEntry,
  CommunityStats,
  ClueEvidence,
} from '../../shared/types';

export type GameView =
  | 'briefing'
  | 'scene'
  | 'board'
  | 'deduce'
  | 'verdict'
  | 'leaderboard'
  | 'admin';

export const useDetectiveGame = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<GameView>('briefing');

  const [username, setUsername] = useState<string>('Detective');
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [caseData, setCaseData] = useState<PublicCaseData | null>(null);
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);

  // Active selected evidence modal
  const [selectedClue, setSelectedClue] = useState<ClueEvidence | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [isDeducing, setIsDeducing] = useState<boolean>(false);

  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState<{
    daily: LeaderboardEntry[];
    allTime: LeaderboardEntry[];
    communityStats: CommunityStats | null;
  }>({
    daily: [],
    allTime: [],
    communityStats: null,
  });

  const loadInitData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/init');
      if (!res.ok) {
        throw new Error(`Init request failed: HTTP ${res.status}`);
      }
      const data: CaseInitResponse = await res.json();
      setUsername(data.username);
      setIsModerator(data.isModerator);
      setCaseData(data.caseData);
      setProgress(data.progress);
      setPlayerStats(data.playerStats);

      // If user has already submitted a deduction, take them directly to verdict
      if (data.progress.isSubmitted && data.progress.evaluation) {
        setCurrentView('verdict');
      } else if (data.progress.inspectedObjectIds.length > 0) {
        // If already started investigating, resume in scene
        setCurrentView('scene');
      } else {
        setCurrentView('briefing');
      }
    } catch (err) {
      console.error('Failed to load initial detective game state:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to detective records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetch('/api/init')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Init request failed: HTTP ${res.status}`);
        return (await res.json()) as CaseInitResponse;
      })
      .then((data) => {
        if (!active) return;
        setUsername(data.username);
        setIsModerator(data.isModerator);
        setCaseData(data.caseData);
        setProgress(data.progress);
        setPlayerStats(data.playerStats);

        if (data.progress.isSubmitted && data.progress.evaluation) {
          setCurrentView('verdict');
        } else if (data.progress.inspectedObjectIds.length > 0) {
          setCurrentView('scene');
        } else {
          setCurrentView('briefing');
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to connect to detective records');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const investigate = useCallback(
    async (objectId: string): Promise<ClueEvidence | null> => {
      if (!caseData || !progress) return null;

      // Check if this object was already inspected
      const existing = progress.discoveredEvidence.find((e) => e.objectId === objectId);
      if (existing) {
        setSelectedClue(existing);
        return existing;
      }

      if (progress.remainingInspections <= 0) {
        setError('Maximum of 3 inspections reached. Proceed to the Evidence Board or Deduction.');
        return null;
      }

      try {
        setIsInspecting(true);
        setError(null);
        const res = await fetch('/api/investigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseData.id,
            objectId,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Investigation failed: HTTP ${res.status}`);
        }

        const data: InvestigateResponse = await res.json();
        const newEvidence = data.evidence;

        setProgress((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            inspectedObjectIds: data.inspectedObjectIds,
            discoveredEvidence: [...prev.discoveredEvidence, newEvidence],
            remainingInspections: data.remainingInspections,
          };
        });

        setSelectedClue(newEvidence);
        return newEvidence;
      } catch (err) {
        console.error('Error investigating object:', err);
        setError(err instanceof Error ? err.message : 'Failed to inspect evidence');
        return null;
      } finally {
        setIsInspecting(false);
      }
    },
    [caseData, progress]
  );

  const submitDeduction = useCallback(
    async (theoryText: string): Promise<boolean> => {
      if (!caseData || !progress) return false;

      try {
        setIsDeducing(true);
        setError(null);

        const res = await fetch('/api/deduce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            caseId: caseData.id,
            deduction: theoryText,
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Deduction evaluation failed: HTTP ${res.status}`);
        }

        const data: DeduceResponse = await res.json();

        setProgress((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isSubmitted: true,
            submittedDeduction: theoryText,
            evaluation: data.evaluation,
            submittedAt: data.evaluation.evaluatedAt,
          };
        });

        setPlayerStats(data.playerStats);
        setCurrentView('verdict');
        return true;
      } catch (err) {
        console.error('Error submitting deduction:', err);
        setError(err instanceof Error ? err.message : 'Evaluation service error');
        return false;
      } finally {
        setIsDeducing(false);
      }
    },
    [caseData, progress]
  );

  const loadLeaderboard = useCallback(async () => {
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data: LeaderboardResponse = await res.json();
        setLeaderboardData({
          daily: data.daily,
          allTime: data.allTime,
          communityStats: data.communityStats,
        });
      }
    } catch (err) {
      console.warn('Failed to load leaderboard:', err);
    }
  }, []);

  return {
    loading,
    error,
    currentView,
    setCurrentView,
    username,
    isModerator,
    caseData,
    progress,
    playerStats,
    selectedClue,
    setSelectedClue,
    isInspecting,
    isDeducing,
    investigate,
    submitDeduction,
    leaderboardData,
    loadLeaderboard,
    reloadInit: loadInitData,
  };
};
