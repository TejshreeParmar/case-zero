import React, { useState, useEffect } from 'react';
import { 
  ScreenView, 
  PlayerProfile, 
  GameSettings, 
  CaseData, 
  CaseResult 
} from './types/game';
import { CASES } from './data/casesData';
import { 
  loadProfile, 
  saveProfile, 
  loadSettings, 
  saveSettings, 
  calculateRank,
  INITIAL_PROFILE 
} from './utils/storage';
import { sound } from './audio/soundEngine';

// Components
import { MainMenu } from './components/MainMenu';
import { DetectiveOffice } from './components/DetectiveOffice';
import { CaseSelector } from './components/CaseSelector';
import { TerminalInvestigation } from './components/TerminalInvestigation';
import { InvestigationBoard } from './components/InvestigationBoard';
import { FilingCabinetModal } from './components/FilingCabinetModal';
import { SettingsModal } from './components/SettingsModal';
import { CreditsModal } from './components/CreditsModal';
import { CaseResultsModal } from './components/CaseResultsModal';
import { MasterBugHunterModal } from './components/MasterBugHunterModal';

export const App: React.FC = () => {
  const [view, setView] = useState<ScreenView>('main_menu');
  const [profile, setProfile] = useState<PlayerProfile>(loadProfile);
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [activeCase, setActiveCase] = useState<CaseData | null>(() => {
    const saved = loadProfile();
    return CASES.find((c) => c.id === saved.activeCaseId) || CASES[0];
  });
  const [lastResult, setLastResult] = useState<CaseResult | null>(null);

  // Apply theme & volumes on mount & update
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    sound.setVolumes(settings.masterVolume, settings.sfxVolume, settings.ambientVolume);
    saveSettings(settings);
  }, [settings]);

  // Persist Profile on update
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // View Navigation Handlers
  const handleNewGame = () => {
    const freshCase = CASES[0];
    setActiveCase(freshCase);
    setProfile((prev) => ({
      ...prev,
      activeCaseId: freshCase.id
    }));
    setView('office');
  };

  const handleContinue = () => {
    setView('office');
  };

  const handleSelectCase = (caseData: CaseData) => {
    setActiveCase(caseData);
    setProfile((prev) => ({
      ...prev,
      activeCaseId: caseData.id
    }));
    setView('investigation');
  };

  const handleSolveCase = (stats: { wrongAttempts: number; hintsUsed: number; timeSpentSeconds: number }) => {
    if (!activeCase) return;

    // Calculate score / XP earned
    const baseScore = activeCase.xpReward;
    const penalty = stats.wrongAttempts * 20;
    const hintPenalty = stats.hintsUsed * (activeCase.hintPenalty || 25);
    const finalScore = Math.max(50, baseScore - penalty - hintPenalty);

    // Calculate grade
    let grade: 'S' | 'A' | 'B' | 'C' = 'C';
    if (stats.wrongAttempts === 0 && stats.hintsUsed === 0) grade = 'S';
    else if (stats.wrongAttempts <= 1 && stats.hintsUsed <= 1) grade = 'A';
    else if (stats.wrongAttempts <= 2) grade = 'B';

    const result: CaseResult = {
      caseId: activeCase.id,
      caseTitle: activeCase.title,
      isSuccess: true,
      scoreEarned: finalScore,
      timeSpentSeconds: stats.timeSpentSeconds,
      wrongAttempts: stats.wrongAttempts,
      hintsUsedCount: stats.hintsUsed,
      grade
    };
    setLastResult(result);

    // Update Profile
    const isBossCase = activeCase.missionNumberInt === 20;

    setProfile((prev) => {
      const alreadyCompleted = prev.casesCompleted.includes(activeCase.id);
      const updatedCases = alreadyCompleted
        ? prev.casesCompleted
        : [...prev.casesCompleted, activeCase.id];
      const newScore = prev.score + (alreadyCompleted ? Math.floor(finalScore / 3) : finalScore);
      const newRank = calculateRank(newScore, updatedCases.length);

      // Check achievements
      const achievements = [...prev.achievements];
      if (updatedCases.length === 1 && !achievements.some((a) => a.id === 'first_fix')) {
        achievements.push({
          id: 'first_fix',
          title: 'First Java Bug Caught',
          description: 'Successfully cracked Case #001: The Missing Balance in Java!',
          icon: 'CheckCircle',
          unlockedAt: new Date().toISOString()
        });
      }
      if (grade === 'S' && !achievements.some((a) => a.id === 'master_sleuth')) {
        achievements.push({
          id: 'master_sleuth',
          title: 'Flawless Deduction',
          description: 'Solved a Java case with Grade S (zero wrong attempts and zero hints)!',
          icon: 'Star',
          unlockedAt: new Date().toISOString()
        });
      }
      if (updatedCases.includes('case-14') && !achievements.some((a) => a.id === 'trick_master')) {
        achievements.push({
          id: 'trick_master',
          title: 'Eagle Eyed Auditor',
          description: 'Discovered the truth in Case 14: Recognized that the code was actually correct!',
          icon: 'Award',
          unlockedAt: new Date().toISOString()
        });
      }
      if (updatedCases.length >= 20 && !achievements.some((a) => a.id === 'master_bug_hunter')) {
        achievements.push({
          id: 'master_bug_hunter',
          title: 'MASTER BUG HUNTER',
          description: 'Solved all 20 Java forensic debugging cases in the bureau.',
          icon: 'Trophy',
          unlockedAt: new Date().toISOString()
        });
      }

      return {
        ...prev,
        score: newScore,
        rank: newRank,
        casesCompleted: updatedCases,
        hintsUsed: prev.hintsUsed + stats.hintsUsed,
        achievements
      };
    });

    if (isBossCase) {
      setView('master_victory');
    } else {
      setView('results');
    }
  };

  const handleNextCase = () => {
    if (!activeCase) return;
    const currentIndex = CASES.findIndex((c) => c.id === activeCase.id);
    if (currentIndex >= 0 && currentIndex < CASES.length - 1) {
      const next = CASES[currentIndex + 1];
      setActiveCase(next);
      setProfile((prev) => ({ ...prev, activeCaseId: next.id }));
      setView('investigation');
    } else {
      setView('office');
    }
  };

  const handleResetProgress = () => {
    setProfile(INITIAL_PROFILE);
    saveProfile(INITIAL_PROFILE);
    setActiveCase(CASES[0]);
    setView('main_menu');
  };

  const currentCaseIndex = activeCase ? CASES.findIndex((c) => c.id === activeCase.id) : 0;
  const hasNextCase = currentCaseIndex < CASES.length - 1;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-terminal">
      {/* Optional CRT Scanlines Effect Filter */}
      {settings.scanlinesEnabled && <div className="crt-overlay crt-flicker pointer-events-none" />}

      {/* View Switcher */}
      {view === 'main_menu' && (
        <MainMenu
          profile={profile}
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onOpenCases={() => setView('case_select')}
          onOpenSettings={() => setView('settings')}
          onOpenCredits={() => setView('credits')}
        />
      )}

      {view === 'office' && (
        <DetectiveOffice
          profile={profile}
          activeCase={activeCase}
          onOpenTerminal={() => setView('investigation')}
          onOpenBoard={() => setView('investigation_board')}
          onOpenFilingCabinet={() => setView('filing_cabinet')}
          onOpenCases={() => setView('case_select')}
          onOpenSettings={() => setView('settings')}
          onReturnToMenu={() => setView('main_menu')}
        />
      )}

      {view === 'case_select' && (
        <CaseSelector
          profile={profile}
          onSelectCase={handleSelectCase}
          onBack={() => setView('office')}
        />
      )}

      {view === 'investigation' && activeCase && (
        <TerminalInvestigation
          missionData={activeCase}
          onSolveCase={handleSolveCase}
          onBackToOffice={() => setView('office')}
          onOpenBoard={() => setView('investigation_board')}
        />
      )}

      {view === 'investigation_board' && activeCase && (
        <InvestigationBoard
          caseData={activeCase}
          onClose={() => setView('office')}
          onOpenTerminal={() => setView('investigation')}
        />
      )}

      {view === 'filing_cabinet' && (
        <FilingCabinetModal
          profile={profile}
          onClose={() => setView('office')}
          onResetProgress={handleResetProgress}
        />
      )}

      {view === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={setSettings}
          onClose={() => setView('main_menu')}
        />
      )}

      {view === 'credits' && (
        <CreditsModal
          onClose={() => setView('main_menu')}
        />
      )}

      {view === 'results' && lastResult && (
        <CaseResultsModal
          result={lastResult}
          hasNextCase={hasNextCase}
          onReturnToOffice={() => setView('office')}
          onNextCase={handleNextCase}
        />
      )}

      {view === 'master_victory' && (
        <MasterBugHunterModal
          profile={profile}
          onReturnToOffice={() => setView('office')}
          onReturnToMenu={() => setView('main_menu')}
        />
      )}
    </div>
  );
};

export default App;
