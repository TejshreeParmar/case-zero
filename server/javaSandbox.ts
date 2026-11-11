import { execFile, execFileSync, spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { MISSION_TEST_SUITES, defaultNormalize, ServerTestCase } from './missionTestSuites';

export interface CompilationResult {
  success: boolean;
  classDir?: string;
  mainClassName?: string;
  compileError?: string;
}

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  runtimeError?: string;
  timeLimitExceeded?: boolean;
  memoryLimitExceeded?: boolean;
  executionTimeMs: number;
}

export interface SingleRunResponse {
  success: boolean;
  stdout: string;
  stderr: string;
  compileError?: string;
  runtimeError?: string;
  timeLimitExceeded?: boolean;
  memoryLimitExceeded?: boolean;
  executionTimeMs: number;
}

export interface SubmitTestCaseResult {
  id: number;
  description: string;
  isHidden: boolean;
  passed: boolean;
  input?: string;
  expected?: string;
  actual?: string;
  error?: string;
}

export interface SubmitResponse {
  allPassed: boolean;
  passedCount: number;
  totalCount: number;
  testResults: SubmitTestCaseResult[];
  compileError?: string;
  runtimeError?: string;
  timeLimitExceeded?: boolean;
  memoryLimitExceeded?: boolean;
  status: 'SUCCESS' | 'FAILED' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT';
  message: string;
}

export class JavaSandbox {
  private static javacPath: string | null = null;
  private static javaPath: string | null = null;

  public static getJavacPath(): string {
    if (this.javacPath) return this.javacPath;

    const candidates = [
      process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'javac') : null,
      '/Library/Java/JavaVirtualMachines/jdk-24.jdk/Contents/Home/bin/javac',
      '/Library/Java/JavaVirtualMachines/jdk-26.jdk/Contents/Home/bin/javac',
      '/usr/bin/javac',
      '/usr/local/bin/javac',
      '/opt/homebrew/bin/javac',
      'javac'
    ].filter(Boolean) as string[];

    for (const cand of candidates) {
      try {
        if (cand.includes(path.sep) && !fs.existsSync(cand)) continue;
        execFileSync(cand, ['-version'], { stdio: 'pipe' });
        this.javacPath = cand;
        return cand;
      } catch {
        // try next
      }
    }

