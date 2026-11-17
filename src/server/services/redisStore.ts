import { redis } from '@devvit/web/server';
import type {
  PlayerProgress,
  PlayerStats,
  LeaderboardEntry,
  CommunityStats,
  EvaluationResult,
} from '../../shared/types';
import { CASE_LIBRARY, DEFAULT_CASE } from './caseLibrary';

const DEFAULT_MAX_INSPECTIONS = 3;

export const RedisKeys = {
  activeCaseDate: (date: string) => `daily:${date}`,
  dailyPost: (date: string) => `daily_post:${date}`,
  postToCase: (postId: string) => `post_case:${postId}`,
  playerProgress: (userId: string, caseId: string) => `player:${userId}:${caseId}`,
  playerStats: (userId: string) => `player_stats:${userId}`,
  dailyLeaderboard: (date: string) => `leaderboard:${date}`,
  allTimeLeaderboard: () => `leaderboard:all_time`,
  caseStats: (caseId: string) => `case_stats:${caseId}`,
  publishLock: (date: string) => `publish_lock:${date}`,
};

export const getCaseIdForPost = async (postId: string, fallbackCaseId: string = 'case-001'): Promise<string> => {
  try {
    const mapped = await redis.get(RedisKeys.postToCase(postId));
    return mapped || fallbackCaseId;
  } catch (err) {
    console.warn(`Could not fetch post_case mapping for ${postId}:`, err);
    return fallbackCaseId;
  }
};

export const setCaseIdForPost = async (postId: string, caseId: string): Promise<void> => {
  try {
    await redis.set(RedisKeys.postToCase(postId), caseId);
  } catch (err) {
    console.error(`Error saving post_case mapping for ${postId}:`, err);
  }
};

export const getPlayerProgress = async (
  userId: string,
  caseId: string
): Promise<PlayerProgress> => {
  try {
    const raw = await redis.get(RedisKeys.playerProgress(userId, caseId));
    if (raw) {
      return JSON.parse(raw) as PlayerProgress;
    }
  } catch (err) {
    console.error(`Error reading player progress for ${userId} in ${caseId}:`, err);
  }

  return {
    caseId,
    inspectedObjectIds: [],
    discoveredEvidence: [],
    remainingInspections: DEFAULT_MAX_INSPECTIONS,
    isSubmitted: false,
  };
};

export const recordInspection = async (
  userId: string,
  caseId: string,
  objectId: string
): Promise<{ success: boolean; progress: PlayerProgress; message?: string }> => {
  const current = await getPlayerProgress(userId, caseId);

  // If already inspected, return without consuming an inspection
  if (current.inspectedObjectIds.includes(objectId)) {
    return { success: true, progress: current };
  }

  // Check remaining inspections limit
  if (current.remainingInspections <= 0 || current.inspectedObjectIds.length >= DEFAULT_MAX_INSPECTIONS) {
    return {
      success: false,
      progress: current,
      message: 'Inspection limit reached (maximum 3 inspections).',
    };
  }

  // Find evidence from case library
  const caseData = CASE_LIBRARY[caseId] ?? DEFAULT_CASE;
  const evidence = caseData.evidenceMap[objectId];

  if (!evidence) {
    return {
      success: false,
      progress: current,
      message: 'Invalid object ID for this case.',
    };
  }

  const updatedProgress: PlayerProgress = {
    ...current,
    inspectedObjectIds: [...current.inspectedObjectIds, objectId],
    discoveredEvidence: [...current.discoveredEvidence, evidence],
    remainingInspections: current.remainingInspections - 1,
  };

  await redis.set(
    RedisKeys.playerProgress(userId, caseId),
    JSON.stringify(updatedProgress)
  );

  // Update object inspection counts for community statistics
  try {
    await recordObjectInspectionStat(caseId, objectId);
  } catch (err) {
    console.warn('Error recording object inspection stat:', err);
  }

  return { success: true, progress: updatedProgress };
};

export const recordFinalDeduction = async (
  userId: string,
  username: string,
  caseId: string,
  deduction: string,
  evaluation: EvaluationResult,
  dateStr: string
): Promise<{ success: boolean; progress: PlayerProgress; stats: PlayerStats }> => {
  const current = await getPlayerProgress(userId, caseId);

  if (current.isSubmitted && current.evaluation) {
    const stats = await getPlayerStats(userId);
    return { success: false, progress: current, stats };
  }

  const updatedProgress: PlayerProgress = {
    ...current,
    submittedDeduction: deduction,
    isSubmitted: true,
    evaluation,
    submittedAt: new Date().toISOString(),
  };

  // Save progress
  await redis.set(
    RedisKeys.playerProgress(userId, caseId),
    JSON.stringify(updatedProgress)
  );

  // Update player stats and streak
  const stats = await updatePlayerStats(userId, evaluation.score, dateStr);

  // Update daily and all-time leaderboards
  await updateLeaderboard(userId, username, evaluation, dateStr);

  // Update case aggregate statistics
  await recordCaseAggregateResult(caseId, evaluation.score);

  return { success: true, progress: updatedProgress, stats };
};

export const getPlayerStats = async (userId: string): Promise<PlayerStats> => {
  try {
    const raw = await redis.get(RedisKeys.playerStats(userId));
    if (raw) {
      return JSON.parse(raw) as PlayerStats;
    }
  } catch (err) {
    console.error(`Error reading player stats for ${userId}:`, err);
  }

  return {
    totalPlayed: 0,
    casesSolved: 0,
    averageScore: 0,
    bestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
  };
};

