
import React, { useEffect, useState } from 'react';
import {
  Play,
  RotateCcw,
  FolderArchive,
  Settings as SettingsIcon,
  Award,
  Terminal,
  ShieldCheck,
  Cpu,
  Volume2,
  VolumeX,
  Zap,
  Radio
} from 'lucide-react';
import { PlayerProfile } from '../types/game';
import { sound } from '../audio/soundEngine';

interface MainMenuProps {
  profile: PlayerProfile;
  onNewGame: () => void;
  onContinue: () => void;
  onOpenCases: () => void;
  onOpenSettings: () => void;
  onOpenCredits: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  profile,
  onNewGame,
  onContinue,
  onOpenCases,
  onOpenSettings,
  onOpenCredits
}) => {
  const [ambientActive, setAmbientActive] = useState(false);
  const [launching, setLaunching] = useState(false);
  const [typedText, setTypedText] = useState('');

  const briefing =
    'Investigate code incidents. Interrogate software failures. Deduce the faulty syntax and logical anomalies to crack the case.';

  const hasSavedProgress =
    profile.casesCompleted.length > 0 || profile.score > 0;

  useEffect(() => {
    let index = 0;

    const typingInterval = window.setInterval(() => {
      index++;
      setTypedText(briefing.slice(0, index));

      if (index >= briefing.length) {
        window.clearInterval(typingInterval);
      }
    }, 28);

    return () => window.clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (!launching) return;

    const timer = window.setTimeout(() => {
      onNewGame();
    }, 1300);

    return () => window.clearTimeout(timer);
  }, [launching, onNewGame]);

  const handleToggleAudio = () => {
    sound.playClick();
    const active = sound.toggleAmbience();
    setAmbientActive(active);
  };

  const handleNewGame = () => {
    if (launching) return;
    sound.playConfirm();
    setLaunching(true);
  };

  const rainParticles = Array.from({ length: 38 }, (_, i) => ({
    id: i,
    left: (i * 37 + 11) % 100,
    delay: (i * 0.37) % 7,
    duration: 3 + (i % 5) * 0.7,
    height: 12 + (i % 4) * 7
  }));

  return (
    <div className="bh-menu relative w-full h-full flex flex-col items-center justify-between p-5 sm:p-7 select-none overflow-hidden bg-[#02070c]">

      {/* ANIMATED BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="bh-grid absolute inset-0" />
        <div className="bh-scanlines absolute inset-0" />

        <div className="bh-glow bh-glow-one" />
        <div className="bh-glow bh-glow-two" />

        {/* Background City */}
        <div className="bh-city absolute bottom-0 left-0 right-0 flex items-end justify-around">
          {Array.from({ length: 13 }, (_, i) => (
            <div
              key={i}
              className="bh-building relative"
              style={{
                height: `${65 + ((i * 29) % 125)}px`,
                width: `${4 + (i % 3)}%`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              <div className="bh-building-windows">
                {Array.from({ length: 12 }, (_, j) => (
                  <span key={j} style={{ animationDelay: `${(i + j) * 0.3}s` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Rain */}
        {rainParticles.map((drop) => (
          <span
            key={drop.id}
            className="bh-rain"
            style={{
              left: `${drop.left}%`,
              height: `${drop.height}px`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`
            }}
          />
        ))}

        {/* Radar */}
        <div className="bh-radar">
          <div className="bh-radar-ring" />
          <div className="bh-radar-ring bh-radar-ring-two" />
          <div className="bh-radar-sweep" />
          <span className="bh-radar-dot" />
        </div>

        <div className="bh-scanner" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.75)_100%)]" />
      </div>

      {/* HEADER */}
      <div className="relative w-full max-w-6xl flex items-center justify-between z-10 border-b border-emerald-900/60 pb-3 gap-3">

        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_15px_#00ff9d]" />
            <div className="absolute w-6 h-6 rounded-full border border-emerald-400/30 animate-ping" />
          </div>

          <span className="font-terminal text-sm sm:text-base text-emerald-400 tracking-wider">
            CASE ZERO OS // v2.4.0 — READY
          </span>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={handleToggleAudio}
            onMouseEnter={() => sound.playHover()}
            className="bh-audio-button flex items-center gap-2 text-[10px] sm:text-xs font-pixel px-2 sm:px-3 py-2 border border-slate-700 bg-slate-900/80 text-slate-300 transition-all"
            title="Toggle Ambient Audio"
          >
            {ambientActive ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>AMBIENCE: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span>AMBIENCE: OFF</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs font-pixel text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ID: {profile.name}</span>
          </div>
        </div>
      </div>

      {/* MAIN HERO */}
      <div className="relative flex flex-col items-center text-center my-auto z-10 w-full max-w-4xl py-5">

        <div className="bh-label inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 text-[10px] sm:text-xs font-pixel mb-5">
          <Terminal className="w-4 h-4" />
          <span>CYBER-FORENSICS BUREAU // SPECIAL DIVISION</span>
        </div>

        {/* TITLE */}
        <div className="relative">
          <h1
            className="bh-title font-pixel text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-emerald-400 tracking-wider leading-tight"
            data-text="CASE ZERO"
          >
            CASE ZERO
          </h1>

          <div className="bh-title-line mx-auto mt-3" />
        </div>

        <p className="bh-subtitle font-pixel text-xs sm:text-sm md:text-base text-amber-400 tracking-[0.2em] mt-5 mb-5">
          — EVERY MYSTERY BEGINS SOMEWHERE. —
        </p>

        {/* TYPING BRIEFING */}
        <div className="min-h-[65px] max-w-xl px-4 mb-5">
          <p className="font-terminal text-base sm:text-lg text-slate-300 leading-relaxed">
            {typedText}
            <span className="bh-cursor text-emerald-400">▋</span>
          </p>
        </div>

        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-4 sm:gap-7 mb-5 text-[9px] sm:text-[10px] font-pixel text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            SYSTEM ONLINE
          </span>

          <span className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            SIGNAL ACTIVE
          </span>

          <span className="hidden sm:flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            READY FOR CASES
          </span>
        </div>

        {/* MENU BUTTONS */}
        <div className="flex flex-col gap-2.5 w-full max-w-[340px]">

          <button
            onClick={handleNewGame}
            onMouseEnter={() => sound.playHover()}
            disabled={launching}
            className="bh-menu-button bh-primary-button w-full py-3.5 text-sm flex items-center justify-center gap-3"
          >
            <Play className="w-4 h-4" />
            <span>NEW GAME</span>
            <span className="bh-button-arrow">▸</span>
          </button>

          <button
            onClick={() => {
              if (hasSavedProgress) {
                sound.playConfirm();
                onContinue();
              }
            }}
            onMouseEnter={() => sound.playHover()}
            disabled={!hasSavedProgress}
            className={`bh-menu-button w-full py-3.5 text-sm flex items-center justify-center gap-3 ${
              !hasSavedProgress ? 'opacity-35 cursor-not-allowed' : 'bh-amber-button'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              CONTINUE {hasSavedProgress ? `(${profile.casesCompleted.length} SOLVED)` : ''}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenCases();
            }}
            onMouseEnter={() => sound.playHover()}
            className="bh-menu-button bh-secondary-button w-full py-3 text-xs flex items-center justify-center gap-3"
          >
            <FolderArchive className="w-4 h-4 text-emerald-400" />
            <span>CASE DOSSIERS</span>
          </button>

          <div className="grid grid-cols-2 gap-3 mt-0.5">
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              onMouseEnter={() => sound.playHover()}
              className="bh-menu-button bh-secondary-button py-3 text-xs flex items-center justify-center gap-2"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>SETTINGS</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onOpenCredits();
              }}
              onMouseEnter={() => sound.playHover()}
              className="bh-menu-button bh-secondary-button py-3 text-xs flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>CREDITS</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-slate-500 font-terminal text-xs sm:text-sm border-t border-emerald-900/50 pt-4 z-10 gap-3">

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <span className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-500" />
            DETECTIVE RANK:
            <strong className="text-emerald-400 font-normal">{profile.rank}</strong>
          </span>

          <span className="hidden sm:inline text-slate-700">|</span>

          <span>
            SCORE:
            <strong className="text-amber-400 font-normal ml-1">
              {profile.score} PTS
            </strong>
          </span>
        </div>

        <div className="text-center sm:text-right text-[10px] text-slate-600">
          POWERED BY PHASER 3 + REACT + WEB AUDIO // 2D DETECTIVE ENGINE
        </div>
      </div>

      {/* NEW GAME TRANSITION */}
      {launching && (
        <div className="bh-launch-overlay absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#02070c]">

          <div className="bh-launch-radar mb-7">
            <div className="bh-launch-radar-inner" />
          </div>

          <div className="font-pixel text-emerald-400 text-lg sm:text-2xl tracking-widest mb-3">
            CASE FILE UNLOCKED
          </div>

          <p className="font-terminal text-slate-400 text-base sm:text-lg tracking-wider">
            INITIALIZING INVESTIGATION...
          </p>

          <div className="bh-loading-bar mt-7">
            <div />
          </div>

          <p className="font-pixel text-[10px] text-emerald-700 mt-4">
            ACCESSING BUREAU DATABASE
          </p>
        </div>
      )}

      {/* ANIMATIONS */}
      <style>{`
        .bh-menu { isolation: isolate; }

        .bh-grid {
          opacity: 0.24;
          background-image:
            linear-gradient(to right, rgba(0,255,157,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,255,157,0.3) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: bh-grid-move 18s linear infinite;
        }

        @keyframes bh-grid-move {
          from { background-position: 0 0; }
          to { background-position: 48px 48px; }
        }

        .bh-scanlines {
          opacity: 0.12;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 3px,
            rgba(0,0,0,0.65) 4px
          );
          z-index: 2;
        }

        .bh-glow {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.12;
          animation: bh-glow-pulse 7s ease-in-out infinite alternate;
        }

        .bh-glow-one {
          background: #00ff9d;
          top: 15%;
          left: 10%;
        }

        .bh-glow-two {
          background: #0891b2;
          bottom: 5%;
          right: 8%;
          animation-delay: 2s;
        }

        @keyframes bh-glow-pulse {
          from { transform: scale(0.8); opacity: 0.07; }
          to { transform: scale(1.2); opacity: 0.16; }
        }

        .bh-city {
          height: 190px;
          opacity: 0.4;
          z-index: 0;
        }

        .bh-building {
          background: linear-gradient(to bottom, #0b2530, #071018);
          border: 1px solid rgba(0,255,157,0.14);
          box-shadow: 0 0 15px rgba(0,255,157,0.04);
        }

        .bh-building-windows {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          padding: 9px 5px;
        }

        .bh-building-windows span {
          height: 4px;
          background: rgba(0,255,157,0.45);
          animation: bh-window-blink 4s infinite alternate;
        }

        @keyframes bh-window-blink {
          0%, 65% { opacity: 0.2; }
          75%, 100% { opacity: 0.9; }
        }

        .bh-rain {
          position: absolute;
          top: -30px;
          width: 1px;
          background: linear-gradient(transparent, rgba(0,255,157,0.6));
          animation: bh-rain-fall linear infinite;
          opacity: 0.45;
        }

        @keyframes bh-rain-fall {
          from { transform: translateY(-20px); }
          to { transform: translateY(110vh); }
        }

        .bh-radar {
          position: absolute;
          width: 220px;
          height: 220px;
          top: 42%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          opacity: 0.16;
          pointer-events: none;
        }

        .bh-radar-ring {
          position: absolute;
          inset: 0;
          border: 1px solid #00ff9d;
          border-radius: 50%;
          animation: bh-radar-pulse 4s ease-out infinite;
        }

        .bh-radar-ring-two { animation-delay: 2s; }

        @keyframes bh-radar-pulse {
          0% { transform: scale(0.3); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        .bh-radar-sweep {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            rgba(0,255,157,0.2) 50deg,
            transparent 90deg
          );
          animation: bh-radar-rotate 5s linear infinite;
        }

        @keyframes bh-radar-rotate {
          to { transform: rotate(360deg); }
        }

        .bh-radar-dot {
          position: absolute;
          top: 30%;
          left: 65%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #00ff9d;
          box-shadow: 0 0 10px #00ff9d;
        }

        .bh-scanner {
          position: absolute;
          top: -5%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(0,255,157,0.4), transparent);
          box-shadow: 0 0 12px rgba(0,255,157,0.4);
          animation: bh-scan 9s linear infinite;
          opacity: 0.45;
        }

        @keyframes bh-scan {
          from { transform: translateY(0); }
          to { transform: translateY(110vh); }
        }

        .bh-label {
          box-shadow: 0 0 20px rgba(0,255,157,0.12);
          animation: bh-label-glow 4s ease-in-out infinite;
        }

        @keyframes bh-label-glow {
          50% { box-shadow: 0 0 25px rgba(0,255,157,0.28); }
        }

        .bh-title {
          position: relative;
          text-shadow:
            0 0 5px #00ff9d,
            0 0 15px rgba(0,255,157,0.9),
            0 0 35px rgba(0,255,157,0.45),
            0 0 65px rgba(0,255,157,0.2);
          animation: bh-title-glow 3s ease-in-out infinite alternate;
        }

        .bh-title::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          color: #a7fff0;
          opacity: 0;
          animation: bh-glitch 7s infinite;
          pointer-events: none;
        }

        @keyframes bh-title-glow {
          from { filter: brightness(0.9); }
          to { filter: brightness(1.3); }
        }

        @keyframes bh-glitch {
          0%, 91%, 94%, 100% { opacity: 0; transform: none; }
          92% {
            opacity: 0.8;
            transform: translateX(3px);
            clip-path: inset(20% 0 65% 0);
          }
          93% {
            opacity: 0.7;
            transform: translateX(-3px);
            clip-path: inset(65% 0 15% 0);
          }
        }

        .bh-title-line {
          width: 55%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00ff9d, transparent);
          box-shadow: 0 0 12px #00ff9d;
          animation: bh-line-pulse 3s infinite alternate;
        }

        @keyframes bh-line-pulse {
          from { width: 35%; opacity: 0.5; }
          to { width: 75%; opacity: 1; }
        }

        .bh-subtitle {
          text-shadow: 0 0 12px rgba(245,158,11,0.45);
          animation: bh-subtitle-in 1.2s ease-out both;
        }

        @keyframes bh-subtitle-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .bh-cursor {
          animation: bh-cursor-blink 0.8s steps(2) infinite;
        }

        @keyframes bh-cursor-blink {
          50% { opacity: 0; }
        }

        .bh-menu-button {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(148,163,184,0.4);
          background: rgba(10,18,25,0.88);
          color: #94a3b8;
          font-family: inherit;
          transition: all 0.25s ease;
        }

        .bh-menu-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -110%;
          width: 70%;
          height: 100%;
          transform: skewX(-20deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transition: left 0.5s ease;
        }

        .bh-menu-button:hover::before { left: 150%; }

        .bh-menu-button:hover:not(:disabled) {
          transform: translateY(-3px);
        }

        .bh-primary-button {
          border: 2px solid #00ff9d;
          color: #00ff9d;
          background: rgba(0,255,157,0.07);
          box-shadow: 0 0 12px rgba(0,255,157,0.1), inset 0 0 12px rgba(0,255,157,0.04);
          animation: bh-button-pulse 3s infinite;
        }

        .bh-primary-button:hover {
          background: rgba(0,255,157,0.16);
          box-shadow: 0 0 25px rgba(0,255,157,0.35), inset 0 0 18px rgba(0,255,157,0.12);
        }

        @keyframes bh-button-pulse {
          50% { box-shadow: 0 0 18px rgba(0,255,157,0.2); }
        }

        .bh-button-arrow { animation: bh-arrow 1s ease-in-out infinite; }

        @keyframes bh-arrow {
          50% { transform: translateX(5px); }
        }

        .bh-amber-button:hover {
          color: #fbbf24;
          border-color: #f59e0b;
          box-shadow: 0 0 18px rgba(245,158,11,0.18);
        }

        .bh-secondary-button:hover {
          color: #00ff9d;
          border-color: #00ff9d;
          box-shadow: 0 0 18px rgba(0,255,157,0.15);
        }

        .bh-audio-button:hover {
          border-color: #00ff9d;
          color: #00ff9d;
          box-shadow: 0 0 12px rgba(0,255,157,0.15);
        }

        .bh-launch-overlay {
          animation: bh-overlay-in 0.35s ease-out both;
        }

        @keyframes bh-overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .bh-launch-radar {
          width: 90px;
          height: 90px;
          border: 2px solid rgba(0,255,157,0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 30px rgba(0,255,157,0.15);
          animation: bh-launch-pulse 1.5s infinite;
        }

        .bh-launch-radar-inner {
          width: 60%;
          height: 60%;
          border-radius: 50%;
          border: 2px solid #00ff9d;
          border-top-color: transparent;
          animation: bh-radar-rotate 1s linear infinite;
        }

        @keyframes bh-launch-pulse {
          50% { box-shadow: 0 0 45px rgba(0,255,157,0.4); }
        }

        .bh-loading-bar {
          width: 200px;
          height: 4px;
          background: #10251f;
          overflow: hidden;
        }

        .bh-loading-bar div {
          height: 100%;
          width: 0;
          background: #00ff9d;
          box-shadow: 0 0 12px #00ff9d;
          animation: bh-loading 1.2s ease-in-out forwards;
        }

        @keyframes bh-loading {
          to { width: 100%; }
        }

        @media (prefers-reduced-motion: reduce) {
          .bh-menu *,
          .bh-menu *::before,
          .bh-menu *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
};
