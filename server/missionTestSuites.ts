export interface ServerTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  description: string;
  isHidden?: boolean;
}

export interface MissionTestSuite {
  missionId: number;
  title: string;
  testCases: ServerTestCase[];
  customValidator?: (actual: string, expected: string, tc: ServerTestCase) => { passed: boolean; reason?: string };
}

// Normalized token comparison ignoring extraneous line breaks and trailing whitespace
export function defaultNormalize(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export const MISSION_TEST_SUITES: Record<number, MissionTestSuite> = {
  // MISSION 01 — The Secret Vault (Even / Odd)
  1: {
    missionId: 1,
    title: 'The Secret Vault',
    testCases: [
      { id: 1, input: '17', expectedOutput: 'Odd', description: 'Sample odd integer' },
      { id: 2, input: '20', expectedOutput: 'Even', description: 'Sample even integer' },
      { id: 3, input: '0', expectedOutput: 'Even', description: 'Zero is even', isHidden: true },
      { id: 4, input: '-7', expectedOutput: 'Odd', description: 'Negative odd integer', isHidden: true },
      { id: 5, input: '-14', expectedOutput: 'Even', description: 'Negative even integer', isHidden: true },
      { id: 6, input: '1000000', expectedOutput: 'Even', description: 'Large even integer', isHidden: true }
    ]
  },

  // MISSION 02 — The Password Decoder (Reverse String)
  2: {
    missionId: 2,
    title: 'The Password Decoder',
    testCases: [
      { id: 1, input: 'JAVA', expectedOutput: 'AVAJ', description: 'Sample word' },
      { id: 2, input: 'DETECTIVE', expectedOutput: 'EVITCETED', description: 'Multi-letter string' },
      { id: 3, input: '12345', expectedOutput: '54321', description: 'Numeric string', isHidden: true },
      { id: 4, input: 'radar', expectedOutput: 'radar', description: 'Palindrome string', isHidden: true },
      { id: 5, input: 'A', expectedOutput: 'A', description: 'Single character', isHidden: true },
      { id: 6, input: 'BugHunter2026', expectedOutput: '6202retnuHguB', description: 'Mixed alphanumeric', isHidden: true }
    ]
  },

  // MISSION 03 — The Missing Code (Sum 1 to N)
  3: {
    missionId: 3,
    title: 'The Missing Code',
    testCases: [
      { id: 1, input: '5', expectedOutput: '15', description: 'Sum from 1 to 5' },
      { id: 2, input: '10', expectedOutput: '55', description: 'Sum from 1 to 10' },
      { id: 3, input: '1', expectedOutput: '1', description: 'Sum for N = 1', isHidden: true },
      { id: 4, input: '25', expectedOutput: '325', description: 'Sum for N = 25', isHidden: true },
      { id: 5, input: '100', expectedOutput: '5050', description: 'Sum for N = 100', isHidden: true }
    ]
  },

  // MISSION 04 — The ATM Escape (Calculator with Switch)
  4: {
    missionId: 4,
    title: 'The ATM Escape',
    testCases: [
      { id: 1, input: '10 5\n+', expectedOutput: '15', description: 'Addition 10 + 5' },
      { id: 2, input: '20 4\n-', expectedOutput: '16', description: 'Subtraction 20 - 4' },
      { id: 3, input: '6 7\n*', expectedOutput: '42', description: 'Multiplication 6 * 7' },
      { id: 4, input: '24 6\n/', expectedOutput: '4', description: 'Division 24 / 6', isHidden: true },
      { id: 5, input: '10 0\n/', expectedOutput: 'Error: Division by zero', description: 'Division by zero handler', isHidden: true },
      { id: 6, input: '0 9\n*', expectedOutput: '0', description: 'Multiply by zero', isHidden: true }
    ],
    customValidator: (actual, expected, tc) => {
      const act = defaultNormalize(actual);
      const exp = defaultNormalize(expected);
      if (tc.id === 5) {
        const lower = act.toLowerCase();
        if (lower.includes('divide by zero') || lower.includes('division by zero') || lower.includes('cannot divide')) {
          return { passed: true };
        }
      }
      return { passed: act === exp };
    }
  },

  // MISSION 05 — The Treasure Calculator (Max in array)
  5: {
    missionId: 5,
    title: 'The Treasure Calculator',
    testCases: [
      { id: 1, input: '5\n12 45 23 67 19', expectedOutput: '67', description: 'Positive array' },
      { id: 2, input: '4\n-10 -5 -20 -2', expectedOutput: '-2', description: 'Negative array' },
      { id: 3, input: '1\n999', expectedOutput: '999', description: 'Single element array', isHidden: true },
      { id: 4, input: '5\n10 10 10 10 10', expectedOutput: '10', description: 'Identical elements', isHidden: true },
      { id: 5, input: '6\n-100 -50 0 50 100 -200', expectedOutput: '100', description: 'Mixed negative and positive', isHidden: true }
    ]
  },

  // MISSION 06 — The Number Hunter (Linear Search in Array)
  6: {
    missionId: 6,
    title: 'The Number Hunter',
    testCases: [
      { id: 1, input: '5\n10 20 30 40 50\n30', expectedOutput: '2', description: 'Target at index 2' },
      { id: 2, input: '4\n1 2 3 4\n99', expectedOutput: 'Not Found', description: 'Target element absent' },
      { id: 3, input: '3\n7 8 9\n7', expectedOutput: '0', description: 'Target at first element (0)', isHidden: true },
      { id: 4, input: '4\n15 25 35 45\n45', expectedOutput: '3', description: 'Target at last index', isHidden: true },
      { id: 5, input: '5\n10 20 30 40 50\n-5', expectedOutput: 'Not Found', description: 'Negative absent target', isHidden: true }
    ]
  },

  // MISSION 07 — The Ranking System (Bubble Sort)
  7: {
    missionId: 7,
    title: 'The Ranking System',
    testCases: [
      { id: 1, input: '5\n5 2 8 1 3', expectedOutput: '1 2 3 5 8', description: 'Unsorted 5 elements' },
      { id: 2, input: '3\n9 4 1', expectedOutput: '1 4 9', description: 'Reverse sorted' },
      { id: 3, input: '4\n2 2 1 3', expectedOutput: '1 2 2 3', description: 'Array with duplicate values', isHidden: true },
      { id: 4, input: '1\n42', expectedOutput: '42', description: 'Single element', isHidden: true },
      { id: 5, input: '5\n1 2 3 4 5', expectedOutput: '1 2 3 4 5', description: 'Already sorted array', isHidden: true }
    ]
  },

  // MISSION 08 — The Codebreaker (Prime Verifier)
  8: {
    missionId: 8,
    title: 'The Codebreaker',
    testCases: [
      { id: 1, input: '13', expectedOutput: 'Prime', description: 'Prime number 13' },
      { id: 2, input: '12', expectedOutput: 'Not Prime', description: 'Composite number 12' },
      { id: 3, input: '1', expectedOutput: 'Not Prime', description: 'Boundary case 1 is Not Prime' },
      { id: 4, input: '0', expectedOutput: 'Not Prime', description: 'Boundary case 0 is Not Prime', isHidden: true },
      { id: 5, input: '-7', expectedOutput: 'Not Prime', description: 'Negative numbers are Not Prime', isHidden: true },
      { id: 6, input: '2', expectedOutput: 'Prime', description: 'Smallest prime number 2', isHidden: true },
      { id: 7, input: '97', expectedOutput: 'Prime', description: 'Two-digit prime 97', isHidden: true }
    ]
  },

  // MISSION 09 — The Pattern Room (Right-angled Triangle Pattern)
  9: {
    missionId: 9,
    title: 'The Pattern Room',
    testCases: [
      { id: 1, input: '4', expectedOutput: '1\n12\n123\n1234', description: 'N = 4 rows' },
      { id: 2, input: '3', expectedOutput: '1\n12\n123', description: 'N = 3 rows' },
      { id: 3, input: '1', expectedOutput: '1', description: 'N = 1 single row', isHidden: true },
      { id: 4, input: '5', expectedOutput: '1\n12\n123\n1234\n12345', description: 'N = 5 rows', isHidden: true }
    ]
  },

  // MISSION 10 — The Cipher Machine (Caesar Cipher)
  10: {
    missionId: 10,
    title: 'The Cipher Machine',
    testCases: [
      { id: 1, input: 'HELLO\n3', expectedOutput: 'KHOOR', description: 'Uppercase HELLO shift 3' },
      { id: 2, input: 'abc\n1', expectedOutput: 'bcd', description: 'Lowercase abc shift 1' },
      { id: 3, input: 'XYZ\n3', expectedOutput: 'ABC', description: 'Uppercase wraparound XYZ -> ABC', isHidden: true },
      { id: 4, input: 'xyz\n2', expectedOutput: 'zab', description: 'Lowercase wraparound xyz -> zab', isHidden: true },
      { id: 5, input: 'Agent 007, Move Out!\n3', expectedOutput: 'Djhow 007, Pryh Rxw!', description: 'Punctuation, digits and spaces preserved', isHidden: true }
    ]
  },

  // MISSION 11 — The Inventory Quest (ArrayList add, remove, display)
  11: {
    missionId: 11,
    title: 'The Inventory Quest',
    testCases: [
      { id: 1, input: '4\n10 20 30 40\n20', expectedOutput: '10 30 40', description: 'Remove middle item 20' },
      { id: 2, input: '3\n100 200 300\n100', expectedOutput: '200 300', description: 'Remove first item 100' },
      { id: 3, input: '3\n5 8 9\n9', expectedOutput: '5 8', description: 'Remove last item 9', isHidden: true },
      { id: 4, input: '3\n10 20 30\n999', expectedOutput: '10 20 30', description: 'Remove non-existent item (unchanged list)', isHidden: true }
    ]
  },

  // MISSION 12 — The Robot Controller (Classes & move method)
  12: {
    missionId: 12,
    title: 'The Robot Controller',
    testCases: [
      { id: 1, input: 'Alpha\n0\n5', expectedOutput: 'Alpha final position: 5', description: 'Move 5 from 0' },
      { id: 2, input: 'Beta\n10\n15', expectedOutput: 'Beta final position: 25', description: 'Move 15 from 10' },
      { id: 3, input: 'Rover\n-5\n5', expectedOutput: 'Rover final position: 0', description: 'Negative start position', isHidden: true },
      { id: 4, input: 'Sentry\n50\n-20', expectedOutput: 'Sentry final position: 30', description: 'Backward move', isHidden: true }
    ]
  },

  // MISSION 13 — The Blueprint Mystery (Encapsulation Bank Account)
  13: {
    missionId: 13,
    title: 'The Blueprint Mystery',
    testCases: [
      { id: 1, input: '100\n50\n30', expectedOutput: 'Deposit: 50.0, Withdrawn: 30.0, Balance: 120.0', description: 'Valid withdrawal' },
      { id: 2, input: '100\n50\n200', expectedOutput: 'Deposit: 50.0, Insufficient Funds, Balance: 150.0', description: 'Overdraft rejected' },
      { id: 3, input: '50\n50\n100', expectedOutput: 'Deposit: 50.0, Withdrawn: 100.0, Balance: 0.0', description: 'Exact balance withdrawal', isHidden: true },
      { id: 4, input: '200\n0\n250', expectedOutput: 'Deposit: 0.0, Insufficient Funds, Balance: 200.0', description: 'Invalid withdrawal with zero deposit', isHidden: true }
    ]
  },

  // MISSION 14 — The Inheritance Lab (Employee & Manager)
  14: {
    missionId: 14,
    title: 'The Inheritance Lab',
    testCases: [
      { id: 1, input: 'Alice\nEngineering', expectedOutput: 'Employee: Alice, Department: Engineering', description: 'Alice in Engineering' },
      { id: 2, input: 'Bob\nFinance', expectedOutput: 'Employee: Bob, Department: Finance', description: 'Bob in Finance' },
      { id: 3, input: 'Carol\nSecurity', expectedOutput: 'Employee: Carol, Department: Security', description: 'Carol in Security', isHidden: true },
      { id: 4, input: 'David\nOperations', expectedOutput: 'Employee: David, Department: Operations', description: 'David in Operations', isHidden: true }
    ]
  },

  // MISSION 15 — The Shape Shifter (Polymorphism Shape area)
  15: {
    missionId: 15,
    title: 'The Shape Shifter',
    testCases: [
      { id: 1, input: 'Circle\n5', expectedOutput: 'Circle Area: 78.54', description: 'Circle radius 5' },
      { id: 2, input: 'Rectangle\n4\n6', expectedOutput: 'Rectangle Area: 24.00', description: 'Rectangle 4x6' },
      { id: 3, input: 'Triangle\n3\n4', expectedOutput: 'Triangle Area: 6.00', description: 'Triangle 3x4' },
      { id: 4, input: 'Circle\n10', expectedOutput: 'Circle Area: 314.16', description: 'Circle radius 10', isHidden: true },
      { id: 5, input: 'Rectangle\n7.5\n2', expectedOutput: 'Rectangle Area: 15.00', description: 'Decimal dimensions rectangle', isHidden: true }
    ]
  },

  // MISSION 16 — The Recursive Maze (Factorial Recursion)
  16: {
    missionId: 16,
    title: 'The Recursive Maze',
    testCases: [
      { id: 1, input: '5', expectedOutput: '120', description: 'Factorial of 5' },
      { id: 2, input: '4', expectedOutput: '24', description: 'Factorial of 4' },
      { id: 3, input: '0', expectedOutput: '1', description: 'Base case 0! = 1' },
      { id: 4, input: '1', expectedOutput: '1', description: 'Base case 1! = 1', isHidden: true },
      { id: 5, input: '7', expectedOutput: '5040', description: 'Factorial of 7', isHidden: true },
      { id: 6, input: '10', expectedOutput: '3628800', description: 'Factorial of 10', isHidden: true }
    ]
  },

  // MISSION 17 — The Exception Chamber (Try-catch Division by Zero)
  17: {
    missionId: 17,
    title: 'The Exception Chamber',
    testCases: [
      { id: 1, input: '10\n0', expectedOutput: 'Error: Cannot divide by zero!', description: 'Division by zero caught safely' },
      { id: 2, input: '20\n4', expectedOutput: 'Result: 5', description: 'Valid division 20 / 4' },
      { id: 3, input: '7\n2', expectedOutput: 'Result: 3', description: 'Integer truncation division', isHidden: true },
      { id: 4, input: '0\n5', expectedOutput: 'Result: 0', description: 'Numerator zero', isHidden: true },
      { id: 5, input: '-15\n0', expectedOutput: 'Error: Cannot divide by zero!', description: 'Negative numerator divided by zero', isHidden: true }
    ]
  },

  // MISSION 18 — The Database Mission (HashMap Student Lookup)
  18: {
    missionId: 18,
    title: 'The Database Mission',
    testCases: [
      { id: 1, input: '101', expectedOutput: 'Alice', description: 'Query ID 101' },
      { id: 2, input: '102', expectedOutput: 'Bob', description: 'Query ID 102' },
      { id: 3, input: '999', expectedOutput: 'Not Found', description: 'Unknown ID 999' },
      { id: 4, input: '103', expectedOutput: 'Charlie', description: 'Query ID 103', isHidden: true },
      { id: 5, input: '404', expectedOutput: 'Not Found', description: 'Unknown ID 404', isHidden: true }
    ]
  },

  // MISSION 19 — The Parallel Universe (Multithreading Order-Independent)
  19: {
    missionId: 19,
    title: 'The Parallel Universe',
    testCases: [
      { id: 1, input: 'START', expectedOutput: 'Thread-1: 1 2 3 4 5\nThread-2: A B C D E', description: 'Concurrent threads output' }
    ],
    customValidator: (actual: string) => {
      // Must contain Thread-1: 1 2 3 4 5 and Thread-2: A B C D E in any order
      const hasT1 = actual.includes('Thread-1: 1 2 3 4 5');
      const hasT2 = actual.includes('Thread-2: A B C D E');
      if (hasT1 && hasT2) {
        return { passed: true };
      }
      return { 
        passed: false, 
        reason: 'Missing required thread outputs. Expected both "Thread-1: 1 2 3 4 5" and "Thread-2: A B C D E".' 
      };
    }
  },

  // MISSION 20 — THE MASTER OVERRIDE (Student Management Boss)
  20: {
    missionId: 20,
    title: 'THE MASTER OVERRIDE',
    testCases: [
      { id: 1, input: '1001\nAlex Hunter\n85 90 78', expectedOutput: 'ID: 1001 | Name: Alex Hunter | Average: 84.3 | Status: PASSED', description: 'Passing student Alex' },
      { id: 2, input: '1002\nJordan Lee\n30 25 35', expectedOutput: 'ID: 1002 | Name: Jordan Lee | Average: 30.0 | Status: FAILED', description: 'Failing student Jordan' },
      { id: 3, input: '1003\nSam Taylor\n40 40 40', expectedOutput: 'ID: 1003 | Name: Sam Taylor | Average: 40.0 | Status: PASSED', description: 'Exact 40.0 threshold passed' },
      { id: 4, input: '1004\nElena Rostova\n95 100 98 92', expectedOutput: 'ID: 1004 | Name: Elena Rostova | Average: 96.3 | Status: PASSED', description: 'Honor student Elena', isHidden: true },
      { id: 5, input: '1005\nMarcus Kane\n39 39 39', expectedOutput: 'ID: 1005 | Name: Marcus Kane | Average: 39.0 | Status: FAILED', description: 'Failing student below 40.0', isHidden: true }
    ]
  }
};
