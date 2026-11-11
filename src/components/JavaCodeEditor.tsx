
import React, { useState } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  Terminal,
  CheckCircle,
  XCircle,
  FileCode,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { MissionData, TestCaseResult } from '../types/game';
import { sound } from '../audio/soundEngine';

interface JavaCodeEditorProps {
  mission: MissionData;
  onSuccess: (stats: {
    wrongAttempts: number;
    hintsUsed: number;
    timeSpentSeconds: number;
  }) => void;
  hintsUsedCount: number;
}

export const JavaCodeEditor: React.FC<JavaCodeEditorProps> = ({
  mission,
  onSuccess,
  hintsUsedCount
}) => {
  const [code, setCode] = useState<string>(mission.starterCode);
  const [activeConsoleTab, setActiveConsoleTab] = useState<
    'console' | 'tests' | 'spec'
  >('spec');

  const [outputConsole, setOutputConsole] = useState<string>(
    'Ready to compile and run. Press [RUN CODE] or [SUBMIT SOLUTION].'
  );

  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);
  const [startTime] = useState<number>(Date.now());
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Handle Tab key in code editor textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newCode =
        code.substring(0, start) + '    ' + code.substring(end);

      setCode(newCode);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  // RUN: Execute actual Java code using the Java server
  const handleRunSample = async () => {
    sound.playTerminalKey();
    setIsRunning(true);
    setActiveConsoleTab('console');
    setOutputConsole('Compiling and executing Java code...\n');

    try {
      const sampleCase = mission.testCases[0];

      const response = await fetch('/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          input: sampleCase.input
        })
      });

      const result = await response.json();

      if (!response.ok || result.compileError) {
        sound.playError();

        setOutputConsole(
          `COMPILATION FAILED:\n${
            result.compileError || result.message || 'Server error'
          }`
        );
      } else if (result.runtimeError || result.timeLimitExceeded) {
        sound.playError();

        setOutputConsole(
          `EXECUTION FAILED:\n${
            result.runtimeError ||
            result.stderr ||
            'Execution timed out.'
          }`
        );
      } else {
        sound.playConfirm();

        setOutputConsole(
          `EXECUTION COMPLETE\n\n` +
          `[Input]:\n${sampleCase.input}\n\n` +
          `[Your Output]:\n${result.stdout || '(No output)'}\n\n` +
          `[Expected Output]:\n${sampleCase.expectedOutput}`
        );
      }
    } catch (error) {
      sound.playError();

      setOutputConsole(
        'CONNECTION ERROR:\nCould not connect to the Java server. Make sure it is running on port 3747.'
      );
    } finally {
      setIsRunning(false);
    }
  };

  // SUBMIT: Test actual Java code against all server test cases
  const handleSubmit = async () => {
    sound.playTerminalKey();
    setIsRunning(true);
    setActiveConsoleTab('tests');
    setOutputConsole('Running all automated test cases...\n');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code,
          missionId: mission.missionNumberInt
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed.');
      }

      const mappedResults: TestCaseResult[] = (
        result.testResults || []
      ).map((test: any) => ({
        testId: test.id,
        input: test.input || '',
        expected: test.expected || '',
        actual: test.actual || '',
        passed: test.passed,
        error: test.error
      }));

      setTestResults(mappedResults);

      const genuinelyPassed =
        result.allPassed === true &&
        result.totalCount > 0 &&
        result.passedCount === result.totalCount;

      if (genuinelyPassed) {
        sound.playSuccess();
        setIsCompleted(true);

        setOutputConsole(
          `ALL TEST CASES PASSED!\n\n` +
          `${result.passedCount}/${result.totalCount} tests passed.\n` +
          `Mission Solved!`
        );

        const elapsedSeconds = Math.max(
          10,
          Math.floor((Date.now() - startTime) / 1000)
        );

        setTimeout(() => {
          onSuccess({
            wrongAttempts,
            hintsUsed: hintsUsedCount,
            timeSpentSeconds: elapsedSeconds
          });
        }, 2200);
      } else {
        sound.playError();
        setWrongAttempts((prev) => prev + 1);

        setOutputConsole(
          `${result.status || 'FAILED'}\n\n` +
          `${result.message || 'Some test cases failed.'}\n\n` +
          `${result.passedCount || 0}/${result.totalCount || 0} tests passed.`
        );

        if (
          result.compileError ||
          result.runtimeError ||
          result.status === 'COMPILE_ERROR' ||
          result.status === 'RUNTIME_ERROR'
        ) {
          setActiveConsoleTab('console');
        }
      }
    } catch (error) {
      sound.playError();

      setOutputConsole(
        `SERVER CONNECTION ERROR:\n${
          error instanceof Error ? error.message : 'Unknown error'
        }\n\nNo mission progress has been awarded.`
      );

      setActiveConsoleTab('console');
    } finally {
      setIsRunning(false);
    }
  };

  // Reset Code
  const handleReset = () => {
    sound.playClick();
    setCode(mission.starterCode);
    setOutputConsole('Code editor reset to initial starter template.');
  };

  // Auto-complete (Reference Solution)
  const handleLoadReference = () => {
    sound.playConfirm();
    setCode(mission.referenceSolution);
    setOutputConsole(
      'Reference solution loaded into editor. Click [SUBMIT SOLUTION] to verify.'
    );
  };

  const lineCount = code.split('\n').length;

  return (
    <div className="w-full flex flex-col gap-3 font-terminal select-none">
      {/* Code Editor Header */}
      <div className="pixel-card-header flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="font-pixel text-xs text-emerald-400">
            {mission.systemName}
          </span>
          <span className="text-[10px] font-pixel text-slate-500 bg-slate-800 px-1.5 py-0.5">
            JAVA 17
          </span>
        </div>

        {/* Editor Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="btn-pixel btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1"
            title="Reset code to starter template"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">RESET</span>
          </button>

          <button
            onClick={handleLoadReference}
            className="btn-pixel btn-secondary py-1 px-2.5 text-[11px] flex items-center gap-1 text-amber-300 border-amber-600/50"
            title="Load reference solution for testing/learning"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden sm:inline">AUTO-COMPLETE</span>
          </button>

          <button
            onClick={handleRunSample}
            disabled={isRunning || isCompleted}
            className="btn-pixel btn-amber py-1 px-3 text-[11px] flex items-center gap-1"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>RUN</span>
          </button>

          <button
            onClick={handleSubmit}
            disabled={isRunning || isCompleted}
            className="btn-pixel py-1 px-4 text-[11px] flex items-center gap-1.5"
          >
            <Send className="w-3 h-3" />
            <span>SUBMIT</span>
          </button>
        </div>
      </div>

      {/* Editor Main Canvas with Line Numbers */}
      <div className="relative flex border border-slate-700 bg-slate-950 rounded overflow-hidden shadow-inner max-h-[380px] min-h-[220px]">
        {/* Line Numbers Column */}
        <div className="w-10 bg-slate-900/90 text-slate-600 font-code text-xs select-none py-2.5 px-1 text-right border-r border-slate-800 leading-relaxed overflow-hidden">
          {Array.from({ length: Math.max(12, lineCount) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent text-emerald-300 font-code text-xs sm:text-sm p-2.5 outline-none resize-none leading-relaxed select-text overflow-y-auto"
          style={{ whiteSpace: 'pre', tabSize: 4 }}
        />
      </div>

      {/* Output Console & Test Runner Tabs */}
      <div className="pixel-card border border-slate-800 bg-slate-900/90 overflow-hidden">
        {/* Tabs Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2 py-1">
          <div className="flex items-center gap-1 text-xs font-pixel">
            <button
              onClick={() => setActiveConsoleTab('spec')}
              className={`px-3 py-1 flex items-center gap-1.5 border-b-2 transition-all ${
                activeConsoleTab === 'spec'
                  ? 'border-emerald-400 text-emerald-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>SPECIFICATION</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('console')}
              className={`px-3 py-1 flex items-center gap-1.5 border-b-2 transition-all ${
                activeConsoleTab === 'console'
                  ? 'border-amber-400 text-amber-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>CONSOLE OUTPUT</span>
            </button>

            <button
              onClick={() => setActiveConsoleTab('tests')}
              className={`px-3 py-1 flex items-center gap-1.5 border-b-2 transition-all ${
                activeConsoleTab === 'tests'
                  ? 'border-cyan-400 text-cyan-400 bg-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle className="w-3 h-3" />
              <span>
                TEST CASES ({testResults.filter((t) => t.passed).length}/{mission.testCases.length})
              </span>
            </button>
          </div>

          <span className="text-[10px] font-pixel text-slate-500 pr-2">
            WRONG ATTEMPTS: {wrongAttempts}
          </span>
        </div>

        {/* Tab 1: Problem Specification */}
        {activeConsoleTab === 'spec' && (
          <div className="p-3 text-sm text-slate-300 font-terminal max-h-48 overflow-y-auto leading-relaxed">
            <div className="font-pixel text-xs text-amber-400 mb-1">
              PROGRAMMING OBJECTIVE:
            </div>

            <p className="mb-3 text-slate-200">
              {mission.problemStatement}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-pixel text-[10px] block mb-1">
                  SAMPLE INPUT
                </span>
                <pre className="font-code text-cyan-300">
                  {mission.sampleInput}
                </pre>
              </div>

              <div className="p-2 bg-slate-950 border border-slate-800">
                <span className="text-slate-500 font-pixel text-[10px] block mb-1">
                  EXPECTED OUTPUT
                </span>
                <pre className="font-code text-emerald-300">
                  {mission.expectedOutput}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Console Output */}
        {activeConsoleTab === 'console' && (
          <pre className="p-3 bg-slate-950 font-code text-xs text-emerald-400 whitespace-pre-wrap max-h-48 overflow-y-auto leading-snug">
            {outputConsole}
          </pre>
        )}

        {/* Tab 3: Test Cases */}
        {activeConsoleTab === 'tests' && (
          <div className="p-3 bg-slate-950 max-h-48 overflow-y-auto flex flex-col gap-2 font-terminal">
            {testResults.length === 0 ? (
              <div className="text-slate-500 text-sm py-4 text-center">
                No test suite run yet. Click [SUBMIT] to test all automated validation cases.
              </div>
            ) : (
              testResults.map((tr) => (
                <div
                  key={tr.testId}
                  className={`p-2.5 border text-xs sm:text-sm flex flex-col gap-1 ${
                    tr.passed
                      ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
                      : 'border-red-500/50 bg-red-950/30 text-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-pixel text-[10px]">
                    <span className="flex items-center gap-1.5">
                      {tr.passed ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400" />
                      )}
                      <span>TEST CASE #{tr.testId}</span>
                    </span>

                    <span className={tr.passed ? 'text-emerald-400' : 'text-red-400'}>
                      {tr.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-1 font-code text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">
                        INPUT:
                      </span>
                      <span className="text-slate-300">
                        {tr.input || '(empty)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">
                        EXPECTED:
                      </span>
                      <span className="text-emerald-300">
                        {tr.expected}
                      </span>
                    </div>
                  </div>

                  {!tr.passed && (
                    <div className="mt-1 pt-1 border-t border-red-800/40 font-code text-xs">
                      <span className="text-slate-500 text-[10px]">
                        YOUR OUTPUT:
                      </span>{' '}
                      <span className="text-red-300">
                        {tr.actual}
                      </span>
                    </div>
                  )}

                  {tr.error && (
                    <div className="text-red-300 text-xs mt-1">
                      {tr.error}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
