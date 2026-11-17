import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { useDetectiveGame } from './hooks/useDetectiveGame';
import { Header } from './components/Header';
import { BriefingView } from './components/BriefingView';
import { SceneView } from './components/SceneView';
import { BoardView } from './components/BoardView';
import { DeduceView } from './components/DeduceView';
import { VerdictView } from './components/VerdictView';
import { LeaderboardView } from './components/LeaderboardView';
import { AdminView } from './components/AdminView';
import { EvidenceModal } from './components/EvidenceModal';
import { Loader2, AlertCircle } from 'lucide-react';

export const App = () => {
  const {
    loading,
    error,
    currentView,
    setCurrentView,
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
    reloadInit,
  } = useDetectiveGame();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#101114] text-[#F2EFE8] space-y-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-[#33363D] border-t-[#D5A45B] animate-spin" />
          <Loader2 className="w-6 h-6 text-[#D5A45B] absolute inset-0 m-auto" />
        </div>
        <div className="text-center space-y-1">
          <h2 className="font-serif tracking-widest text-sm text-[#D5A45B] uppercase font-bold">
            THE UNSEEN
          </h2>
          <p className="text-xs text-[#9C9B98] font-mono">
            Accessing confidential police case files...
          </p>
        </div>
      </div>
    );
  }

  if (error && !caseData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#101114] text-[#F2EFE8] p-6 text-center">
        <div className="bg-[#1A1C20] border border-[#A94E4E]/50 rounded-lg p-6 max-w-md w-full space-y-4">
          <AlertCircle className="w-10 h-10 text-[#A94E4E] mx-auto" />
          <h2 className="font-serif font-bold text-lg text-[#F2EFE8]">
            Investigation File Error
          </h2>
          <p className="text-xs text-[#9C9B98] leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => void reloadInit()}
            className="w-full bg-[#D5A45B] text-[#101114] font-bold py-2.5 px-4 rounded text-xs cursor-pointer hover:bg-[#B88942] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101114] text-[#F2EFE8] flex flex-col font-sans selection:bg-[#D5A45B] selection:text-[#101114]">
      {/* Top Detective Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        caseData={caseData}
        progress={progress}
        isModerator={isModerator}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {caseData && currentView === 'briefing' && (
          <BriefingView
            caseData={caseData}
            progress={progress}
            playerStats={playerStats}
            onStart={() => setCurrentView('scene')}
            onViewBoard={() => setCurrentView('board')}
          />
        )}

        {caseData && currentView === 'scene' && (
          <SceneView
            caseData={caseData}
            progress={progress}
            onInspect={investigate}
            onGoToBoard={() => setCurrentView('board')}
            onGoToDeduce={() => setCurrentView('deduce')}
            isInspecting={isInspecting}
          />
        )}

        {caseData && currentView === 'board' && (
          <BoardView
            caseData={caseData}
            progress={progress}
            onSelectClue={(clue) => setSelectedClue(clue)}
            onGoToScene={() => setCurrentView('scene')}
            onGoToDeduce={() => setCurrentView('deduce')}
          />
        )}

        {caseData && currentView === 'deduce' && (
          <DeduceView
            caseData={caseData}
            progress={progress}
            onSubmit={submitDeduction}
            onGoToScene={() => setCurrentView('scene')}
            onGoToBoard={() => setCurrentView('board')}
            isDeducing={isDeducing}
            error={error}
          />
        )}

        {caseData && currentView === 'verdict' && (
          <VerdictView
            caseData={caseData}
            progress={progress}
            playerStats={playerStats}
            onViewBoard={() => setCurrentView('board')}
            onViewLeaderboard={() => {
              setCurrentView('leaderboard');
              void loadLeaderboard();
            }}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            daily={leaderboardData.daily}
            allTime={leaderboardData.allTime}
            communityStats={leaderboardData.communityStats}
            onRefresh={loadLeaderboard}
          />
        )}

        {isModerator && currentView === 'admin' && <AdminView />}
      </main>

      {/* Forensic Clue Inspection Modal */}
      <EvidenceModal
        clue={selectedClue}
        onClose={() => setSelectedClue(null)}
        onGoToBoard={() => setCurrentView('board')}
        remainingInspections={progress?.remainingInspections ?? 3}
      />
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
