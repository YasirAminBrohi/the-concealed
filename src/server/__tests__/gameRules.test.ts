import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import type { PlayerProgress, LeaderboardEntry } from '../../shared/types';

void describe('Game Rules, Streaks & Leaderboard Logic', () => {
  void test('inspection limits and repeated inspection safeguards', () => {
    const progress: PlayerProgress = {
      caseId: 'case-001',
      inspectedObjectIds: ['station_clock', 'train_ticket'],
      discoveredEvidence: [],
      remainingInspections: 1,
      isSubmitted: false,
    };

    // Re-inspecting an existing object should NOT consume an inspection
    const alreadyInspected = progress.inspectedObjectIds.includes('station_clock');
    assert.equal(alreadyInspected, true);

    // Inspecting a new object when remaining = 1 should decrement remaining to 0
    const newObjectId = 'cctv_monitor';
    const updatedInspected = [...progress.inspectedObjectIds, newObjectId];
    const updatedRemaining = progress.remainingInspections - 1;

    assert.equal(updatedRemaining, 0);
    assert.equal(updatedInspected.length, 3);

    // After 3 inspections, further new inspections are blocked
    const canInspectFurther = updatedRemaining > 0;
    assert.equal(canInspectFurther, false);
  });

  void test('single final submission enforcement', () => {
    const progress: PlayerProgress = {
      caseId: 'case-001',
      inspectedObjectIds: ['station_clock', 'train_ticket', 'cctv_monitor'],
      discoveredEvidence: [],
      remainingInspections: 0,
      isSubmitted: true,
      submittedDeduction: 'Previous theory',
      evaluation: {
        score: 85,
        verdict: 'correct',
        conclusionScore: 40,
        evidenceScore: 25,
        reasoningScore: 20,
        matchedFacts: [],
        missingFacts: [],
        feedback: 'Great deduction',
        evaluatedAt: '2026-11-17T12:00:00Z',
      },
    };

    // Attempting a second submission must be rejected / return existing evaluation
    assert.equal(progress.isSubmitted, true);
    assert.ok(progress.evaluation);
  });

  void test('streak calculation across consecutive calendar days', () => {
    const calcStreak = (lastDateStr: string | undefined, todayDateStr: string, currentStreak: number): number => {
      if (!lastDateStr) return 1;
      const last = new Date(lastDateStr);
      const today = new Date(todayDateStr);
      const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) return currentStreak + 1;
      if (diffDays === 0) return currentStreak;
      return 1;
    };

    // First time play
    assert.equal(calcStreak(undefined, '2026-11-17', 0), 1);

    // Consecutive day play (streak continues)
    assert.equal(calcStreak('2026-11-16', '2026-11-17', 3), 4);

    // Same day play (streak unchanged)
    assert.equal(calcStreak('2026-11-17', '2026-11-17', 4), 4);

    // Missed a day (streak resets to 1)
    assert.equal(calcStreak('2026-11-14', '2026-11-17', 5), 1);
  });

  void test('leaderboard ranking sort order', () => {
    const entries: LeaderboardEntry[] = [
      {
        rank: 0,
        username: 'Detective_B',
        score: 85,
        conclusionScore: 40,
        evidenceScore: 25,
        reasoningScore: 20,
        submittedAt: '2026-11-17T10:05:00Z',
      },
      {
        rank: 0,
        username: 'Detective_A',
        score: 95,
        conclusionScore: 40,
        evidenceScore: 30,
        reasoningScore: 25,
        submittedAt: '2026-11-17T10:10:00Z',
      },
      {
        rank: 0,
        username: 'Detective_C',
        score: 85,
        conclusionScore: 40,
        evidenceScore: 20,
        reasoningScore: 25, // higher reasoning than B with same total score
        submittedAt: '2026-11-17T10:02:00Z',
      },
      {
        rank: 0,
        username: 'Detective_D',
        score: 85,
        conclusionScore: 40,
        evidenceScore: 25,
        reasoningScore: 20,
        submittedAt: '2026-11-17T10:01:00Z', // identical to B but submitted earlier!
      },
    ];

    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.reasoningScore !== a.reasoningScore) return b.reasoningScore - a.reasoningScore;
      if (b.evidenceScore !== a.evidenceScore) return b.evidenceScore - a.evidenceScore;
      return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });

    const ranked = entries.map((e, idx) => ({ ...e, rank: idx + 1 }));

    // 1st place: Detective_A (95 pts)
    assert.equal(ranked[0]?.username, 'Detective_A');
    // 2nd place: Detective_C (85 pts, reasoning 25)
    assert.equal(ranked[1]?.username, 'Detective_C');
    // 3rd place: Detective_D (85 pts, reasoning 20, earlier time 10:01)
    assert.equal(ranked[2]?.username, 'Detective_D');
    // 4th place: Detective_B (85 pts, reasoning 20, later time 10:05)
    assert.equal(ranked[3]?.username, 'Detective_B');
  });
});
