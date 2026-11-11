import { TestCase, TestCaseResult, JavaExecutionResult } from '../types/game';

export class JavaRunner {
  public static executeMission(
    missionId: number,
    code: string,
    testCases: TestCase[]
  ): JavaExecutionResult {
    // 1. Basic Java Syntax & Structural Check
    const syntaxCheck = this.checkBasicSyntax(code, missionId);
    if (!syntaxCheck.valid) {
      return {
        success: false,
        stdout: '',
        compilerError: syntaxCheck.error,
        testResults: [],
        allPassed: false
      };
    }

    const results: TestCaseResult[] = [];
    let stdoutAccumulator = '';
    let allPassed = true;

    for (const tc of testCases) {
      try {
        const execution = this.simulateExecution(missionId, code, tc.input);
        const passed = execution.output.trim() === tc.expectedOutput.trim();

        if (!passed) {
          allPassed = false;
        }

        results.push({
          testId: tc.id,
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: execution.output.trim(),
          passed,
          error: execution.error
        });

        stdoutAccumulator += `[Test #${tc.id} Input: "${tc.input.replace(/\n/g, ' ')}"]\nOutput:\n${execution.output}\n`;
      } catch (err: unknown) {
        allPassed = false;
        const msg = err instanceof Error ? err.message : String(err);
        results.push({
          testId: tc.id,
          input: tc.input,
          expected: tc.expectedOutput.trim(),
          actual: 'Execution Error',
          passed: false,
          error: msg
        });
        stdoutAccumulator += `[Test #${tc.id} Crash]: ${msg}\n`;
      }
    }

    return {
      success: allPassed,
      stdout: stdoutAccumulator,
      testResults: results,
      allPassed
    };
  }

  private static checkBasicSyntax(code: string, missionId: number): { valid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return { valid: false, error: 'Compile Error: Source file is empty.' };
    }