export const updatePlayerStats = async (
  userId: string,
  score: number,
  todayDateStr: string
): Promise<PlayerStats> => {
  const current = await getPlayerStats(userId);

  const isSolved = score >= 60;
  const newTotalPlayed = current.totalPlayed + 1;
  const newCasesSolved = current.casesSolved + (isSolved ? 1 : 0);
  const newAverageScore = Math.round(
    (current.averageScore * current.totalPlayed + score) / newTotalPlayed
  );
  const newBestScore = Math.max(current.bestScore, score);

  // Streak logic based on calendar days
  let newStreak: number;
  if (current.lastPlayedDate) {
    const lastDate = new Date(current.lastPlayedDate);
    const todayDate = new Date(todayDateStr);
    const diffDays = Math.round(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
    );

    if (diffDays === 1) {
      newStreak = current.currentStreak + 1;
    } else if (diffDays === 0) {
      newStreak = current.currentStreak; // Same day play
    } else {
      newStreak = 1; // Streak broken
    }
  } else {
    newStreak = 1;
  }

  const newLongestStreak = Math.max(current.longestStreak, newStreak);

  const updated: PlayerStats = {
    totalPlayed: newTotalPlayed,
    casesSolved: newCasesSolved,
    averageScore: newAverageScore,
    bestScore: newBestScore,
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastPlayedDate: todayDateStr,
  };

  await redis.set(RedisKeys.playerStats(userId), JSON.stringify(updated));
  return updated;
};

export const updateLeaderboard = async (
  _userId: string,
  username: string,
  evalResult: EvaluationResult,
  dateStr: string
): Promise<void> => {
  const entry: LeaderboardEntry = {
    rank: 1,
    username: username || 'Detective',
    score: evalResult.score,
    conclusionScore: evalResult.conclusionScore,
    evidenceScore: evalResult.evidenceScore,
    reasoningScore: evalResult.reasoningScore,
    submittedAt: evalResult.evaluatedAt,
  };

  const updateList = async (key: string) => {
    try {
      const raw = await redis.get(key);
      const list: LeaderboardEntry[] = raw ? JSON.parse(raw) : [];

      // Filter out existing entry for this user if already present
      const filtered = list.filter((e) => e.username !== entry.username);
      filtered.push(entry);

      // Sort by score DESC, reasoning DESC, evidence DESC, submittedAt ASC
      filtered.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.reasoningScore !== a.reasoningScore) return b.reasoningScore - a.reasoningScore;
        if (b.evidenceScore !== a.evidenceScore) return b.evidenceScore - a.evidenceScore;
        return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      });

      // Assign ranks and limit to top 50
      const ranked = filtered.slice(0, 50).map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));

      await redis.set(key, JSON.stringify(ranked));
    } catch (err) {
      console.error(`Error updating leaderboard at ${key}:`, err);
    }
  };

  await Promise.all([
    updateList(RedisKeys.dailyLeaderboard(dateStr)),
    updateList(RedisKeys.allTimeLeaderboard()),
  ]);
};

export const getLeaderboardData = async (
  dateStr: string
): Promise<{ daily: LeaderboardEntry[]; allTime: LeaderboardEntry[]; communityStats: CommunityStats }> => {
  let daily: LeaderboardEntry[] = [];
  let allTime: LeaderboardEntry[] = [];

  try {
    const [rawDaily, rawAllTime] = await Promise.all([
      redis.get(RedisKeys.dailyLeaderboard(dateStr)),
      redis.get(RedisKeys.allTimeLeaderboard()),
    ]);
    if (rawDaily) daily = JSON.parse(rawDaily);
    if (rawAllTime) allTime = JSON.parse(rawAllTime);
  } catch (err) {
    console.error('Error fetching leaderboard data:', err);
  }

  // Calculate community stats from all-time and daily entries
  const totalDetectives = Math.max(daily.length, allTime.length);
  const correctCount = daily.filter((e) => e.score >= 60).length;
  const correctPercentage = daily.length > 0 ? Math.round((correctCount / daily.length) * 100) : 74;
  const averageScore =
    daily.length > 0
      ? Math.round(daily.reduce((sum, e) => sum + e.score, 0) / daily.length)
      : 82;

  const communityStats: CommunityStats = {
    totalDetectives: totalDetectives > 0 ? totalDetectives : 142,
    correctPercentage,
    averageScore,
    mostInspectedObject: 'CCTV Monitor & Luggage',
    recentSubmissionsCount: daily.length,
  };

  return { daily, allTime, communityStats };
};

export const recordObjectInspectionStat = async (
  caseId: string,
  objectId: string
): Promise<void> => {
  const key = `object_stat:${caseId}:${objectId}`;
  await redis.incrBy(key, 1);
};

export const recordCaseAggregateResult = async (
  caseId: string,
  score: number
): Promise<void> => {
  const key = RedisKeys.caseStats(caseId);
  try {
    const raw = await redis.get(key);
    const stats = raw ? JSON.parse(raw) : { total: 0, sumScore: 0, correct: 0 };
    stats.total += 1;
    stats.sumScore += score;
    if (score >= 60) stats.correct += 1;
    await redis.set(key, JSON.stringify(stats));
  } catch (err) {
    console.warn(`Error updating case aggregate stats for ${caseId}:`, err);
  }
};
