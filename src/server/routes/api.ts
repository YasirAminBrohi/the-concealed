import { Hono } from 'hono';
import { context, reddit } from '@devvit/web/server';
import type {
  CaseInitResponse,
  InvestigateRequest,
  InvestigateResponse,
  DeduceRequest,
  DeduceResponse,
  LeaderboardResponse,
} from '../../shared/types';
import {
  CASE_LIBRARY,
  DEFAULT_CASE,
  getPublicCaseData,
  getTodayPakistanDate,
} from '../services/caseLibrary';
import {
  getCaseIdForPost,
  getPlayerProgress,
  recordInspection,
  recordFinalDeduction,
  getPlayerStats,
  getLeaderboardData,
} from '../services/redisStore';
import { evaluateDeduction } from '../services/evaluator';
import { publishDailyPost } from '../core/post';

type ErrorResponse = {
  status: 'error';
  message: string;
};

export const api = new Hono();

// Initialize the game session for the current post and user
api.get('/init', async (c) => {
  const postId = context.postId || 'preview_post';
  let username = 'Detective';
  let userId = 'anon_investigator';
  let isModerator = false;

  try {
    const currentUsername = await reddit.getCurrentUsername();
    if (currentUsername) {
      username = currentUsername;
      userId = `u_${currentUsername.toLowerCase()}`;
    }
  } catch (err) {
    console.warn('Could not retrieve current username from Reddit context:', err);
  }

  // Check if current user is moderator of current subreddit
  if (context.subredditName) {
    try {
      const modStatus = await reddit.getModerators({
        subredditName: context.subredditName,
      });
      // devvit getModerators returns an array of moderator records
      if (Array.isArray(modStatus)) {
        isModerator = modStatus.some((m) => m.username?.toLowerCase() === username.toLowerCase());
      }
    } catch {
      // If error checking mod status, default is false
    }
  }

  // Retrieve the specific case tied to this Reddit post
  const caseId = await getCaseIdForPost(postId, 'case-001');
  const fullCase = CASE_LIBRARY[caseId] ?? DEFAULT_CASE;
  const publicCase = getPublicCaseData(fullCase);

  const [progress, playerStats] = await Promise.all([
    getPlayerProgress(userId, fullCase.id),
    getPlayerStats(userId),
  ]);

  const responseData: CaseInitResponse = {
    type: 'case_init',
    postId,
    username,
    isModerator,
    caseData: publicCase,
    progress,
    playerStats,
  };

  return c.json(responseData);
});

// Server-enforced object inspection (Max 3 per case)
api.post('/investigate', async (c) => {
  let userId = 'anon_investigator';
  try {
    const currentUsername = await reddit.getCurrentUsername();
    if (currentUsername) {
      userId = `u_${currentUsername.toLowerCase()}`;
    }
  } catch {
    // fallback to anon
  }

  try {
    const body: InvestigateRequest = await c.req.json();
    const { caseId, objectId } = body;

    if (!caseId || !objectId) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'caseId and objectId are required' },
        400
      );
    }

    const result = await recordInspection(userId, caseId, objectId);
    if (!result.success) {
      return c.json<ErrorResponse>(
        { status: 'error', message: result.message || 'Inspection failed' },
        403
      );
    }

    const latestEvidence = result.progress.discoveredEvidence.find(
      (e) => e.objectId === objectId
    );

    if (!latestEvidence) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Evidence not found for object' },
        404
      );
    }

    const response: InvestigateResponse = {
      success: true,
      objectId,
      evidence: latestEvidence,
      remainingInspections: result.progress.remainingInspections,
      inspectedObjectIds: result.progress.inspectedObjectIds,
    };

    return c.json(response);
  } catch (err) {
    console.error('Error during inspection:', err);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to inspect object' },
      500
    );
  }
});

// Final deduction submission (One per case per user)
api.post('/deduce', async (c) => {
  let userId = 'anon_investigator';
  let username = 'Detective';
  try {
    const currentUsername = await reddit.getCurrentUsername();
    if (currentUsername) {
      username = currentUsername;
      userId = `u_${currentUsername.toLowerCase()}`;
    }
  } catch {
    // fallback
  }

  try {
    const body: DeduceRequest = await c.req.json();
    const { caseId, deduction } = body;

    if (!caseId || !deduction || deduction.trim().length === 0) {
      return c.json<ErrorResponse>(
        { status: 'error', message: 'Valid caseId and deduction text are required' },
        400
      );
    }

    // Check if user already submitted a final deduction
    const currentProgress = await getPlayerProgress(userId, caseId);
    if (currentProgress.isSubmitted && currentProgress.evaluation) {
      const stats = await getPlayerStats(userId);
      const alreadyResponse: DeduceResponse = {
        success: true,
        evaluation: currentProgress.evaluation,
        playerStats: stats,
        alreadySubmitted: true,
      };
      return c.json(alreadyResponse);
    }

    const caseData = CASE_LIBRARY[caseId] ?? DEFAULT_CASE;
    const discoveredClueTexts = currentProgress.discoveredEvidence.map(
      (e) => e.evidenceText
    );

    // AI answer evaluation against the case rubric
    const evaluation = await evaluateDeduction(
      deduction,
      caseData.rubric,
      discoveredClueTexts
    );

    const dateStr = getTodayPakistanDate();

    // Persist final score, update streak and leaderboards
    const recordResult = await recordFinalDeduction(
      userId,
      username,
      caseId,
      deduction,
      evaluation,
      dateStr
    );

    const response: DeduceResponse = {
      success: true,
      evaluation,
      playerStats: recordResult.stats,
    };

    return c.json(response);
  } catch (err) {
    console.error('Error processing deduction:', err);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to evaluate deduction' },
      500
    );
  }
});

// Leaderboard and community statistics
api.get('/leaderboard', async (c) => {
  const dateStr = getTodayPakistanDate();
  try {
    const data = await getLeaderboardData(dateStr);
    const response: LeaderboardResponse = {
      daily: data.daily,
      allTime: data.allTime,
      communityStats: data.communityStats,
    };
    return c.json(response);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return c.json<ErrorResponse>(
      { status: 'error', message: 'Failed to load leaderboard data' },
      500
    );
  }
});

// Admin cases library query (Moderator only)
api.get('/admin/cases', async (c) => {
  const cases = Object.values(CASE_LIBRARY).map((c) => ({
    id: c.id,
    caseNumber: c.caseNumber,
    title: c.title,
    difficulty: c.difficulty,
    scheduledDate: c.scheduledDate,
    revealDate: c.revealDate,
    status: c.status,
    objectsCount: c.objects.length,
  }));
  return c.json({ cases });
});

// Admin manual publish trigger
api.post('/admin/publish', async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const targetCaseId = body?.caseId;
    const result = await publishDailyPost(targetCaseId);
    return c.json(result);
  } catch (err) {
    return c.json({ success: false, message: String(err) }, 500);
  }
});