    throw new Error('Java Development Kit (javac) not found. Please install JDK 17+ or configure JAVA_HOME.');
  }

  public static getJavaPath(): string {
    if (this.javaPath) return this.javaPath;

    const candidates = [
      process.env.JAVA_HOME ? path.join(process.env.JAVA_HOME, 'bin', 'java') : null,
      '/Library/Java/JavaVirtualMachines/jdk-24.jdk/Contents/Home/bin/java',
      '/Library/Java/JavaVirtualMachines/jdk-26.jdk/Contents/Home/bin/java',
      '/usr/bin/java',
      '/usr/local/bin/java',
      '/opt/homebrew/bin/java',
      'java'
    ].filter(Boolean) as string[];

    for (const cand of candidates) {
      try {
        if (cand.includes(path.sep) && !fs.existsSync(cand)) continue;
        execFileSync(cand, ['-version'], { stdio: 'pipe' });
        this.javaPath = cand;
        return cand;
      } catch {
        // try next
      }
    }

    throw new Error('Java Runtime (java) not found. Please install JDK 17+ or configure JAVA_HOME.');
  }

  /**
   * Security inspection: static check for malicious/dangerous constructs.
   */
  public static checkSecurity(code: string): { safe: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return { safe: false, error: 'Compilation Error: Submitted code is empty.' };
    }

    const forbiddenPatterns = [
      { pattern: /ProcessBuilder/i, name: 'ProcessBuilder' },
      { pattern: /Runtime\.getRuntime/i, name: 'Runtime.getRuntime()' },
      { pattern: /System\.exit/i, name: 'System.exit()' },
      { pattern: /java\.lang\.reflect/i, name: 'Reflection API' },
      { pattern: /java\.net\./i, name: 'Network Sockets' },
      { pattern: /ClassLoader/i, name: 'ClassLoader' },
      { pattern: /System\.loadLibrary/i, name: 'System.loadLibrary' },
      { pattern: /new\s+File\s*\(/i, name: 'Direct File manipulation' },
      { pattern: /Files\.(read|write|delete|create)/i, name: 'Filesystem modification' }
    ];

    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(code)) {
        return {
          safe: false,
          error: `Security Violation: Access to ${rule.name} is restricted in the Bug Hunter Sandbox.`
        };
      }
    }

    return { safe: true };
  }

  /**
   * Identifies the primary class name from code.
   */
  public static detectMainClassName(code: string): string {
    const publicClassMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
    if (publicClassMatch) return publicClassMatch[1];

    const classMatch = code.match(/class\s+([A-Za-z0-9_]+)/);
    if (classMatch) return classMatch[1];

    return 'Main';
  }

  /**
   * Compiles Java code into a temporary directory.
   */
  public static async compileCode(code: string): Promise<CompilationResult> {
    const security = this.checkSecurity(code);
    if (!security.safe) {
      return { success: false, compileError: security.error };
    }

    const javac = this.getJavacPath();
    const mainClassName = this.detectMainClassName(code);
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bug-hunter-exec-'));
    const sourceFilePath = path.join(tempDir, `${mainClassName}.java`);

    try {
      fs.writeFileSync(sourceFilePath, code, 'utf-8');

      return await new Promise<CompilationResult>((resolve) => {
        execFile(
          javac,
          ['-encoding', 'UTF-8', '-Xlint:none', sourceFilePath],
          { timeout: 6000, cwd: tempDir },
          (err, stdout, stderr) => {
            if (err || stderr) {
              // Sanitize paths in compiler error messages
              const sanitizedError = (stderr || stdout || err?.message || 'Compilation failed.')
                .replace(new RegExp(tempDir + path.sep, 'g'), '')
                .replace(new RegExp(tempDir, 'g'), '');

              // Clean up directory on compile failure
              try {
                fs.rmSync(tempDir, { recursive: true, force: true });
              } catch {}

              resolve({
                success: false,
                compileError: sanitizedError.trim()
              });
            } else {
              resolve({
                success: true,
                classDir: tempDir,
                mainClassName
              });
            }
          }
        );
      });
    } catch (err: unknown) {
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, compileError: msg };
    }
  }

  /**
   * Executes a compiled class with isolated input and timeout.
   */
  public static async executeClass(
    classDir: string,
    mainClassName: string,
    input: string,
    timeoutMs: number = 2500
  ): Promise<ExecutionResult> {
    const java = this.getJavaPath();
    const startTime = Date.now();

    return new Promise<ExecutionResult>((resolve) => {
      const child = spawn(
        java,
        [
          '-Xmx128m',
          '-Xss512k',
          '-Dfile.encoding=UTF-8',
          '-cp',
          classDir,
          mainClassName
        ],
        {
          cwd: classDir,
          stdio: ['pipe', 'pipe', 'pipe']
        }
      );

      let stdout = '';
      let stderr = '';
      let isTimedOut = false;
      let isOom = false;

      const timer = setTimeout(() => {
        isTimedOut = true;
        child.kill('SIGKILL');
      }, timeoutMs);

      child.stdout.on('data', (data) => {
        stdout += data.toString('utf-8');
        // Prevent buffer flooding
        if (stdout.length > 50000) {
          isOom = true;
          child.kill('SIGKILL');
        }
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString('utf-8');
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        resolve({
          success: false,
          stdout,
          stderr: stderr || err.message,
          runtimeError: err.message,
          executionTimeMs: Date.now() - startTime
        });
      });

      child.on('close', (code, signal) => {
        clearTimeout(timer);
        const duration = Date.now() - startTime;

        if (isTimedOut || signal === 'SIGKILL' && duration >= timeoutMs - 100) {
          resolve({
            success: false,
            stdout,
            stderr: 'Time Limit Exceeded: Process exceeded execution time limit (2.5s). Possible infinite loop.',
            timeLimitExceeded: true,
            executionTimeMs: duration
          });
          return;
        }

        if (isOom || stderr.includes('OutOfMemoryError')) {
          resolve({
            success: false,
            stdout,
            stderr: 'Memory Limit Exceeded: JVM exceeded heap memory limit (128MB).',
            memoryLimitExceeded: true,
            executionTimeMs: duration
          });
          return;
        }

        if (code !== 0 || stderr.length > 0) {
          // Parse readable exception type
          let runtimeError = stderr.trim();
          const exceptionMatch = stderr.match(/Exception in thread ".*?"\s+([A-Za-z0-9_.]+(?:Exception|Error):?[^\n]*)/);
          if (exceptionMatch) {
            runtimeError = exceptionMatch[1].trim();
          }

          resolve({
            success: false,
            stdout,
            stderr: stderr.trim(),
            runtimeError,
            executionTimeMs: duration
          });
          return;
        }

        resolve({
          success: true,
          stdout,
          stderr: '',
          executionTimeMs: duration
        });
      });

      // Write stdin input
      try {
        if (input) {
          child.stdin.write(input);
          if (!input.endsWith('\n')) child.stdin.write('\n');
        }
        child.stdin.end();
      } catch {
        // Child closed stdin early
      }
    });
  }

  /**
   * Run Code: Compiles and runs a single custom or sample execution.
   */
  public static async runSingle(
    code: string,
    input: string
  ): Promise<SingleRunResponse> {
    const compileResult = await this.compileCode(code);
    if (!compileResult.success || !compileResult.classDir || !compileResult.mainClassName) {
      return {
        success: false,
        stdout: '',
        stderr: compileResult.compileError || 'Compilation Error',
        compileError: compileResult.compileError || 'Compilation Error',
        executionTimeMs: 0
      };
    }

    try {
      const execResult = await this.executeClass(
        compileResult.classDir,
        compileResult.mainClassName,
        input,
        2500
      );

      return {
        success: execResult.success,
        stdout: execResult.stdout,
        stderr: execResult.stderr,
        runtimeError: execResult.runtimeError,
        timeLimitExceeded: execResult.timeLimitExceeded,
        memoryLimitExceeded: execResult.memoryLimitExceeded,
        executionTimeMs: execResult.executionTimeMs
      };
    } finally {
      // Clean up directory
      try {
        fs.rmSync(compileResult.classDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Submit Solution: Compiles once and runs against all test cases for the mission.
   */
  public static async submitMission(
    missionId: number,
    code: string
  ): Promise<SubmitResponse> {
    const suite = MISSION_TEST_SUITES[missionId];
    if (!suite) {
      return {
        allPassed: false,
        passedCount: 0,
        totalCount: 0,
        testResults: [],
        status: 'FAILED',
        message: `Unknown Mission ID: ${missionId}`
      };
    }

    // 1. Compile once
    const compileResult = await this.compileCode(code);
    if (!compileResult.success || !compileResult.classDir || !compileResult.mainClassName) {
      return {
        allPassed: false,
        passedCount: 0,
        totalCount: suite.testCases.length,
        testResults: [],
        compileError: compileResult.compileError || 'Compilation Error',
        status: 'COMPILE_ERROR',
        message: 'Compilation Failed. Fix compiler syntax errors before submitting.'
      };
    }

    const testResults: SubmitTestCaseResult[] = [];
    let allPassed = true;
    let passedCount = 0;
    let globalRuntimeError: string | undefined;
    let globalTimeout = false;
    let globalOom = false;

    try {
      // 2. Run against every test case in suite
      for (const tc of suite.testCases) {
        const execResult = await this.executeClass(
          compileResult.classDir,
          compileResult.mainClassName,
          tc.input,
          2500
        );

        if (execResult.timeLimitExceeded) {
          allPassed = false;
          globalTimeout = true;
          testResults.push({
            id: tc.id,
            description: tc.description,
            isHidden: !!tc.isHidden,
            passed: false,
            input: tc.isHidden ? '[HIDDEN TEST INPUT]' : tc.input,
            expected: tc.isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
            actual: 'Time Limit Exceeded (> 2.5s)',
            error: 'Time Limit Exceeded: Infinite loop or slow algorithm.'
          });
          break; // Stop running further tests on timeout
        }

        if (execResult.memoryLimitExceeded) {
          allPassed = false;
          globalOom = true;
          testResults.push({
            id: tc.id,
            description: tc.description,
            isHidden: !!tc.isHidden,
            passed: false,
            input: tc.isHidden ? '[HIDDEN TEST INPUT]' : tc.input,
            expected: tc.isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
            actual: 'Memory Limit Exceeded (> 128MB)',
            error: 'Memory Limit Exceeded.'
          });
          break;
        }

        if (!execResult.success && execResult.runtimeError) {
          allPassed = false;
          if (!globalRuntimeError) globalRuntimeError = execResult.runtimeError;
          testResults.push({
            id: tc.id,
            description: tc.description,
            isHidden: !!tc.isHidden,
            passed: false,
            input: tc.isHidden ? '[HIDDEN TEST INPUT]' : tc.input,
            expected: tc.isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
            actual: 'Runtime Exception',
            error: execResult.runtimeError
          });
          continue;
        }

        // Output validation
        let passed = false;
        let reason: string | undefined;

        if (suite.customValidator) {
          const valRes = suite.customValidator(execResult.stdout, tc.expectedOutput, tc);
          passed = valRes.passed;
          reason = valRes.reason;
        } else {
          const act = defaultNormalize(execResult.stdout);
          const exp = defaultNormalize(tc.expectedOutput);
          passed = act === exp;
        }

        if (passed) {
          passedCount++;
        } else {
          allPassed = false;
        }

        testResults.push({
          id: tc.id,
          description: tc.description,
          isHidden: !!tc.isHidden,
          passed,
          input: tc.isHidden ? '[HIDDEN TEST INPUT]' : tc.input,
          expected: tc.isHidden ? '[HIDDEN EXPECTED OUTPUT]' : tc.expectedOutput,
          actual: defaultNormalize(execResult.stdout),
          error: reason
        });
      }

      let status: 'SUCCESS' | 'FAILED' | 'RUNTIME_ERROR' | 'TIMEOUT' = 'FAILED';
      let message = `${passedCount}/${suite.testCases.length} test cases passed.`;

      if (allPassed) {
        status = 'SUCCESS';
        message = `All ${suite.testCases.length} test cases passed successfully! Mission Solved!`;
      } else if (globalTimeout) {
        status = 'TIMEOUT';
        message = 'Execution Timed Out (> 2.5s). Check for infinite loops or inefficient iterations.';
      } else if (globalRuntimeError) {
        status = 'RUNTIME_ERROR';
        message = `Runtime Exception encountered: ${globalRuntimeError}`;
      }

      return {
        allPassed,
        passedCount,
        totalCount: suite.testCases.length,
        testResults,
        runtimeError: globalRuntimeError,
        timeLimitExceeded: globalTimeout,
        memoryLimitExceeded: globalOom,
        status,
        message
      };
    } finally {
      // Clean up directory
      try {
        fs.rmSync(compileResult.classDir, { recursive: true, force: true });
      } catch {}
    }
  }
}
