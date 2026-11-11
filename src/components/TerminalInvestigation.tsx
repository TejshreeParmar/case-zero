import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Terminal, 
  FileText, 
  Lightbulb, 
  Layers, 
  ShieldAlert, 
  Code2,
  Check,
  CheckSquare
} from 'lucide-react';
import { MissionData } from '../types/game';
import { JavaCodeEditor } from './JavaCodeEditor';
import { sound } from '../audio/soundEngine';

interface TerminalInvestigationProps {
  missionData: MissionData;
  onSolveCase: (stats: { wrongAttempts: number; hintsUsed: number; timeSpentSeconds: number }) => void;
  onBackToOffice: () => void;
  onOpenBoard: () => void;
}

export const TerminalInvestigation: React.FC<TerminalInvestigationProps> = ({
  missionData,
  onSolveCase,
  onBackToOffice,
  onOpenBoard
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'code' | 'evidence'>('brief');
  const [revealedHintTier, setRevealedHintTier] = useState<number>(0);
  const [cluesChecked, setCluesChecked] = useState<{ [idx: number]: boolean }>({ 0: true });

  const handleRevealNextHint = () => {
    if (revealedHintTier < missionData.hints.length) {
      sound.playClick();
      setRevealedHintTier((prev) => prev + 1);
    }
  };

  const toggleClue = (idx: number) => {
    sound.playTerminalKey();
    setCluesChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2.5 sm:p-5 bg-slate-950 select-none overflow-hidden font-terminal">
      {/* Top Bar */}
      <div className="w-full flex items-center justify-between border-b-2 border-emerald-500/40 pb-2 mb-2 bg-slate-900/90 px-3 py-1.5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playBack();
              onBackToOffice();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-1 px-2.5 text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>OFFICE</span>
          </button>

          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-pixel text-xs text-emerald-400">
              JAVA TERMINAL // {missionData.number}: {missionData.title.toUpperCase()}
            </span>
            <span className="hidden md:inline px-2 py-0.5 bg-slate-800 text-[10px] text-amber-400 font-pixel border border-slate-700">
              +{missionData.xpReward} XP
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('brief');
            }}
            className={`px-3 py-1 font-pixel text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'brief'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. INVESTIGATE</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('code');
            }}
            className={`px-3 py-1 font-pixel text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'code'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">2. JAVA STUDIO</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('evidence');
            }}
            className={`px-3 py-1 font-pixel text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'evidence'
                ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">3. EVIDENCE</span>
            <span className="text-[10px] bg-slate-800 px-1 rounded-full">
              {missionData.evidence.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenBoard();
            }}
            className="btn-pixel btn-secondary py-1 px-2.5 text-xs hidden lg:flex items-center gap-1.5 ml-2"
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>BOARD</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Viewport */}
      <div className="flex-1 w-full max-w-7xl mx-auto overflow-y-auto pr-1">
        {/* TAB 1: INCIDENT BRIEFING & CLUE CHECKLIST */}
        {activeTab === 'brief' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start animate-fade-in">
            {/* Story & Incident Details (7 cols) */}
            <div className="lg:col-span-7 pixel-card p-5 border-emerald-900 bg-slate-900/90 flex flex-col gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 text-amber-400 font-pixel text-xs">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>INCIDENT DOSSIER // {missionData.level}</span>
                </div>
                <h2 className="font-terminal text-3xl text-slate-100 font-bold mb-0.5">
                  {missionData.title}
                </h2>
                <span className="text-slate-400 text-sm">
                  Client: <strong className="text-slate-200">{missionData.client}</strong> | Target: <strong className="text-emerald-400">{missionData.systemName}</strong>
                </span>
              </div>

              <div className="p-3.5 bg-slate-950 border border-slate-800 text-slate-300 text-base leading-relaxed">
                {missionData.storyline}
              </div>

              {/* Objectives */}
              <div>
                <h4 className="font-pixel text-xs text-cyan-400 mb-2">
                  INVESTIGATION OBJECTIVES:
                </h4>
                <div className="flex flex-col gap-1.5">
                  {missionData.investigationObjectives.map((obj, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-950/60 p-2 border border-slate-800">
                      <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-[10px] flex items-center justify-center font-pixel">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready to Code CTA */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-terminal">
                  Topic: <strong className="text-emerald-400">{missionData.topic}</strong>
                </span>
                <button
                  onClick={() => {
                    sound.playConfirm();
                    setActiveTab('code');
                  }}
                  className="btn-pixel py-2.5 px-5 text-xs flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4" />
                  <span>OPEN JAVA CODE STUDIO</span>
                </button>
              </div>
            </div>

            {/* Clues & Progressive Hints (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Clues Box */}
              <div className="pixel-card p-4 border-slate-700 bg-slate-900/90">
                <h4 className="font-pixel text-xs text-amber-400 mb-2 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-amber-400" />
                  <span>DISCOVERED INVESTIGATION CLUES:</span>
                </h4>
                <div className="flex flex-col gap-2">
                  {missionData.clues.map((clue, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleClue(idx)}
                      className={`p-2.5 border text-sm font-terminal cursor-pointer transition-colors flex items-start gap-2.5 ${
                        cluesChecked[idx]
                          ? 'border-emerald-500/50 bg-emerald-950/20 text-slate-200'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={!!cluesChecked[idx]}
                        readOnly
                        className="accent-emerald-400 mt-0.5"
                      />
                      <span>{clue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Progressive Hints Section */}
              <div className="pixel-card p-4 border-slate-700 bg-slate-900/90">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-pixel text-xs text-yellow-400 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-yellow-400" />
                    <span>PROGRESSIVE HINTS ({revealedHintTier}/3)</span>
                  </h4>

                  {revealedHintTier < missionData.hints.length ? (
                    <button
                      onClick={handleRevealNextHint}
                      className="text-[10px] font-pixel text-amber-400 hover:text-amber-300 border border-amber-600/50 px-2 py-0.5 bg-amber-950/30"
                    >
                      HINT {revealedHintTier + 1} (-{missionData.hintPenalty} XP)
                    </button>
                  ) : (
                    <span className="text-[10px] font-pixel text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>ALL UNLOCKED</span>
                    </span>
                  )}
                </div>

                {revealedHintTier === 0 ? (
                  <p className="text-slate-500 text-xs font-terminal p-2 bg-slate-950 border border-slate-800">
                    Hints are optional. Unlock them sequentially if you need guidance on the algorithm or Java syntax.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {missionData.hints.slice(0, revealedHintTier).map((hint, i) => (
                      <div key={i} className="p-2.5 bg-amber-950/30 border border-amber-600/40 text-amber-200 text-xs sm:text-sm font-terminal flex items-start gap-2">
                        <span className="font-pixel text-[10px] text-amber-400 mt-0.5">#{i + 1}</span>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JAVA CODE STUDIO (The Editor) */}
        {activeTab === 'code' && (
          <div className="w-full flex flex-col gap-3 animate-fade-in">
            <JavaCodeEditor
              mission={missionData}
              hintsUsedCount={revealedHintTier}
              onSuccess={onSolveCase}
            />
          </div>
        )}

        {/* TAB 3: EVIDENCE FILES */}
        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            {missionData.evidence.map((ev) => (
              <div 
                key={ev.id}
                className="pixel-card p-4 border-slate-700 bg-slate-900/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span className="font-pixel text-xs text-amber-400 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      {ev.title}
                    </span>
                    <span className="text-xs text-slate-500 font-terminal">
                      {ev.timestamp}
                    </span>
                  </div>
                  <pre className="font-code text-xs sm:text-sm text-emerald-300 bg-slate-950 p-3 border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {ev.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
