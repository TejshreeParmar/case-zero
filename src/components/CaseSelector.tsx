import React, { useState } from 'react';
import { 
  FolderLock, 
  FolderCheck, 
  FolderOpen, 
  ArrowLeft, 
  ShieldAlert, 
  Play, 
  Terminal, 
  CheckCircle2, 
  Star,
  Filter,
  Code2
} from 'lucide-react';
import { MissionData, PlayerProfile } from '../types/game';
import { CASES } from '../data/casesData';
import { sound } from '../audio/soundEngine';

interface CaseSelectorProps {
  profile: PlayerProfile;
  onSelectCase: (missionData: MissionData) => void;
  onBack: () => void;
}

type FilterType = 'all' | 'level1' | 'level2' | 'level3' | 'level4' | 'completed' | 'locked';

export const CaseSelector: React.FC<CaseSelectorProps> = ({
  profile,
  onSelectCase,
  onBack
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    profile.activeCaseId || CASES[0].id
  );
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const selectedMission = CASES.find((c) => c.id === selectedCaseId) || CASES[0];

  const isMissionUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const previousMission = CASES[index - 1];
    return profile.casesCompleted.includes(previousMission.id);
  };

  const isMissionCompleted = (missionId: string): boolean => {
    return profile.casesCompleted.includes(missionId);
  };

  // Filter missions
  const filteredMissions = CASES.filter((m, idx) => {
    const unlocked = isMissionUnlocked(idx);
    const completed = isMissionCompleted(m.id);

    if (activeFilter === 'completed') return completed;
    if (activeFilter === 'locked') return !unlocked;
    if (activeFilter === 'level1') return m.missionNumberInt >= 1 && m.missionNumberInt <= 5;
    if (activeFilter === 'level2') return m.missionNumberInt >= 6 && m.missionNumberInt <= 10;
    if (activeFilter === 'level3') return m.missionNumberInt >= 11 && m.missionNumberInt <= 15;
    if (activeFilter === 'level4') return m.missionNumberInt >= 16 && m.missionNumberInt <= 20;
    return true; // 'all'
  });

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-3 sm:p-6 select-none bg-slate-950 overflow-y-auto font-terminal">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-800 pb-3 mb-4 gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playBack();
              onBack();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary py-1.5 px-3 text-xs flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>OFFICE</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-pixel text-lg sm:text-2xl text-emerald-400 neon-glow">
              JAVA CODING MISSIONS DOSSIER (20 ADVENTURES)
            </h1>
            <span className="font-terminal text-sm text-slate-400">
              EXPLORE INCIDENTS, GATHER EVIDENCE, AND SUBMIT WORKING JAVA SOLUTIONS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-terminal text-base">
          <span className="text-slate-400">COMPLETION:</span>
          <span className="text-emerald-400 font-pixel text-sm">
            {profile.casesCompleted.length} / {CASES.length} SOLVED
          </span>
          <span className="text-amber-400 font-pixel text-sm">
            ({Math.round((profile.casesCompleted.length / CASES.length) * 100)}%)
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="w-full max-w-7xl mx-auto flex items-center gap-1.5 mb-4 overflow-x-auto pb-1 text-xs font-pixel">
        <div className="flex items-center gap-1 text-slate-500 mr-2 flex-shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>LEVEL:</span>
        </div>

        {(['all', 'level1', 'level2', 'level3', 'level4', 'completed', 'locked'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              sound.playClick();
              setActiveFilter(f);
            }}
            className={`px-3 py-1 border transition-all text-[11px] uppercase whitespace-nowrap ${
              activeFilter === f
                ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200 bg-slate-900/60'
            }`}
          >
            {f === 'all' && `ALL (20)`}
            {f === 'level1' && 'LVL 1: ROOKIE (1-5)'}
            {f === 'level2' && 'LVL 2: INVESTIGATOR (6-10)'}
            {f === 'level3' && 'LVL 3: SENIOR (11-15)'}
            {f === 'level4' && 'LVL 4: ELITE (16-20)'}
            {f === 'completed' && `SOLVED (${profile.casesCompleted.length})`}
            {f === 'locked' && 'LOCKED'}
          </button>
        ))}
      </div>

      {/* Main Layout: Left Scrollable Missions List, Right Mission Briefing */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start overflow-hidden">
        {/* Left Column: Mission Cards List (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-2.5 max-h-[70vh] overflow-y-auto pr-2">
          {filteredMissions.map((m) => {
            const index = CASES.findIndex((item) => item.id === m.id);
            const unlocked = isMissionUnlocked(index);
            const completed = isMissionCompleted(m.id);
            const isSelected = m.id === selectedMission.id;

            return (
              <div
                key={m.id}
                onClick={() => {
                  if (unlocked) {
                    sound.playClick();
                    setSelectedCaseId(m.id);
                  } else {
                    sound.playError();
                  }
                }}
                onMouseEnter={() => {
                  if (unlocked) sound.playHover();
                }}
                className={`p-3.5 border-2 transition-all cursor-pointer relative ${
                  !unlocked
                    ? 'border-slate-800/80 bg-slate-900/30 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'border-emerald-400 bg-emerald-950/30 shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {/* Solved Stamp */}
                {completed && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-emerald-950 border border-emerald-400 text-emerald-300 font-pixel text-[10px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>SOLVED</span>
                  </div>
                )}

                {/* Locked Stamp */}
                {!unlocked && (
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 font-pixel text-[10px]">
                    <FolderLock className="w-3 h-3 text-slate-500" />
                    <span>LOCKED</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 border border-slate-700 text-slate-300 flex-shrink-0 mt-0.5">
                    {completed ? (
                      <FolderCheck className="w-4 h-4 text-emerald-400" />
                    ) : unlocked ? (
                      <FolderOpen className="w-4 h-4 text-amber-400" />
                    ) : (
                      <FolderLock className="w-4 h-4 text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 pr-14">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-pixel text-[11px] text-amber-400">
                        {m.number}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className={`text-[10px] font-pixel ${
                        m.difficulty === 'Final Boss' ? 'text-red-400' :
                        m.difficulty === 'Hard' ? 'text-orange-400' :
                        m.difficulty === 'Medium' ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {m.difficulty.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-terminal text-xl text-slate-100 font-bold leading-tight">
                      {m.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-xs font-terminal text-slate-400">
                      <Code2 className="w-3 h-3 text-emerald-400" />
                      <span>{m.topic}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredMissions.length === 0 && (
            <div className="p-6 text-center text-slate-500 font-terminal text-lg bg-slate-900/40 border border-slate-800">
              NO MISSIONS FOUND UNDER FILTER: {activeFilter.toUpperCase()}
            </div>
          )}
        </div>

        {/* Right Column: Mission Briefing Card */}
        <div className="lg:col-span-6 pixel-card p-5 border-2 border-slate-700 flex flex-col justify-between bg-slate-900/90 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-3">
              <div>
                <span className="font-pixel text-xs text-amber-400">
                  {selectedMission.level} // {selectedMission.number}
                </span>
                <h2 className="font-terminal text-2xl sm:text-3xl text-emerald-400 neon-glow mt-0.5">
                  {selectedMission.title}
                </h2>
                <span className="font-terminal text-sm text-slate-400 italic">
                  "{selectedMission.subtitle}"
                </span>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 border border-slate-700 text-xs font-pixel text-amber-300">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>+{selectedMission.xpReward} XP</span>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-terminal">
              <div className="p-2 bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">CLIENT AGENCY</span>
                <strong className="text-slate-200 text-base">{selectedMission.client}</strong>
              </div>
              <div className="p-2 bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500 block text-[11px]">TARGET FILE</span>
                <strong className="text-emerald-400 text-base">{selectedMission.systemName}</strong>
              </div>
              <div className="p-2 bg-slate-950/80 border border-slate-800 col-span-2">
                <span className="text-slate-500 block text-[11px]">JAVA TOPIC & CONCEPT</span>
                <strong className="text-cyan-400 text-base">{selectedMission.topic}</strong>
              </div>
            </div>

            {/* Incident Storyline */}
            <div className="mb-4">
              <h4 className="font-pixel text-xs text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>MYSTERIOUS INCIDENT BRIEFING</span>
              </h4>
              <p className="font-terminal text-base text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 border border-slate-800">
                {selectedMission.storyline}
              </p>
            </div>

            {/* Programming Task */}
            <div className="mb-4">
              <h4 className="font-pixel text-xs text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>PROGRAMMING OBJECTIVE</span>
              </h4>
              <p className="font-terminal text-sm text-slate-200 bg-slate-950/60 p-3 border border-slate-800 leading-relaxed">
                {selectedMission.problemStatement}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
            <button
              onClick={() => {
                sound.playConfirm();
                onSelectCase(selectedMission);
              }}
              onMouseEnter={() => sound.playHover()}
              className="btn-pixel w-full sm:w-auto py-2.5 px-6 text-xs flex items-center justify-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START INVESTIGATION & CODING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
