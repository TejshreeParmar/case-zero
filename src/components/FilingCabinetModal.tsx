import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FolderArchive, 
  Award, 
  CheckCircle2, 
  Trash2, 
  ShieldCheck, 
  FileCode, 
  Sparkles 
} from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { CASES } from '../data/casesData';
import { sound } from '../audio/soundEngine';

interface FilingCabinetModalProps {
  profile: PlayerProfile;
  onClose: () => void;
  onResetProgress: () => void;
}

export const FilingCabinetModal: React.FC<FilingCabinetModalProps> = ({
  profile,
  onClose,
  onResetProgress
}) => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'cases'>('achievements');
  const [confirmReset, setConfirmReset] = useState(false);

  const completedCases = CASES.filter((c) => profile.casesCompleted.includes(c.id));

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-slate-950 select-none overflow-hidden font-terminal">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-4 bg-slate-900/90 px-4 py-2">
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
            <FolderArchive className="w-4 h-4 text-cyan-400" />
            <span className="font-pixel text-xs text-cyan-400">
              COLD CASE ARCHIVE & BADGES
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('achievements');
            }}
            className={`px-3 py-1 font-pixel text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'achievements'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>BADGES ({profile.achievements.length})</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('cases');
            }}
            className={`px-3 py-1 font-pixel text-xs flex items-center gap-1.5 border transition-all ${
              activeTab === 'cases'
                ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                : 'border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>CLOSED CASES ({completedCases.length})</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 w-full max-w-5xl mx-auto overflow-y-auto">
        {activeTab === 'achievements' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.achievements.map((ach) => (
              <div 
                key={ach.id}
                className="pixel-card p-4 border-slate-700 bg-slate-900/80 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                    <Sparkles className="w-5 h-5 text-cyan-300" />
                  </div>
                  <h4 className="font-terminal text-xl text-slate-100 font-bold mb-1">
                    {ach.title}
                  </h4>
                  <p className="font-terminal text-sm text-slate-400 leading-snug">
                    {ach.description}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800 text-[10px] font-pixel text-slate-500 flex items-center justify-between">
                  <span>UNLOCKED</span>
                  <span className="text-cyan-400 font-terminal text-xs">
                    {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {completedCases.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-terminal text-xl bg-slate-900/40 border border-slate-800">
                NO CLOSED CASES ARCHIVED YET. COMPLETE AN INVESTIGATION AT THE COMPUTER TERMINAL!
              </div>
            ) : (
              completedCases.map((c) => (
                <div 
                  key={c.id}
                  className="pixel-card p-4 border-slate-700 bg-slate-900/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-xs text-amber-400">{c.number}</span>
                        <span className="text-slate-100 font-bold text-xl font-terminal">{c.title}</span>
                      </div>
                      <span className="text-xs text-slate-400">Client: {c.client || 'Bureau Archive'} | Solution verified</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-950 border border-emerald-500 text-emerald-400 font-pixel text-xs">
                    CASE SOLVED
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Footer & Reset Progress Button */}
      <div className="w-full max-w-5xl mx-auto pt-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-pixel">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>CURRENT RANK: {profile.rank.toUpperCase()}</span>
        </div>

        <div>
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-xs font-pixel text-red-500 hover:text-red-400 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>RESET SAVED PROGRESS</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-pixel text-red-400">CONFIRM RESET?</span>
              <button
                onClick={() => {
                  sound.playConfirm();
                  onResetProgress();
                  setConfirmReset(false);
                }}
                className="btn-pixel btn-danger py-1 px-3 text-xs"
              >
                YES, RESET
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="btn-pixel btn-secondary py-1 px-2 text-xs"
              >
                CANCEL
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
