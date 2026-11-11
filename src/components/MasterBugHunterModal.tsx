import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { sound } from '../audio/soundEngine';

interface MasterBugHunterModalProps {
  profile: PlayerProfile;
  onReturnToOffice: () => void;
  onReturnToMenu: () => void;
}

export const MasterBugHunterModal: React.FC<MasterBugHunterModalProps> = ({
  profile,
  onReturnToOffice,
  onReturnToMenu
}) => {
  useEffect(() => {
    sound.playSuccess();
    // Grand finale confetti blast
    try {
      const end = Date.now() + 3000;
      const colors = ['#00ff9d', '#f59e0b', '#38bdf8', '#ef4444', '#ffffff'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-950 select-none overflow-y-auto font-terminal">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(0, 255, 157, 0.4) 0%, transparent 70%)'
        }}
      />

      <div className="w-full max-w-2xl pixel-card p-6 sm:p-10 border-4 border-amber-400 bg-slate-900 shadow-[0_0_80px_rgba(245,158,11,0.4)] flex flex-col items-center text-center z-10 animate-fade-in">
        {/* Grand Title Banner */}
        <div className="w-16 h-16 rounded-full bg-amber-950 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-[0_0_25px_#f59e0b] animate-bounce">
          <Trophy className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1 bg-amber-950/80 border border-amber-400 text-amber-300 font-pixel text-xs mb-2 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ALL 20 JAVA CASES SOLVED // BUREAU COMMENDATION</span>
        </div>

        <h1 className="font-pixel text-3xl sm:text-5xl text-amber-400 neon-glow mb-2">
          MASTER BUG HUNTER
        </h1>

        <p className="font-terminal text-2xl text-emerald-400 mb-6">
          "The Supreme Architect of Java Debugging"
        </p>

        <p className="font-terminal text-lg text-slate-300 max-w-lg mb-8 leading-relaxed bg-slate-950/80 p-4 border border-slate-800">
          From primitive integer divisions and recursion limits to concurrent race conditions and the subtle contracts of HashSet identity—you have resolved every single technology incident in the city!
        </p>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 text-left font-terminal">
          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-xs font-pixel">CASES SOLVED</span>
            <strong className="text-emerald-400 text-2xl font-terminal">20 / 20</strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-xs font-pixel">TOTAL XP</span>
            <strong className="text-amber-400 text-2xl font-terminal">{profile.score} XP</strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-xs font-pixel">HINTS ACCESSED</span>
            <strong className="text-cyan-400 text-2xl font-terminal">{profile.hintsUsed}</strong>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-xs font-pixel">FINAL RANK</span>
            <strong className="text-yellow-300 text-xl font-terminal">CHIEF SLEUTH</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onReturnToOffice();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel w-full sm:w-auto py-3 px-6 text-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>RETURN TO DETECTIVE OFFICE</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReturnToMenu();
            }}
            onMouseEnter={() => sound.playHover()}
            className="btn-pixel btn-secondary w-full sm:w-auto py-3 px-6 text-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
