import React, { useState } from 'react';
import type { PublicCaseData, PlayerProgress, InspectableObject } from '../../shared/types';
import {
  Search,
  CheckCircle2,
  Lock,
  List,
  LayoutGrid,
  ArrowRight,
  BookOpen,
  Info,
} from 'lucide-react';

type SceneViewProps = {
  caseData: PublicCaseData;
  progress: PlayerProgress | null;
  onInspect: (objectId: string) => void;
  onGoToBoard: () => void;
  onGoToDeduce: () => void;
  isInspecting: boolean;
};

export const SceneView: React.FC<SceneViewProps> = ({
  caseData,
  progress,
  onInspect,
  onGoToBoard,
  onGoToDeduce,
  isInspecting,
}) => {
  const [viewMode, setViewMode] = useState<'scene' | 'list'>('scene');
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);

  const inspectedIds = progress?.inspectedObjectIds ?? [];
  const remaining = progress?.remainingInspections ?? 3;
  const isLimitReached = remaining <= 0;

  const handleObjectClick = (obj: InspectableObject) => {
    onInspect(obj.id);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 animate-fade-in">
      {/* Top Scene Subheader */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1A1C20] border border-[#33363D] p-3 sm:p-4 rounded-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#D5A45B] uppercase font-bold tracking-wider">
              {caseData.caseNumber} Investigation Scene
            </span>
            <span className="text-[11px] text-[#9C9B98] bg-[#25272B] px-2 py-0.5 rounded border border-[#33363D]">
              {caseData.location}
            </span>
          </div>
          <p className="text-xs text-[#9C9B98] mt-1">
            Tap objects in the environment to discover forensic clues. Max 3 inspections.
          </p>
        </div>

        {/* View Switcher and Board Shortcut */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex bg-[#25272B] p-0.5 rounded border border-[#33363D]">
            <button
              onClick={() => setViewMode('scene')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'scene'
                  ? 'bg-[#101114] text-[#D5A45B] shadow-sm'
                  : 'text-[#9C9B98] hover:text-[#F2EFE8]'
              }`}
              title="Interactive Scene View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#101114] text-[#D5A45B] shadow-sm'
                  : 'text-[#9C9B98] hover:text-[#F2EFE8]'
              }`}
              title="Accessible Evidence List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onGoToBoard}
            className="flex items-center gap-1.5 bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] px-3 py-1.5 rounded text-xs font-medium border border-[#33363D] cursor-pointer transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D5A45B]" />
            <span>Board ({inspectedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Main Investigation Area */}
      {viewMode === 'scene' ? (
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] min-h-[340px] max-h-[560px] bg-[#14161A] rounded-lg border-2 border-[#33363D] overflow-hidden shadow-2xl select-none group/scene">
          {/* Visual Environment Canvas (Bespoke noir crime scene background) */}
          <div className="absolute inset-0 bg-radial from-[#1E2127] via-[#121316] to-[#0A0B0D] opacity-95 pointer-events-none" />

          {/* Atmospheric Grid & Shadows */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#D5A45B15 1px, transparent 1px), linear-gradient(90deg, #D5A45B15 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Crime Scene Tape / Noir Light Beam Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D5A45B]/5 to-transparent pointer-events-none" />

          {/* Scene Title Watermark */}
          <div className="absolute bottom-3 left-4 pointer-events-none opacity-40">
            <span className="font-serif tracking-widest text-lg font-bold text-[#F2EFE8] uppercase">
              {caseData.title}
            </span>
            <span className="block text-[10px] font-mono text-[#D5A45B]">
              COORDINATES: LAT 51.5074 / LNG -0.1278
            </span>
          </div>

          {/* Interactive Object Hotspots */}
          {caseData.objects.map((obj) => {
            const isInspected = inspectedIds.includes(obj.id);
            const isLocked = isLimitReached && !isInspected;
            const isHovered = hoveredObjectId === obj.id;

            return (
              <div
                key={obj.id}
                style={{
                  left: `${obj.sceneX}%`,
                  top: `${obj.sceneY}%`,
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                onMouseEnter={() => setHoveredObjectId(obj.id)}
                onMouseLeave={() => setHoveredObjectId(null)}
              >
                <button
                  onClick={() => handleObjectClick(obj)}
                  disabled={isInspecting}
                  aria-label={obj.accessibilityLabel}
                  className={`group relative flex items-center justify-center cursor-pointer transition-transform duration-200 focus:outline-none ${
                    isInspected
                      ? 'scale-100 hover:scale-110'
                      : isLocked
                        ? 'opacity-50 hover:scale-100 cursor-not-allowed'
                        : 'scale-100 hover:scale-115 active:scale-95'
                  }`}
                >
                  {/* Pulsing radar rings for uninspected clues */}
                  {!isInspected && !isLocked && (
                    <span className="absolute w-12 h-12 rounded-full bg-[#D5A45B]/20 animate-ping pointer-events-none" />
                  )}

                  {/* Hotspot Outer Ring & Badge */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                      isInspected
                        ? 'bg-[#1A2E22] border-[#78A88F] text-[#78A88F] shadow-[#78A88F]/20'
                        : isLocked
                          ? 'bg-[#25272B] border-[#444852] text-[#9C9B98]'
                          : 'bg-[#1A1C20] border-[#D5A45B] text-[#D5A45B] shadow-[#D5A45B]/30 hover:border-white'
                    }`}
                  >
                    {isInspected ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </div>

                  {/* Hotspot Label Tooltip */}
                  <div
                    className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1C20]/95 backdrop-blur border px-2.5 py-1 rounded text-[11px] font-medium shadow-xl pointer-events-none transition-all duration-150 ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'
                    } ${
                      isInspected
                        ? 'border-[#78A88F]/50 text-[#78A88F]'
                        : isLocked
                          ? 'border-[#444852] text-[#9C9B98]'
                          : 'border-[#D5A45B]/60 text-[#F2EFE8]'
                    }`}
                  >
                    <span className="font-semibold">{obj.name}</span>
                    <span className="block text-[9px] text-[#9C9B98]">
                      {isInspected
                        ? 'Inspected — Click to review'
                        : isLocked
                          ? 'Locked — Inspection limit reached'
                          : 'Click to examine clue'}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* Accessible List View Fallback */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {caseData.objects.map((obj) => {
            const isInspected = inspectedIds.includes(obj.id);
            const isLocked = isLimitReached && !isInspected;

            return (
              <div
                key={obj.id}
                onClick={() => !isLocked && handleObjectClick(obj)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isInspected
                    ? 'bg-[#1A2E22]/30 border-[#78A88F]/40 hover:border-[#78A88F]'
                    : isLocked
                      ? 'bg-[#1A1C20]/50 border-[#33363D] opacity-60 cursor-not-allowed'
                      : 'bg-[#1A1C20] border-[#33363D] hover:border-[#D5A45B]/60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-[#F2EFE8]">
                      {obj.name}
                    </span>
                    {isInspected && (
                      <span className="text-[10px] bg-[#78A88F]/20 text-[#78A88F] px-1.5 py-0.2 rounded border border-[#78A88F]/40">
                        Discovered
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9C9B98]">{obj.description}</p>
                </div>

                <div className="shrink-0 mt-0.5">
                  {isInspected ? (
                    <CheckCircle2 className="w-5 h-5 text-[#78A88F]" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4 text-[#9C9B98]" />
                  ) : (
                    <button className="bg-[#D5A45B] text-[#101114] text-xs font-bold px-2.5 py-1 rounded hover:bg-[#B88942] cursor-pointer">
                      Inspect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Scene Status & Navigation Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-[#9C9B98]">
          <Info className="w-4 h-4 text-[#D5A45B] shrink-0" />
          <span>
            Discovered <strong>{inspectedIds.length}</strong> of 3 clues.
            {isLimitReached && (
              <span className="text-[#D5A45B] ml-1 font-semibold">
                Inspection limit reached! Time to formulate your deduction.
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onGoToBoard}
            className="flex-1 sm:flex-none bg-[#25272B] hover:bg-[#33363D] text-[#F2EFE8] px-4 py-2.5 rounded text-xs font-medium border border-[#33363D] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Review Evidence ({inspectedIds.length})</span>
          </button>

          <button
            onClick={onGoToDeduce}
            className="flex-1 sm:flex-none bg-[#D5A45B] hover:bg-[#B88942] text-[#101114] px-5 py-2.5 rounded text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>Final Deduction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
