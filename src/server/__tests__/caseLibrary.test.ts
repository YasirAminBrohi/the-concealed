import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  CASE_LIBRARY,
  getPublicCaseData,
  getTodayPakistanDate,
  getCaseForDate,
} from '../services/caseLibrary.ts';

void describe('Case Library & Mystery Fairness', () => {
  void test('all required cases exist and are fully populated', () => {
    const requiredCases = ['case-001', 'case-002', 'case-003'];
    for (const id of requiredCases) {
      const c = CASE_LIBRARY[id];
      assert.ok(c, `Case ${id} must exist in library`);
      assert.ok(c.title && c.title.length > 0, `Case ${id} must have a title`);
      assert.ok(c.caseNumber.startsWith('CASE #'), `Case ${id} number format`);
      assert.ok(c.introduction.length > 50, `Case ${id} introduction must be substantive`);
      assert.ok(c.objective.length > 10, `Case ${id} objective must be clear`);
      assert.equal(c.maxInspections, 3, `Max inspections must be 3`);
      assert.equal(c.objects.length, 6, `Case ${id} must have exactly 6 inspectable objects`);

      // Verify each object has matching evidence
      const objectIds = new Set<string>();
      for (const obj of c.objects) {
        assert.ok(!objectIds.has(obj.id), `Object ID ${obj.id} must be unique`);
        objectIds.add(obj.id);
        assert.ok(obj.sceneX >= 0 && obj.sceneX <= 100, `sceneX within bounds`);
        assert.ok(obj.sceneY >= 0 && obj.sceneY <= 100, `sceneY within bounds`);

        const evidence = c.evidenceMap[obj.id];
        assert.ok(evidence, `Object ${obj.id} must have corresponding evidence in evidenceMap`);
        assert.ok(evidence.evidenceText.length > 20, `Evidence text must be substantive`);
        assert.ok(evidence.detailedObservation.length > 10, `Observation must be substantive`);
      }

      // Verify answer rubric
      assert.ok(c.rubric.correctConclusion.length > 20, `Rubric conclusion`);
      assert.ok(c.rubric.requiredFacts.length >= 2, `Rubric must have required facts`);
      assert.ok(c.rubric.supportingEvidence.length >= 3, `Rubric must have supporting evidence`);
      assert.ok(c.officialSolution.length > 30, `Official solution`);
      assert.ok(c.officialExplanation.length > 30, `Official explanation`);
    }
  });

  void test('getPublicCaseData masks confidential solution before reveal time', () => {
    const case1 = CASE_LIBRARY['case-001']!;
    const publicUnrevealed = getPublicCaseData(case1, false);

    assert.equal(publicUnrevealed.isRevealed, false);
    assert.equal(publicUnrevealed.officialSolution, undefined);
    assert.equal(publicUnrevealed.officialExplanation, undefined);
    assert.equal(publicUnrevealed.title, case1.title);
    assert.equal(publicUnrevealed.objects.length, 6);
  });

  void test('getPublicCaseData exposes official solution after reveal time', () => {
    const case1 = CASE_LIBRARY['case-001']!;
    const publicRevealed = getPublicCaseData(case1, true);

    assert.equal(publicRevealed.isRevealed, true);
    assert.equal(publicRevealed.officialSolution, case1.officialSolution);
    assert.equal(publicRevealed.officialExplanation, case1.officialExplanation);
  });

  void test('getTodayPakistanDate returns valid YYYY-MM-DD format', () => {
    const dateStr = getTodayPakistanDate();
    assert.match(dateStr, /^\d{4}-\d{2}-\d{2}$/);
  });

  void test('getCaseForDate falls back to Case 001 if date unassigned', () => {
    const c = getCaseForDate('2099-12-31');
    assert.ok(c);
    assert.equal(c.id, 'case-001');
  });
});
