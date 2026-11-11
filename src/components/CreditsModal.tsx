import React from 'react';
import { ArrowLeft, Award, Terminal, Code2, Sparkles } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface CreditsModalProps {
  onClose: () => void;
}

export const CreditsModal: React.FC<CreditsModalProps> = ({ onClose }) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-slate-950 select-none overflow-y-auto font-terminal">
      {/* Top Header */}
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6 bg-slate-900/90 px-4 py-2">
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
            <Award className="w-4 h-4 text-amber-400" />
            <h2 className="font-pixel text-xs text-amber-400">
              PROJECT CREDITS & ACKNOWLEDGEMENTS
            </h2>
          </div>
        </div>
      </div>

      {/* Main Credits Card */}
      <div className="w-full max-w-3xl mx-auto pixel-card p-6 border-slate-700 bg-slate-900/90 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_#00ff9d]">
          <Terminal className="w-6 h-6" />
        </div>

        <h1 className="font-pixel text-2xl text-emerald-400 neon-glow mb-2">
          BUG HUNTER
        </h1>
        <h3 className="font-terminal text-xl text-amber-400 mb-6">
          — The Debugging Detective —
        </h3>

        <div className="max-w-xl text-slate-300 text-lg leading-relaxed mb-6 font-terminal">
          A 2D browser-based detective puzzle game combining software engineering concepts, noir storytelling, and interactive logic challenges.
        </div>

        {/* Roles & Tech Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left my-4 font-terminal">
          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="font-pixel text-[10px] text-emerald-400 block mb-1">
              GAMEPLAY & LOGIC DESIGN
            </span>
            <span className="text-slate-200 text-base">Detective Case Engine & Compiler Puzzles</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="font-pixel text-[10px] text-cyan-400 block mb-1">
              FRONTEND & USER INTERFACE
            </span>
            <span className="text-slate-200 text-base">React, TypeScript, CSS & CRT Post-Processing</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="font-pixel text-[10px] text-amber-400 block mb-1">
              2D EXPLORATION & GRAPHICS
            </span>
            <span className="text-slate-200 text-base">HTML5 Canvas Pixel-Art Engine</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800">
            <span className="font-pixel text-[10px] text-pink-400 block mb-1">
              AUDIO SYNTHESIS
            </span>
            <span className="text-slate-200 text-base">Web Audio API Procedural Chiptune Synthesizer</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 text-sm flex items-center justify-center gap-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>BUILT FOR COLLEGE COMPUTER SCIENCE & SOFTWARE ENGINEERING PROJECT</span>
          <Sparkles className="w-4 h-4 text-amber-400" />
        </div>
      </div>

      <div className="w-full text-center py-4 text-slate-600 text-xs font-pixel">
        VER 1.0.0 // ZERO EXTERNAL ASSET DEPENDENCIES // 100% OFFLINE READY
      </div>
    </div>
  );
};
