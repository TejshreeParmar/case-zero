import React from 'react';
import { ArrowLeft, Pin, HelpCircle, Terminal } from 'lucide-react';
import { MissionData } from '../types/game';
import { sound } from '../audio/soundEngine';

interface InvestigationBoardProps {
  caseData: MissionData;
  onClose: () => void;
  onOpenTerminal: () => void;
}

export const InvestigationBoard: React.FC<InvestigationBoardProps> = ({
  caseData,
  onClose,
  onOpenTerminal
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-slate-950 select-none overflow-hidden font-terminal">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between border-b-2 border-amber-600/50 pb-3 mb-4 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playBack();
              onClose();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-1 px-2.5 text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN</span>
          </button>

          <div className="flex items-center gap-2">
            <Pin className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="font-pixel text-xs text-amber-400">
              EVIDENCE CORKBOARD // {caseData.number}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenTerminal();
            }}
            className="btn-pixel py-1 px-3 text-xs flex items-center gap-1.5"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>GO TO CODE TERMINAL</span>
          </button>
        </div>
      </div>

      {/* The Corkboard Workspace */}
      <div className="relative flex-1 w-full max-w-6xl mx-auto rounded-md p-6 overflow-hidden border-8 border-amber-900 shadow-[inset_0_0_60px_rgba(0,0,0,0.8),0_10px_40px_rgba(0,0,0,0.9)]"
        style={{
          backgroundColor: '#854d0e',
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(161, 98, 7, 0.9) 0%, rgba(113, 63, 18, 0.95) 100%),
            repeating-radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 0, rgba(0,0,0,0.05) 2px, transparent 2px, transparent 4px)
          `
        }}
      >
        {/* Decorative Red Strings (Connecting SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <line x1="22%" y1="28%" x2="52%" y2="40%" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" />
          <line x1="52%" y1="40%" x2="78%" y2="30%" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" />
          <line x1="52%" y1="40%" x2="48%" y2="76%" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="6 3" />
          <line x1="22%" y1="28%" x2="18%" y2="72%" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 3" />
        </svg>

        {/* Pinned Items Layout */}
        <div className="relative w-full h-full z-20 flex flex-wrap items-start justify-around gap-6 p-4">
          {/* 1. Case Incident Title Polaroid */}
          <div className="w-64 bg-slate-100 text-slate-900 p-4 shadow-2xl transform -rotate-2 border border-slate-300 relative">
            {/* Red Pushpin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md" />
            <div className="bg-slate-900 text-emerald-400 font-pixel text-[10px] p-2 text-center mb-3">
              CLIENT // {(caseData.client || 'Bureau Record').toUpperCase()}
            </div>
            <div className="font-terminal text-lg font-bold text-slate-800 leading-snug">
              "{caseData.title}"
            </div>
            <div className="text-xs text-slate-600 font-terminal mt-1">
              Incident Target: {caseData.systemName || 'Java Source Code'}
            </div>
          </div>

          {/* 2. Key Evidence Card */}
          <div className="w-80 bg-amber-100 text-slate-900 p-4 shadow-2xl transform rotate-1 border border-amber-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md" />
            <div className="flex items-center gap-1 text-red-600 font-pixel text-[10px] mb-2">
              <Pin className="w-3 h-3 fill-red-600" />
              <span>KEY EVIDENCE LOG</span>
            </div>
            <pre className="font-code text-xs text-slate-800 bg-white/80 p-2.5 border border-slate-300 overflow-x-auto whitespace-pre-wrap leading-tight">
              {caseData.evidence[0]?.content || caseData.storyline}
            </pre>
          </div>

          {/* 3. Investigation Objective Card */}
          <div className="w-64 bg-slate-100 text-slate-900 p-4 shadow-2xl transform rotate-3 border border-slate-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md" />
            <div className="bg-slate-800 text-amber-300 font-pixel text-[10px] p-1.5 text-center mb-2">
              MISSION BRIEF
            </div>
            <p className="font-terminal text-sm text-slate-700 italic leading-snug">
              {caseData.storyline}
            </p>
          </div>

          {/* 4. Yellow Sticky Clues Card */}
          <div className="w-96 bg-yellow-200 text-slate-900 p-4 shadow-2xl transform -rotate-1 border border-yellow-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-2 border-red-900 shadow-md" />
            <div className="font-pixel text-xs text-amber-900 font-bold mb-2 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-900" />
              <span>DETECTIVE'S CLUE CHECKLIST</span>
            </div>
            <ul className="flex flex-col gap-1.5 font-terminal text-base text-slate-800 list-disc pl-5">
              {caseData.clues.map((clue: string, idx: number) => (
                <li key={idx} className="leading-snug">
                  {clue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