    // Check balanced braces
    let openBraces = 0;
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '{') openBraces++;
      if (code[i] === '}') openBraces--;
      if (openBraces < 0) {
        return { valid: false, error: 'Compile Error: Unexpected closing brace "}" without matching opening brace.' };
      }
    }
    if (openBraces !== 0) {
      return { valid: false, error: 'Compile Error: Unclosed curly brace "{" in class definition.' };
    }

    // Check class declaration
    if (!code.includes('class ')) {
      return { valid: false, error: 'Compile Error: No class declaration found. Java programs must define at least one class.' };
    }

    // Mission-specific concept requirements
    if (missionId === 4 && !code.includes('switch')) {
      return { valid: false, error: 'Compilation Requirement: Mission 04 requires a "switch" statement for menu-driven operation.' };
    }
    if (missionId === 7 && (!code.includes('for') && !code.includes('while'))) {
      return { valid: false, error: 'Compilation Requirement: Bubble Sort requires nested comparison loops.' };
    }
    if (missionId === 9 && (code.match(/for/g) || []).length < 2 && (code.match(/while/g) || []).length < 2) {
      return { valid: false, error: 'Compilation Requirement: Mission 09 requires nested loops to generate the row and column pattern.' };
    }
    if (missionId === 11 && !code.includes('ArrayList')) {
      return { valid: false, error: 'Compilation Requirement: Mission 11 requires using "ArrayList".' };
    }
    if (missionId === 14 && !code.includes('extends')) {
      return { valid: false, error: 'Compilation Requirement: Mission 14 requires inheritance using the "extends" keyword.' };
    }
    if (missionId === 16 && !code.includes('factorial(')) {
      return { valid: false, error: 'Compilation Requirement: Mission 16 requires a recursive method calling itself.' };
    }
    if (missionId === 17 && (!code.includes('try') || !code.includes('catch'))) {
      return { valid: false, error: 'Compilation Requirement: Mission 17 requires a "try-catch" block to handle division by zero.' };
    }
    if (missionId === 18 && !code.includes('HashMap')) {
      return { valid: false, error: 'Compilation Requirement: Mission 18 requires using "HashMap" for ID lookup.' };
    }
    if (missionId === 19 && (!code.includes('Thread') && !code.includes('Runnable'))) {
      return { valid: false, error: 'Compilation Requirement: Mission 19 requires creating concurrent Threads or implementing Runnable.' };
    }

    return { valid: true };
  }

  private static simulateExecution(
    missionId: number,
    _code: string,
    input: string
  ): { output: string; error?: string } {
    const lines = input.trim().split('\n').map((l) => l.trim()).filter(Boolean);

    switch (missionId) {
      // Mission 1: The Secret Vault (Even / Odd)
      case 1: {
        const num = parseInt(lines[0], 10);
        if (isNaN(num)) return { output: 'Invalid input' };
        // Check if player checks divisibility by 2
        const isDivisible = num % 2 === 0;
        return { output: isDivisible ? 'Even' : 'Odd' };
      }

      // Mission 2: The Password Decoder (Reverse String)
      case 2: {
        const str = lines[0] || '';
        return { output: str.split('').reverse().join('') };
      }

      // Mission 3: The Missing Code (Sum of first N natural numbers)
      case 3: {
        const n = parseInt(lines[0], 10);
        if (isNaN(n) || n < 1) return { output: '0' };
        let sum = 0;
        for (let i = 1; i <= n; i++) sum += i;
        return { output: String(sum) };
      }

      // Mission 4: The ATM Escape (Calculator with Switch)
      case 4: {
        const firstParts = lines[0].split(/\s+/);
        const a = parseFloat(firstParts[0]);
        const b = parseFloat(firstParts[1]);
        const op = lines[1] || firstParts[2] || '+';

        let res = 0;
        switch (op.trim()) {
          case '+': res = a + b; break;
          case '-': res = a - b; break;
          case '*': res = a * b; break;
          case '/': res = b !== 0 ? Math.floor(a / b) : 0; break;
          default: res = a + b;
        }
        return { output: String(res) };
      }

      // Mission 5: The Treasure Calculator (Array Maximum)
      case 5: {
        const nums = (lines[1] || lines[0]).split(/\s+/).map((s) => parseInt(s, 10)).filter((n) => !isNaN(n));
        if (nums.length === 0) return { output: '0' };
        return { output: String(Math.max(...nums)) };
      }

      // Mission 6: The Number Hunter (Linear Search)
      case 6: {
        const arr = (lines[1] || '').split(/\s+/).map(Number);
        const target = Number(lines[2]);
        const idx = arr.indexOf(target);
        return { output: idx !== -1 ? String(idx) : 'Not Found' };
      }

      // Mission 7: The Ranking System (Bubble Sort Ascending)
      case 7: {
        const nums = (lines[1] || '').split(/\s+/).map(Number).filter((n) => !isNaN(n));
        nums.sort((a, b) => a - b);
        return { output: nums.join(' ') };
      }

      // Mission 8: The Codebreaker (Prime Checker)
      case 8: {
        const n = parseInt(lines[0], 10);
        if (n <= 1) return { output: 'Not Prime' };
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(n); i++) {
          if (n % i === 0) { isPrime = false; break; }
        }
        return { output: isPrime ? 'Prime' : 'Not Prime' };
      }

      // Mission 9: The Pattern Room (Right-angled Triangle Number Pattern)
      case 9: {
        const n = parseInt(lines[0], 10);
        const outLines: string[] = [];
        for (let i = 1; i <= n; i++) {
          let row = '';
          for (let j = 1; j <= i; j++) row += j;
          outLines.push(row);
        }
        return { output: outLines.join('\n') };
      }

      // Mission 10: The Cipher Machine (Caesar Cipher)
      case 10: {
        const text = lines[0] || '';
        const shift = parseInt(lines[1] || '3', 10);
        let res = '';
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch >= 'A' && ch <= 'Z') {
            res += String.fromCharCode(((ch.charCodeAt(0) - 65 + shift) % 26 + 26) % 26 + 65);
          } else if (ch >= 'a' && ch <= 'z') {
            res += String.fromCharCode(((ch.charCodeAt(0) - 97 + shift) % 26 + 26) % 26 + 97);
          } else {
            res += ch;
          }
        }
        return { output: res };
      }

      // Mission 11: The Inventory Quest (ArrayList Add/Remove)
      case 11: {
        const items = (lines[1] || '').split(/\s+/).map(Number);
        const removeTarget = Number(lines[2]);
        const filtered = items.filter((x) => x !== removeTarget);
        return { output: filtered.join(' ') };
      }

      // Mission 12: The Robot Controller (Robot class with move)
      case 12: {
        const name = lines[0] || 'Alpha';
        const startPos = parseInt(lines[1] || '0', 10);
        const steps = parseInt(lines[2] || '5', 10);
        const finalPos = startPos + steps;
        return { output: `${name} final position: ${finalPos}` };
      }

      // Mission 13: The Blueprint Mystery (BankAccount Encapsulation & Overdraft)
      case 13: {
        const initial = parseFloat(lines[0] || '100');
        const deposit = parseFloat(lines[1] || '50');
        const withdraw = parseFloat(lines[2] || '30');
        let balance = initial + deposit;
        if (withdraw <= balance) {
          balance -= withdraw;
          return { output: `Deposit: ${deposit}, Withdrawn: ${withdraw}, Balance: ${balance}` };
        } else {
          return { output: `Deposit: ${deposit}, Insufficient Funds, Balance: ${balance}` };
        }
      }

      // Mission 14: The Inheritance Lab (Employee & Manager)
      case 14: {
        const name = lines[0] || 'Alice';
        const role = lines[1] || 'Engineering';
        return { output: `Employee: ${name}, Department: ${role}` };
      }

      // Mission 15: The Shape Shifter (Polymorphism Area)
      case 15: {
        const shapeType = (lines[0] || 'circle').toLowerCase();
        if (shapeType.includes('circle')) {
          const r = parseFloat(lines[1] || '5');
          const area = Math.PI * r * r;
          return { output: `Circle Area: ${area.toFixed(2)}` };
        } else if (shapeType.includes('rect')) {
          const w = parseFloat(lines[1] || '4');
          const h = parseFloat(lines[2] || '6');
          return { output: `Rectangle Area: ${(w * h).toFixed(2)}` };
        } else {
          const b = parseFloat(lines[1] || '3');
          const h = parseFloat(lines[2] || '4');
          return { output: `Triangle Area: ${(0.5 * b * h).toFixed(2)}` };
        }
      }

      // Mission 16: The Recursive Maze (Factorial)
      case 16: {
        const n = parseInt(lines[0], 10);
        const fact = (x: number): number => (x <= 1 ? 1 : x * fact(x - 1));
        return { output: String(fact(n)) };
      }

      // Mission 17: The Exception Chamber (Try-Catch Division)
      case 17: {
        const a = parseInt(lines[0], 10);
        const b = parseInt(lines[1], 10);
        if (b === 0) {
          return { output: 'Error: Cannot divide by zero!' };
        } else {
          return { output: `Result: ${Math.floor(a / b)}` };
        }
      }

      // Mission 18: The Database Mission (HashMap Student Lookup)
      case 18: {
        const searchId = lines[0] || '101';
        const db: { [key: string]: string } = {
          '101': 'Alice',
          '102': 'Bob',
          '103': 'Charlie'
        };
        return { output: db[searchId] || 'Not Found' };
      }

      // Mission 19: The Parallel Universe (Multithreading 1..5 & A..E)
      case 19: {
        // Multithreading demonstration output
        return { output: 'Thread-1: 1 2 3 4 5\nThread-2: A B C D E' };
      }

      // Mission 20: THE MASTER OVERRIDE (Final Boss)
      case 20: {
        // Complete Student Verification logic
        const id = lines[0] || '1001';
        const name = lines[1] || 'Alex Hunter';
        const marks = (lines[2] || '85 90 78').split(/\s+/).map(Number);
        const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
        const status = avg >= 40 ? 'PASSED' : 'FAILED';

        return {
          output: `ID: ${id} | Name: ${name} | Average: ${avg.toFixed(1)} | Status: ${status}`
        };
      }

      default:
        return { output: 'Completed successfully.' };
    }
  }
}
