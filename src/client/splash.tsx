import './index.css';

import { requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CaseInitResponse, PublicCaseData } from '../shared/types';
import { Search, ArrowRight, Clock, MapPin, Eye } from 'lucide-react';

export const Splash = () => {
  const [caseData, setCaseData] = useState<PublicCaseData | null>(null);
  const [username, setUsername] = useState<string>('Detective');

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch('/api/init');
        if (res.ok) {
          const data: CaseInitResponse = await res.json();
          setCaseData(data.caseData);
          setUsername(data.username);
        }
      } catch (err) {
        console.warn('Could not load case preview for splash view:', err);
      }
    };
    void fetchPreview();
  }, []);

  return (
    <div className="flex relative flex-col justify-between items-center min-h-screen bg-[#101114] text-[#F2EFE8] p-4 sm:p-6 select-none overflow-hidden font-sans">
      {/* Background Subtle Gradient & Noir Lighting */}
      <div className="absolute inset-0 bg-radial from-[#1E2127]/60 via-[#121316] to-[#0A0B0D] pointer-events-none" />

      {/* Top Header / Branding */}
      <header className="relative z-10 w-full max-w-md flex items-center justify-between border-b border-[#33363D] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#1A1C20] border border-[#D5A45B]/60 flex items-center justify-center text-[#D5A45B]">
            <Search className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-serif tracking-widest text-xs uppercase text-[#D5A45B] font-bold block">
              THE UNSEEN
            </span>
            <span className="text-[10px] text-[#9C9B98] font-mono leading-none">
              Daily Detective Mystery
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-[#1A1C20] border border-[#33363D] px-2.5 py-1 rounded-full text-[11px] font-mono text-[#D5A45B]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D5A45B] animate-pulse" />
          <span>TODAY'S CASE</span>
        </div>
      </header>

      {/* Center Case File Dossier Card */}
      <main className="relative z-10 w-full max-w-md my-auto py-4">
        <div className="bg-[#1A1C20] border border-[#33363D] rounded-lg shadow-2xl overflow-hidden group hover:border-[#D5A45B]/60 transition-colors">
          {/* Card Top Strip */}
          <div className="bg-[#25272B] px-4 py-2 border-b border-[#33363D] flex items-center justify-between text-[11px] font-mono text-[#9C9B98]">
            <span className="text-[#D5A45B] font-bold">
              {caseData ? caseData.caseNumber : 'CASE #001'}
            </span>
            <span className="uppercase text-[#78A88F]">
              {caseData ? `Difficulty: ${caseData.difficulty}` : 'Difficulty: Easy'}
            </span>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#F2EFE8] tracking-tight">
                {caseData ? caseData.title : 'The Last Train'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#9C9B98]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D5A45B]" />
                  <span>{caseData ? caseData.location : 'Northbridge Station'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D5A45B]" />
                  <span>{caseData ? caseData.incidentTime : '11:47 PM'}</span>
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F2EFE8]/80 leading-relaxed font-sans line-clamp-3">
              {caseData
                ? caseData.introduction
                : 'A station employee disappears shortly before final shutdown. The last train has already departed. Can you uncover what happened?'}
            </p>

            {/* Clue Count & Rules Chips */}
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-[#9C9B98] bg-[#101114] p-2.5 rounded border border-[#33363D]">
              <div>
                <span className="block text-[#D5A45B] font-bold text-xs">6 OBJECTS</span>
                <span>In Scene</span>
              </div>
              <div className="border-x border-[#33363D]">
                <span className="block text-[#D5A45B] font-bold text-xs">3 LIMIT</span>
                <span>Inspections</span>
              </div>
              <div>
                <span className="block text-[#78A88F] font-bold text-xs">AI JUDGED</span>
                <span>Semantic</span>
              </div>
            </div>

            {/* Launch CTA Button */}
            <button
              onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
              className="w-full bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] font-bold py-3.5 px-4 rounded-md flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-[#D5A45B]/25 text-sm select-none"
            >
              <Eye className="w-4 h-4" />
              <span>Enter Investigation Scene</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-md text-center text-[11px] text-[#9C9B98] border-t border-[#33363D]/60 pt-3">
        <span>Detective: <strong>{username}</strong></span>
        <span className="mx-2">•</span>
        <span>Every detail tells a story. Can you see the truth?</span>
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
