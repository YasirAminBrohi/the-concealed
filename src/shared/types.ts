export type CaseStatus = 'draft' | 'approved' | 'scheduled' | 'published' | 'archived';

export type CaseDifficulty = 'Easy' | 'Medium' | 'Hard';

export type InspectableObject = {
  id: string;
  name: string;
  description: string;
  icon: string;
  sceneX: number; // percentage 0 - 100
  sceneY: number; // percentage 0 - 100
  accessibilityLabel: string;
};

export type VisualClueType =
  | 'clock'
  | 'ticket'
  | 'footprints'
  | 'cctv'
  | 'logbook'
  | 'suitcase'
  | 'painting'
  | 'safe'
  | 'poison'
  | 'watch'
  | 'feather'
  | 'briefcase';

export type ClueEvidence = {
  objectId: string;
  title: string;
  evidenceText: string;
  detailedObservation: string;
  visualType: VisualClueType;
};

export type AnswerRubric = {
  correctConclusion: string;
  requiredFacts: string[];
  supportingEvidence: string[];
  acceptableAlternatives: string[];
  commonMisconceptions: string[];
  unsupportedAssumptions: string[];
};

export type EvaluationVerdict =
  | 'correct'
  | 'mostly_correct'
  | 'partially_correct'
  | 'incorrect';

export type EvaluationResult = {
  score: number;
  verdict: EvaluationVerdict;
  conclusionScore: number;
  evidenceScore: number;
  reasoningScore: number;
  matchedFacts: string[];
  missingFacts: string[];
  feedback: string;
  evaluatedAt: string;
};

export type CaseData = {
  id: string;
  caseNumber: string;
  title: string;
  difficulty: CaseDifficulty;
  location: string;
  incidentTime: string;
  incidentDate: string;
  introduction: string;
  objective: string;
  maxInspections: number;
  objects: InspectableObject[];
  evidenceMap: Record<string, ClueEvidence>;
  rubric: AnswerRubric;
  officialSolution: string;
  officialExplanation: string;
  scheduledDate: string; // YYYY-MM-DD
  revealDate: string; // ISO string
  status: CaseStatus;
};

export type PublicCaseData = {
  id: string;
  caseNumber: string;
  title: string;
  difficulty: CaseDifficulty;
  location: string;
  incidentTime: string;
  incidentDate: string;
  introduction: string;
  objective: string;
  maxInspections: number;
  objects: InspectableObject[];
  isRevealed: boolean;
  revealDate: string;
  officialSolution?: string;
  officialExplanation?: string;
};

export type PlayerProgress = {
  caseId: string;
  inspectedObjectIds: string[];
  discoveredEvidence: ClueEvidence[];
  remainingInspections: number;
  submittedDeduction?: string;
  isSubmitted: boolean;
  evaluation?: EvaluationResult;
  submittedAt?: string;
};

export type PlayerStats = {
  totalPlayed: number;
  casesSolved: number;
  averageScore: number;
  bestScore: number;
  currentStreak: number;
  longestStreak: number;
  lastPlayedDate?: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  score: number;
  conclusionScore: number;
  evidenceScore: number;
  reasoningScore: number;
  submittedAt: string;
};

export type CommunityStats = {
  totalDetectives: number;
  correctPercentage: number;
  averageScore: number;
  mostInspectedObject: string;
  recentSubmissionsCount: number;
};

export type CaseInitResponse = {
  type: 'case_init';
  postId: string;
  username: string;
  isModerator: boolean;
  caseData: PublicCaseData;
  progress: PlayerProgress;
  playerStats: PlayerStats;
};

export type InvestigateRequest = {
  caseId: string;
  objectId: string;
};

export type InvestigateResponse = {
  success: boolean;
  objectId: string;
  evidence: ClueEvidence;
  remainingInspections: number;
  inspectedObjectIds: string[];
};

export type DeduceRequest = {
  caseId: string;
  deduction: string;
};

export type DeduceResponse = {
  success: boolean;
  evaluation: EvaluationResult;
  playerStats: PlayerStats;
  alreadySubmitted?: boolean;
};

export type LeaderboardResponse = {
  daily: LeaderboardEntry[];
  allTime: LeaderboardEntry[];
  communityStats: CommunityStats;
};
