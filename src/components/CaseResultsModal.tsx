import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  Star, 
  Clock, 
  Lightbulb, 
  ShieldAlert 
} from 'lucide-react';
import { CaseResult } from '../types/game';
import { sound } from '../audio/soundEngine';

interface CaseResultsModalProps {
  result: CaseResult;
  hasNextCase: boolean;
  onReturnToOffice: () => void;
  onNextCase: () => void;
}

export const CaseResultsModal: React.FC<CaseResultsModalProps> = ({
  result,
  hasNextCase,
  onReturnToOffice,
  onNextCase
}) => {
  useEffect(() => {
    sound.playSuccess();
    // Confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff9d', '#38bdf8', '#f59e0b', '#ffffff']
      });
    } catch {
      // Confetti fallback
    }
  }, []);

  const getGradeBadge = (grade: 'S' | 'A' | 'B' | 'C') => {
    switch (grade) {
      case 'S':
        return { text: 'GRADE: S — MASTER SLEUTH', color: 'text-amber-400 border-amber-400 bg-amber-950/60' };
      case 'A':
        return { text: 'GRADE: A — SENIOR DETECTIVE', color: 'text-emerald-400 border-emerald-400 bg-emerald-950/60' };
      case 'B':
        return { text: 'GRADE: B — INVESTIGATOR', color: 'text-cyan-400 border-cyan-400 bg-cyan-950/60' };
      default:
        return { text: 'GRADE: C — JUNIOR DEBUGGER', color: 'text-slate-400 border-slate-600 bg-slate-900/60' };
    }
  };

  const badge = getGradeBadge(result.grade);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 select-none overflow-y-auto font-terminal">
      {/* Result Card */}
      <div className="w-full max-w-xl pixel-card p-6 sm:p-8 border-2 border-emerald-500 bg-slate-900 shadow-[0_0_60px_rgba(0,255,157,0.25)] flex flex-col items-center text-center animate-fade-in">
        {/* Clearance Stamp */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border-2 border-emerald-400 bg-emerald-950 text-emerald-400 font-pixel text-xs mb-4 shadow-[0_0_15px_#00ff9d]">
          <CheckCircle className="w-4 h-4" />
          <span>INCIDENT RESOLVED // CASE CLOSED</span>
        </div>

        <h1 className="font-pixel text-2xl sm:text-3xl text-slate-100 mb-2">
          {result.caseTitle}
        </h1>

        {/* Grade Badge */}
        <div className={`px-4 py-1 border font-pixel text-xs mb-6 ${badge.color}`}>
          {badge.text}
        </div>

        {/* Score Breakdown Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 font-terminal text-left">
          <div className="p-3 bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 text-sm">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              SCORE EARNED
            </span>
            <strong className="text-amber-400 font-pixel text-sm">
              +{result.scoreEarned} PTS
            </strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 text-sm">
              <Clock className="w-4 h-4 text-cyan-400" />
              INVESTIGATION TIME
            </span>
            <strong className="text-slate-200 font-terminal text-lg">
              {result.timeSpentSeconds}s
            </strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 text-sm">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              WRONG ATTEMPTS
            </span>
            <strong className="text-slate-200 font-terminal text-lg">
              {result.wrongAttempts}
            </strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5 text-sm">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              HINTS ACCESSED
            </span>
            <strong className="text-slate-200 font-terminal text-lg">
              {result.hintsUsedCount}
            </strong>
          </div>
        </div>

        {/* Evaluation Summary */}
        <p className="font-terminal text-lg text-slate-300 leading-relaxed mb-6 bg-slate-950/80 p-3.5 border border-slate-800">
          "Your forensic analysis identified the root flaw, verified the compiler logic, and prevented critical system failure. Outstanding investigative diligence."
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToOffice();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary w-full py-3 text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETURN TO OFFICE</span>
          </button>

          {hasNextCase && (
            <button
              onClick={() => {
                sound.playConfirm();
                onNextCase();
              }}
              onMouseEnter={() => sound.playHover()}
              className="btn-pixel w-full py-3 text-xs flex items-center justify-center gap-2"
            >
              <span>NEXT CASE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
