import React from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Sliders, 
  Monitor, 
  Palette, 
  Keyboard 
} from 'lucide-react';
import { GameSettings, GameTheme } from '../types/game';
import { sound } from '../audio/soundEngine';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose
}) => {
  const handleVolumeChange = (field: 'masterVolume' | 'sfxVolume' | 'ambientVolume', value: number) => {
    const updated = { ...settings, [field]: value };
    onUpdateSettings(updated);
    sound.setVolumes(updated.masterVolume, updated.sfxVolume, updated.ambientVolume);
    sound.playHover();
  };

  const handleScanlineToggle = () => {
    sound.playClick();
    onUpdateSettings({ ...settings, scanlinesEnabled: !settings.scanlinesEnabled });
  };

  const handleThemeChange = (theme: GameTheme) => {
    sound.playClick();
    onUpdateSettings({ ...settings, theme });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-4 sm:p-6 bg-slate-950 select-none overflow-y-auto font-terminal">
      {/* Top Header */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between border-b-2 border-slate-800 pb-3 mb-6 bg-slate-900/90 px-4 py-2">
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
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h2 className="font-pixel text-xs text-emerald-400">
              SYSTEM CONFIGURATION // SETTINGS
            </h2>
          </div>
        </div>
      </div>

      {/* Main Settings Form */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Section 1: Audio Controls */}
        <div className="pixel-card p-5 border-slate-700 bg-slate-900/80">
          <h3 className="font-pixel text-xs text-amber-400 mb-4 flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>SYNTHESIZER AUDIO LEVELS</span>
          </h3>

          <div className="flex flex-col gap-4">
            {/* Master Volume */}
            <div>
              <div className="flex justify-between text-xs font-pixel mb-1 text-slate-300">
                <span>MASTER GAIN</span>
                <span className="text-emerald-400">{Math.round(settings.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.masterVolume}
                onChange={(e) => handleVolumeChange('masterVolume', parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div>
              <div className="flex justify-between text-xs font-pixel mb-1 text-slate-300">
                <span>SFX & CHIPTUNES</span>
                <span className="text-emerald-400">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => handleVolumeChange('sfxVolume', parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Ambient Drone */}
            <div>
              <div className="flex justify-between text-xs font-pixel mb-1 text-slate-300">
                <span>NOIR RAIN & DRONE</span>
                <span className="text-emerald-400">{Math.round(settings.ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.ambientVolume}
                onChange={(e) => handleVolumeChange('ambientVolume', parseFloat(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Visuals & CRT */}
        <div className="pixel-card p-5 border-slate-700 bg-slate-900/80">
          <h3 className="font-pixel text-xs text-emerald-400 mb-4 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>CRT & DISPLAY OPTIONS</span>
          </h3>

          <div className="flex flex-col gap-5">
            {/* Scanlines Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800">
              <div>
                <strong className="block text-slate-200 text-lg">CRT SCANLINES & CURVE</strong>
                <span className="text-xs text-slate-400">Vintage phosphor monitor filter</span>
              </div>
              <button
                onClick={handleScanlineToggle}
                className={`btn-pixel py-1.5 px-4 text-xs ${
                  settings.scanlinesEnabled ? '' : 'btn-secondary'
                }`}
              >
                {settings.scanlinesEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-xs font-pixel text-slate-400 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-cyan-400" />
                <span>PHOSPHOR PALETTE</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleThemeChange('green')}
                  className={`p-2 font-pixel text-[11px] border text-center ${
                    settings.theme === 'green'
                      ? 'border-emerald-400 bg-emerald-950 text-emerald-300'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  EMERALD
                </button>
                <button
                  onClick={() => handleThemeChange('amber')}
                  className={`p-2 font-pixel text-[11px] border text-center ${
                    settings.theme === 'amber'
                      ? 'border-amber-400 bg-amber-950 text-amber-300'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  AMBER
                </button>
                <button
                  onClick={() => handleThemeChange('cyan')}
                  className={`p-2 font-pixel text-[11px] border text-center ${
                    settings.theme === 'cyan'
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                      : 'border-slate-800 text-slate-500'
                  }`}
                >
                  CYAN
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Keyboard Controls Guide (Full width) */}
        <div className="pixel-card p-5 border-slate-700 bg-slate-900/80 md:col-span-2">
          <h3 className="font-pixel text-xs text-cyan-400 mb-3 flex items-center gap-2">
            <Keyboard className="w-4 h-4" />
            <span>DETECTIVE KEYBOARD CONTROLS</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-terminal">
            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="font-pixel text-xs text-amber-400 block mb-1">[W, A, S, D] / [ARROWS]</span>
              <span className="text-slate-300">Walk and explore the 2D detective office.</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="font-pixel text-xs text-emerald-400 block mb-1">[E] or [SPACE]</span>
              <span className="text-slate-300">Interact with workstation, board, and files.</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800">
              <span className="font-pixel text-xs text-cyan-400 block mb-1">[MOUSE / TOUCH]</span>
              <span className="text-slate-300">Full on-screen UI buttons & virtual D-pad.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
