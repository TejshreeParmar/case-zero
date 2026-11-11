import { MissionData } from '../types/game';

export const CASES: MissionData[] = [
  // =========================================================================
  // LEVEL 1 — ROOKIE DETECTIVE (Easy)
  // =========================================================================

  // MISSION 01 — The Secret Vault
  {
    id: 'case-01',
    number: 'MISSION 01',
    missionNumberInt: 1,
    title: 'The Secret Vault',
    subtitle: 'The Parity Lockout',
    level: 'LEVEL 1 — ROOKIE DETECTIVE',
    difficulty: 'Easy',
    topic: 'Variables, input/output and if-else',
    client: 'VaultSec National Archive',
    systemName: 'VaultLock.java',
    storyline: 'A digital vault holding classified software archives requires a program to determine whether a security number is even or odd to verify authorization pins.',
    investigationObjectives: [
      'Analyze the security console error report',
      'Inspect the parity algorithm requirements',
      'Implement the even/odd decision logic in Java'
    ],
    clues: [
      'An even number is completely divisible by 2 with remainder 0.',
      'In Java, the modulo operator % computes the division remainder.',
      'Check if (number % 2 == 0) to print Even, otherwise print Odd.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Vault Access Controller Log',
        type: 'log',
        timestamp: '09:00:12 EST',
        content: 
          '[ACCESS] Card pin entered: 17\n[SYSTEM] Calling VaultLock.checkParity(17)\n[ERROR] Parity module not found! Default lock engaged.\n[OBJECTIVE] Implement VaultLock program to output "Odd" for 17.',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Write a Java program that reads an integer and prints "Even" if the number is divisible by 2, or "Odd" otherwise.',
    sampleInput: '17',
    expectedOutput: 'Odd',
    starterCode: `import java.util.Scanner;

public class VaultLock {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int number = scanner.nextInt();
            
            // TODO: Print "Even" if number is divisible by 2, otherwise print "Odd"
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class VaultLock {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int number = scanner.nextInt();
            if (number % 2 == 0) {
                System.out.println("Even");
            } else {
                System.out.println("Odd");
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '17', expectedOutput: 'Odd', description: 'Odd integer' },
      { id: 2, input: '42', expectedOutput: 'Even', description: 'Even integer' },
      { id: 3, input: '0', expectedOutput: 'Even', description: 'Zero parity' }
    ],
    hints: [
      'Hint 1: A number is even if dividing by 2 leaves no remainder.',
      'Hint 2: Use the Java modulo operator `%` to test remainder: `number % 2 == 0`.',
      'Hint 3: Use `if (number % 2 == 0) { System.out.println("Even"); } else { System.out.println("Odd"); }`.'
    ],
    explanation: 'The modulo operator `%` returns the remainder after division. Any integer `n` where `n % 2 == 0` is even; otherwise it is odd.',
    xpReward: 200,
    hintPenalty: 25
  },

  // MISSION 02 — The Password Decoder
  {
    id: 'case-02',
    number: 'MISSION 02',
    missionNumberInt: 2,
    title: 'The Password Decoder',
    subtitle: 'The Inverted Cyberspace Message',
    client: 'Bureau of Digital Intelligence',
    systemName: 'PasswordDecoder.java',
    level: 'LEVEL 1 — ROOKIE DETECTIVE',
    difficulty: 'Easy',
    topic: 'Strings and string manipulation',
    storyline: 'A mysterious encrypted dispatch was intercepted from an unknown rogue server. Intelligence confirms the payload is reversed and must be flipped backwards to decode.',
    investigationObjectives: [
      'Examine the intercepted reversed ciphertext',
      'Study Java String traversal and indexing',
      'Write a program to reverse the text string'
    ],
    clues: [
      'In Java, a String has length() characters indexed from 0 to length() - 1.',
      'You can iterate backwards from the last character or use StringBuilder.reverse().',
      'For input "JAVA", reading from end to start produces "AVAJ".'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Intercepted Radio Signal Buffer',
        type: 'log',
        timestamp: '10:14:00 UTC',
        content: 
          '[INTERCEPT] RAW_PAYLOAD: "JAVA"\n[ANALYSIS] Mirror encryption detected.\n[DECODING TARGET] Expected decoded string: "AVAJ"',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Write a Java program that reads a string and prints it in reverse order.',
    sampleInput: 'JAVA',
    expectedOutput: 'AVAJ',
    starterCode: `import java.util.Scanner;

public class PasswordDecoder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String message = scanner.next();
            
            // TODO: Reverse the string and print the reversed result
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class PasswordDecoder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String message = scanner.next();
            StringBuilder sb = new StringBuilder(message);
            System.out.println(sb.reverse().toString());
        }
    }
}`,
    testCases: [
      { id: 1, input: 'JAVA', expectedOutput: 'AVAJ', description: 'Sample word' },
      { id: 2, input: 'DETECTIVE', expectedOutput: 'EVITCETED', description: 'Longer string' },
      { id: 3, input: '12345', expectedOutput: '54321', description: 'Numeric string' }
    ],
    hints: [
      'Hint 1: You can build the reversed string by stepping backwards through each character.',
      'Hint 2: Alternatively, Java\'s `StringBuilder` class includes a built-in `.reverse()` method.',
      'Hint 3: `StringBuilder sb = new StringBuilder(message); System.out.println(sb.reverse().toString());` or loop `for(int i = message.length() - 1; i >= 0; i--)`.'
    ],
    explanation: 'Strings can be reversed either by iterating from index `length() - 1` down to 0, or by wrapping the string inside a `StringBuilder` and invoking its mutating `.reverse()` method.',
    xpReward: 200,
    hintPenalty: 25
  },

  // MISSION 03 — The Missing Code
  {
    id: 'case-03',
    number: 'MISSION 03',
    missionNumberInt: 3,
    title: 'The Missing Code',
    subtitle: 'The Lost Arithmetic Series',
    client: 'Metro Central Substation',
    systemName: 'SequenceRebuilder.java',
    level: 'LEVEL 1 — ROOKIE DETECTIVE',
    difficulty: 'Easy',
    topic: 'Loops and arithmetic',
    storyline: 'A power grid substation lost its synchronizing sequence index after an electrical surge. Reconstruct the control sequence by calculating the sum of all numbers from 1 to N.',
    investigationObjectives: [
      'Inspect the power grid telemetry log',
      'Determine the loop accumulation requirement',
      'Write a Java loop to compute the cumulative sum'
    ],
    clues: [
      'For N = 5, the sum is 1 + 2 + 3 + 4 + 5 = 15.',
      'Use an accumulator variable initialized to 0.',
      'Iterate with a for loop from i = 1 up to i = N, adding i on each step.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Substation Relay Diagnostic',
        type: 'log',
        timestamp: '11:20:15 EST',
        content: 
          '[RELAY] Target Sequence N = 5\n[ACCUMULATOR] Sum: 1 + 2 + 3 + 4 + 5 = 15\n[STATUS] Awaiting program output: "15"',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Write a Java program to calculate the sum of the first N natural numbers using a loop.',
    sampleInput: '5',
    expectedOutput: '15',
    starterCode: `import java.util.Scanner;

public class SequenceRebuilder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            
            // TODO: Compute the sum of natural numbers from 1 to n using a loop
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class SequenceRebuilder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int sum = 0;
            for (int i = 1; i <= n; i++) {
                sum += i;
            }
            System.out.println(sum);
        }
    }
}`,
    testCases: [
      { id: 1, input: '5', expectedOutput: '15', description: 'N = 5' },
      { id: 2, input: '10', expectedOutput: '55', description: 'N = 10' },
      { id: 3, input: '1', expectedOutput: '1', description: 'N = 1' }
    ],
    hints: [
      'Hint 1: Create an `int sum = 0;` variable before your loop.',
      'Hint 2: Run a `for` loop from `int i = 1; i <= n; i++`.',
      'Hint 3: Inside the loop, add `sum += i;`, then print `sum` after the loop terminates.'
    ],
    explanation: 'A `for` loop starting at `1` and terminating at `n` (inclusive) accumulates consecutive integer values into `sum`.',
    xpReward: 200,
    hintPenalty: 25
  },

  // MISSION 04 — The ATM Escape
  {
    id: 'case-04',
    number: 'MISSION 04',
    missionNumberInt: 4,
    title: 'The ATM Escape',
    subtitle: 'The Rogue Cash Machine Menu',
    client: 'Liberty Trust ATM Network',
    systemName: 'ATMCalculator.java',
    level: 'LEVEL 1 — ROOKIE DETECTIVE',
    difficulty: 'Easy',
    topic: 'Switch statements and conditional logic',
    storyline: 'An ATM terminal at downtown bank was locked down with an error screen. To reboot its cash dispenser, you must program its command interpreter using a switch statement.',
    investigationObjectives: [
      'Read the ATM operator specification',
      'Implement switch-based branching for +, -, *, and /',
      'Execute the transaction calculation'
    ],
    clues: [
      'A Java switch statement evaluates a variable against multiple case labels.',
      'The input contains two numbers followed by an operator string (+, -, *, /).',
      'Remember to use break statements inside each case.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'ATM Firmware Manual',
        type: 'report',
        timestamp: 'Section 4.2',
        content: 
          'Command Protocol: [Operand1] [Operand2] [Operator]\nOperators supported: + (add), - (subtract), * (multiply), / (divide).'
      }
    ],
    problemStatement: 'Create a simple calculator using a switch statement. Support +, -, *, and /. Read two numbers and an operator, then print the integer result.',
    sampleInput: '10 5\n+',
    expectedOutput: '15',
    starterCode: `import java.util.Scanner;

public class ATMCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double num1 = scanner.nextDouble();
            double num2 = scanner.nextDouble();
            String op = scanner.next();
            
            // TODO: Use a switch statement on 'op' to compute and print result
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class ATMCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double num1 = scanner.nextDouble();
            double num2 = scanner.nextDouble();
            String op = scanner.next();
            
            int result = 0;
            switch (op) {
                case "+":
                    result = (int)(num1 + num2);
                    break;
                case "-":
                    result = (int)(num1 - num2);
                    break;
                case "*":
                    result = (int)(num1 * num2);
                    break;
                case "/":
                    result = (int)(num1 / num2);
                    break;
            }
            System.out.println(result);
        }
    }
}`,
    testCases: [
      { id: 1, input: '10 5\n+', expectedOutput: '15', description: 'Addition' },
      { id: 2, input: '20 4\n-', expectedOutput: '16', description: 'Subtraction' },
      { id: 3, input: '6 7\n*', expectedOutput: '42', description: 'Multiplication' }
    ],
    hints: [
      'Hint 1: Use `switch (op)` to branch on the operator string.',
      'Hint 2: Provide cases for `"+"`, `"-"`, `"*"` and `"/"`.',
      'Hint 3: Ensure you `break;` after each case so execution does not fall through.'
    ],
    explanation: 'The `switch` statement in Java matches primitive values and Strings against constant `case` branches, providing clear menu-driven dispatch.'
    ,xpReward: 250,
    hintPenalty: 30
  },

  // MISSION 05 — The Treasure Calculator
  {
    id: 'case-05',
    number: 'MISSION 05',
    missionNumberInt: 5,
    title: 'The Treasure Calculator',
    subtitle: 'The Vault Clue Maximum',
    client: 'Metropolis Museum of History',
    systemName: 'TreasureFinder.java',
    level: 'LEVEL 1 — ROOKIE DETECTIVE',
    difficulty: 'Easy',
    topic: 'Arrays and array traversal',
    storyline: 'An ancient digitized museum vault holds an array of encrypted coordinate values. The key to the treasure lock is identifying the highest numeric value.',
    investigationObjectives: [
      'Read array length N and N integers',
      'Iterate across the array to track the maximum',
      'Print the maximum value discovered'
    ],
    clues: [
      'Initialize max to the first element array[0].',
      'Iterate through the array; if current element > max, update max.',
      'After the loop, print the maximum value.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Museum Artifact Catalog #741',
        type: 'log',
        timestamp: '14:02:11 EST',
        content: 
          '[CLUE] N = 5 items\n[VALUES] 12 45 23 67 19\n[PEAK] Maximum identified value: 67',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Read N integers into an array and find the maximum element.',
    sampleInput: '5\n12 45 23 67 19',
    expectedOutput: '67',
    starterCode: `import java.util.Scanner;

public class TreasureFinder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.nextInt();
            }
            
            // TODO: Find and print the maximum element in arr
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class TreasureFinder {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.nextInt();
            }
            
            int max = arr[0];
            for (int i = 1; i < n; i++) {
                if (arr[i] > max) {
                    max = arr[i];
                }
            }
            System.out.println(max);
        }
    }
}`,
    testCases: [
      { id: 1, input: '5\n12 45 23 67 19', expectedOutput: '67', description: 'Positive integers' },
      { id: 2, input: '4\n-10 -5 -20 -2', expectedOutput: '-2', description: 'Negative integers' },
      { id: 3, input: '1\n999', expectedOutput: '999', description: 'Single element' }
    ],
    hints: [
      'Hint 1: Start by assuming the first element `arr[0]` is the maximum.',
      'Hint 2: Loop from index `1` to `n - 1`. If `arr[i] > max`, set `max = arr[i]`.',
      'Hint 3: Print `max` once the loop terminates.'
    ],
    explanation: 'By setting `max = arr[0]` and scanning each remaining element with `if (arr[i] > max) max = arr[i];`, we find the global maximum in O(N) time.',
    xpReward: 250,
    hintPenalty: 30
  },

  // =========================================================================
  // LEVEL 2 — CODE INVESTIGATOR (Easy–Medium)
  // =========================================================================

  // MISSION 06 — The Number Hunter
  {
    id: 'case-06',
    number: 'MISSION 06',
    missionNumberInt: 6,
    title: 'The Number Hunter',
    subtitle: 'The Missing Database ID',
    level: 'LEVEL 2 — CODE INVESTIGATOR',
    difficulty: 'Easy-Medium',
    topic: 'Searching algorithms',
    client: 'Municipal Registry Bureau',
    systemName: 'RecordLocator.java',
    storyline: 'A suspect altered a record ID inside the municipal registry. You must locate the exact index position of the suspect ID or report if it was expunged.',
    investigationObjectives: [
      'Read array size, array elements, and query target',
      'Implement linear search to locate the element',
      'Print the zero-based index or "Not Found"'
    ],
    clues: [
      'Linear search examines elements sequentially from index 0.',
      'If arr[i] == target, print i and stop.',
      'If the loop completes without finding target, print "Not Found".'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Registry Search Log',
        type: 'log',
        timestamp: '16:00:00 UTC',
        content: 
          '[SCAN] Array: [10, 20, 30, 40, 50]\n[TARGET] 30\n[RESULT] Located at index 2',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Implement linear search to find a target element in an integer array. Print its zero-based index if found, otherwise print "Not Found".',
    sampleInput: '5\n10 20 30 40 50\n30',
    expectedOutput: '2',
    starterCode: `import java.util.Scanner;

public class NumberHunter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = scanner.nextInt();
            int target = scanner.nextInt();
            
            // TODO: Search for target in arr. Print index if found, else "Not Found"
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class NumberHunter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = scanner.nextInt();
            int target = scanner.nextInt();
            
            int foundIndex = -1;
            for (int i = 0; i < n; i++) {
                if (arr[i] == target) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex != -1) {
                System.out.println(foundIndex);
            } else {
                System.out.println("Not Found");
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '5\n10 20 30 40 50\n30', expectedOutput: '2', description: 'Target present' },
      { id: 2, input: '4\n1 2 3 4\n99', expectedOutput: 'Not Found', description: 'Target absent' },
      { id: 3, input: '3\n7 8 9\n7', expectedOutput: '0', description: 'Target at index 0' }
    ],
    hints: [
      'Hint 1: Use an integer variable `int foundIndex = -1;` to track discovery.',
      'Hint 2: Loop `for (int i = 0; i < n; i++)`. If `arr[i] == target`, set `foundIndex = i; break;`.',
      'Hint 3: Print `foundIndex` if not -1, otherwise `System.out.println("Not Found");`.'
    ],
    explanation: 'Linear search traverses the array from index `0` to `n - 1`. If a match is found, the index is recorded and the loop terminates; if no match is found, "Not Found" is reported.',
    xpReward: 300,
    hintPenalty: 35
  },

  // MISSION 07 — The Ranking System
  {
    id: 'case-07',
    number: 'MISSION 07',
    missionNumberInt: 7,
    title: 'The Ranking System',
    subtitle: 'The Scrambled Leaderboard',
    client: 'CyberSport Gaming Arena',
    systemName: 'LeaderboardSorter.java',
    level: 'LEVEL 2 — CODE INVESTIGATOR',
    difficulty: 'Easy-Medium',
    topic: 'Sorting algorithms',
    storyline: 'Tournament leaderboard rankings were corrupted by a malicious script right before the finals. You must implement Bubble Sort to restore ascending score order.',
    investigationObjectives: [
      'Read N integer player scores',
      'Implement Bubble Sort with nested loops',
      'Print the sorted integers separated by spaces'
    ],
    clues: [
      'Bubble Sort repeatedly compares adjacent elements and swaps them if out of order.',
      'An outer loop runs N - 1 passes, and an inner loop compares arr[j] and arr[j + 1].',
      'Output numbers on a single line separated by a space.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Corrupted Leaderboard Snapshot',
        type: 'log',
        timestamp: '18:30:10 UTC',
        content: 
          '[SCORES] 5 2 8 1 3\n[SORT GOAL] Ascending order: 1 2 3 5 8',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Implement Bubble Sort to arrange N integers in ascending order.',
    sampleInput: '5\n5 2 8 1 3',
    expectedOutput: '1 2 3 5 8',
    starterCode: `import java.util.Scanner;

public class LeaderboardSorter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = scanner.nextInt();
            
            // TODO: Implement Bubble Sort to sort arr in ascending order
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class LeaderboardSorter {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] arr = new int[n];
            for (int i = 0; i < n; i++) arr[i] = scanner.nextInt();
            
            for (int i = 0; i < n - 1; i++) {
                for (int j = 0; j < n - i - 1; j++) {
                    if (arr[j] > arr[j + 1]) {
                        int temp = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = temp;
                    }
                }
            }
            
            for (int i = 0; i < n; i++) {
                System.out.print(arr[i] + (i < n - 1 ? " " : ""));
            }
            System.out.println();
        }
    }
}`,
    testCases: [
      { id: 1, input: '5\n5 2 8 1 3', expectedOutput: '1 2 3 5 8', description: 'Unsorted array' },
      { id: 2, input: '3\n9 4 1', expectedOutput: '1 4 9', description: 'Reverse sorted array' },
      { id: 3, input: '4\n2 2 1 3', expectedOutput: '1 2 2 3', description: 'Array with duplicate values' }
    ],
    hints: [
      'Hint 1: Use nested `for` loops: outer `i` from `0` to `n - 2`, inner `j` from `0` to `n - i - 2`.',
      'Hint 2: Inside the inner loop, if `arr[j] > arr[j + 1]`, swap them using a temporary variable `temp`.',
      'Hint 3: Print the array elements joined by spaces after the sort completes.'
    ],
    explanation: 'Bubble Sort compares adjacent elements and swaps them when the left element exceeds the right element. Over N passes, the largest unsorted value bubbles to its correct position.',
    xpReward: 300,
    hintPenalty: 35
  },

  // MISSION 08 — The Codebreaker
  {
    id: 'case-08',
    number: 'MISSION 08',
    missionNumberInt: 8,
    title: 'The Codebreaker',
    subtitle: 'The Prime Key Validation',
    client: 'CipherKey Defense Labs',
    systemName: 'PrimeVerifier.java',
    level: 'LEVEL 2 — CODE INVESTIGATOR',
    difficulty: 'Easy-Medium',
    topic: 'Methods and functions',
    storyline: 'CipherKey Defense security barriers require prime cryptographic keys. Construct a modular Java method to check whether an integer is prime.',
    investigationObjectives: [
      'Define a reusable boolean method isPrime(int n)',
      'Account for base cases (numbers <= 1 are not prime)',
      'Print "Prime" or "Not Prime"'
    ],
    clues: [
      'A prime number is greater than 1 and has no divisors other than 1 and itself.',
      'Check divisibility from 2 up to the square root of n.',
      'Modularize the check inside a static boolean isPrime(int n) method.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Cryptographic Security Specs',
        type: 'report',
        timestamp: 'Lab Note #9',
        content: 
          'Definition: Primes are integers > 1 divisible only by 1 and n.\nSample verification: 13 -> Prime | 12 -> Not Prime'
      }
    ],
    problemStatement: 'Create a Java method that checks whether a number is prime. Read an integer and print "Prime" or "Not Prime".',
    sampleInput: '13',
    expectedOutput: 'Prime',
    starterCode: `import java.util.Scanner;

public class PrimeVerifier {
    // TODO: Implement isPrime method here
    public static boolean isPrime(int n) {
        return false;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            if (isPrime(n)) {
                System.out.println("Prime");
            } else {
                System.out.println("Not Prime");
            }
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class PrimeVerifier {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i === 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            if (isPrime(n)) {
                System.out.println("Prime");
            } else {
                System.out.println("Not Prime");
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '13', expectedOutput: 'Prime', description: 'Prime number 13' },
      { id: 2, input: '12', expectedOutput: 'Not Prime', description: 'Composite number 12' },
      { id: 3, input: '1', expectedOutput: 'Not Prime', description: 'Boundary value 1' }
    ],
    hints: [
      'Hint 1: If `n <= 1`, return `false` immediately.',
      'Hint 2: Loop from `int i = 2; i * i <= n; i++`. If `n % i == 0`, return `false`.',
      'Hint 3: If no divisors are found in the loop, return `true`.'
    ],
    explanation: 'Testing divisibility up to `Math.sqrt(n)` runs in O(sqrt(n)) time. If any integer divides `n` evenly, it cannot be prime.',
    xpReward: 300,
    hintPenalty: 35
  },

  // MISSION 09 — The Pattern Room
  {
    id: 'case-09',
    number: 'MISSION 09',
    missionNumberInt: 9,
    title: 'The Pattern Room',
    subtitle: 'The Triangle Matrix Door',
    client: 'Temple of Cryptic Logic',
    systemName: 'PatternGenerator.java',
    level: 'LEVEL 2 — CODE INVESTIGATOR',
    difficulty: 'Easy-Medium',
    topic: 'Nested loops',
    storyline: 'A mysterious sealed vault door in an underground computing lab unlocks only when projected with an exact triangular number matrix.',
    investigationObjectives: [
      'Examine the row-column relationship',
      'Use an outer loop for rows and inner loop for columns',
      'Print a right-angled triangle pattern for N rows'
    ],
    clues: [
      'Row 1 prints: 1',
      'Row 2 prints: 12',
      'Row 3 prints: 123',
      'Outer loop runs i from 1 to N; inner loop runs j from 1 to i.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Door Inscription Photo',
        type: 'log',
        timestamp: '19:10:00 UTC',
        content: 
          'Target Matrix (N=4):\n1\n12\n123\n1234',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Print a right-angled triangle number pattern for N rows.',
    sampleInput: '4',
    expectedOutput: '1\n12\n123\n1234',
    starterCode: `import java.util.Scanner;

public class PatternGenerator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            
            // TODO: Use nested loops to print right-angled triangle pattern
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class PatternGenerator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            for (int i = 1; i <= n; i++) {
                for (int j = 1; j <= i; j++) {
                    System.out.print(j);
                }
                System.out.println();
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '4', expectedOutput: '1\n12\n123\n1234', description: 'N = 4 rows' },
      { id: 2, input: '3', expectedOutput: '1\n12\n123', description: 'N = 3 rows' },
      { id: 3, input: '1', expectedOutput: '1', description: 'N = 1 single row' }
    ],
    hints: [
      'Hint 1: Use an outer `for` loop `for (int i = 1; i <= n; i++)` to control lines.',
      'Hint 2: Inside, use an inner loop `for (int j = 1; j <= i; j++) System.out.print(j);`.',
      'Hint 3: Call `System.out.println();` after the inner loop to start a new line.'
    ],
    explanation: 'Nested loops control 2D rendering: the outer loop advances down rows, while the inner loop prints numbers across columns up to row count `i`.',
    xpReward: 300,
    hintPenalty: 35
  },

  // MISSION 10 — The Cipher Machine
  {
    id: 'case-10',
    number: 'MISSION 10',
    missionNumberInt: 10,
    title: 'The Cipher Machine',
    subtitle: 'The Caesar Telegraph Relay',
    client: 'Foreign Consular Dispatch',
    systemName: 'CaesarCipher.java',
    level: 'LEVEL 2 — CODE INVESTIGATOR',
    difficulty: 'Easy-Medium',
    topic: 'Strings and character manipulation',
    storyline: 'A diplomatic embassy transmission was intercepted. To maintain communication security, implement a Caesar character-shifting cipher that preserves letter case.',
    investigationObjectives: [
      'Read plaintext string and integer shift amount',
      'Shift uppercase and lowercase alphabet characters with wrapping',
      'Preserve non-letter characters unchanged'
    ],
    clues: [
      'For uppercase: (c - \'A\' + shift) % 26 + \'A\'.',
      'For lowercase: (c - \'a\' + shift) % 26 + \'a\'.',
      'Non-alphabet characters like punctuation and digits remain untouched.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Cipher Specimen',
        type: 'report',
        timestamp: 'Telegraph Buffer',
        content: 
          'Shift: 3\nPlaintext: HELLO\nCiphertext: KHOOR'
      }
    ],
    problemStatement: 'Implement a Caesar cipher that shifts each English alphabet character forward by a specified number of positions. Preserve letter case and leave non-letter characters unchanged.',
    sampleInput: 'HELLO\n3',
    expectedOutput: 'KHOOR',
    starterCode: `import java.util.Scanner;

public class CaesarCipher {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String text = scanner.nextLine();
            int shift = scanner.nextInt();
            
            // TODO: Implement Caesar cipher shifting each letter by shift
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class CaesarCipher {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String text = scanner.nextLine();
            int shift = scanner.nextInt();
            StringBuilder result = new StringBuilder();
            
            for (char c : text.toCharArray()) {
                if (Character.isUpperCase(c)) {
                    result.append((char) ('A' + (c - 'A' + shift) % 26));
                } else if (Character.isLowerCase(c)) {
                    result.append((char) ('a' + (c - 'a' + shift) % 26));
                } else {
                    result.append(c);
                }
            }
            System.out.println(result.toString());
        }
    }
}`,
    testCases: [
      { id: 1, input: 'HELLO\n3', expectedOutput: 'KHOOR', description: 'Uppercase word with shift 3' },
      { id: 2, input: 'abc\n1', expectedOutput: 'bcd', description: 'Lowercase word with shift 1' },
      { id: 3, input: 'XYZ\n3', expectedOutput: 'ABC', description: 'Alphabet wraparound' }
    ],
    hints: [
      'Hint 1: Check if the character is upper or lower case using `Character.isUpperCase(c)`.',
      'Hint 2: Normalize the character code: `(c - \'A\' + shift) % 26 + \'A\'`.',
      'Hint 3: Append non-alphabetic characters directly without modification.'
    ],
    explanation: 'Modulo arithmetic `% 26` wraps characters back to the start of the alphabet when the shifted ASCII code exceeds \'Z\' or \'z\'.',
    xpReward: 350,
    hintPenalty: 40
  },

  // =========================================================================
  // LEVEL 3 — SENIOR INVESTIGATOR (Medium)
  // =========================================================================

  // MISSION 11 — The Inventory Quest
  {
    id: 'case-11',
    number: 'MISSION 11',
    missionNumberInt: 11,
    title: 'The Inventory Quest',
    subtitle: 'The Dynamic Stock Register',
    client: 'Apex Logistics Hub',
    systemName: 'InventoryManager.java',
    level: 'LEVEL 3 — SENIOR INVESTIGATOR',
    difficulty: 'Medium',
    topic: 'ArrayList and collections',
    storyline: 'A supply depot needs to update product IDs dynamically. Static arrays cannot handle warehouse deletions; implement an ArrayList to manage live inventory.',
    investigationObjectives: [
      'Add N product IDs into an ArrayList<Integer>',
      'Remove the specified product ID from the list',
      'Display the remaining product IDs'
    ],
    clues: [
      'Use ArrayList<Integer> list = new ArrayList<>()',
      'Use list.add() to populate items.',
      'To remove by object value rather than index, use list.remove(Integer.valueOf(target)).'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Depot Stock Manifest',
        type: 'log',
        timestamp: '08:15:20 EST',
        content: 
          '[INITIAL STOCK] 10, 20, 30, 40\n[DISPATCH ITEM] Remove item: 20\n[REMAINING STOCK] 10 30 40',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Use an ArrayList to: (1) Add product IDs, (2) Remove a specified product, (3) Display remaining products separated by space.',
    sampleInput: '4\n10 20 30 40\n20',
    expectedOutput: '10 30 40',
    starterCode: `import java.util.ArrayList;
import java.util.Scanner;

public class InventoryManager {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            ArrayList<Integer> inventory = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                inventory.add(scanner.nextInt());
            }
            int removeTarget = scanner.nextInt();
            
            // TODO: Remove removeTarget from inventory and print remaining items
            
        }
    }
}`,
    referenceSolution: `import java.util.ArrayList;
import java.util.Scanner;

public class InventoryManager {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            ArrayList<Integer> inventory = new ArrayList<>();
            for (int i = 0; i < n; i++) {
                inventory.add(scanner.nextInt());
            }
            int removeTarget = scanner.nextInt();
            
            inventory.remove(Integer.valueOf(removeTarget));
            
            for (int i = 0; i < inventory.size(); i++) {
                System.out.print(inventory.get(i) + (i < inventory.size() - 1 ? " " : ""));
            }
            System.out.println();
        }
    }
}`,
    testCases: [
      { id: 1, input: '4\n10 20 30 40\n20', expectedOutput: '10 30 40', description: 'Remove element 20' },
      { id: 2, input: '3\n100 200 300\n100', expectedOutput: '200 300', description: 'Remove first element' },
      { id: 3, input: '3\n5 8 9\n9', expectedOutput: '5 8', description: 'Remove last element' }
    ],
    hints: [
      'Hint 1: Be careful with `list.remove(int)` vs `list.remove(Object)`.',
      'Hint 2: To remove by numeric value rather than index, pass `Integer.valueOf(removeTarget)`.',
      'Hint 3: Iterate through `inventory` and print each item separated by spaces.'
    ],
    explanation: '`ArrayList<Integer>.remove(int index)` deletes the element at that index, while `.remove(Object o)` removes the first matching value.',
    xpReward: 400,
    hintPenalty: 45
  },

  // MISSION 12 — The Robot Controller
  {
    id: 'case-12',
    number: 'MISSION 12',
    missionNumberInt: 12,
    title: 'The Robot Controller',
    subtitle: 'The Autonomous Navigation Class',
    client: 'RoboTech Automation',
    systemName: 'RobotController.java',
    level: 'LEVEL 3 — SENIOR INVESTIGATOR',
    difficulty: 'Medium',
    topic: 'Classes and objects',
    storyline: 'An automated bomb-defusal robot cannot move until its control system is programmed using object-oriented principles.',
    investigationObjectives: [
      'Create a Robot class with name and position fields',
      'Implement a move(int steps) method',
      'Instantiate the robot and print its final position'
    ],
    clues: [
      'Classes encapsulate state (fields) and behavior (methods).',
      'The Robot class should have String name and int position.',
      'The move(int steps) method increases position by steps.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Robot Telemetry Spec',
        type: 'report',
        timestamp: 'Hardware Spec',
        content: 
          'Robot "Alpha" starts at position 0.\nmove(5) -> position becomes 5.\nOutput format: "Alpha final position: 5"'
      }
    ],
    problemStatement: 'Create a Robot class with name, initial position, and a move(int steps) method that updates position. Display the final position in the format: "[name] final position: [position]".',
    sampleInput: 'Alpha\n0\n5',
    expectedOutput: 'Alpha final position: 5',
    starterCode: `import java.util.Scanner;

// TODO: Create Robot class with name, position, and move() method
class Robot {
    String name;
    int position;
    
    public Robot(String name, int position) {
        this.name = name;
        this.position = position;
    }
    
    public void move(int steps) {
        // Update position
    }
}

public class RobotController {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String name = scanner.next();
            int startPos = scanner.nextInt();
            int steps = scanner.nextInt();
            
            Robot bot = new Robot(name, startPos);
            bot.move(steps);
            System.out.println(bot.name + " final position: " + bot.position);
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

class Robot {
    String name;
    int position;
    
    public Robot(String name, int position) {
        this.name = name;
        this.position = position;
    }
    
    public void move(int steps) {
        this.position += steps;
    }
}

public class RobotController {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String name = scanner.next();
            int startPos = scanner.nextInt();
            int steps = scanner.nextInt();
            
            Robot bot = new Robot(name, startPos);
            bot.move(steps);
            System.out.println(bot.name + " final position: " + bot.position);
        }
    }
}`,
    testCases: [
      { id: 1, input: 'Alpha\n0\n5', expectedOutput: 'Alpha final position: 5', description: 'Alpha moves 5 steps' },
      { id: 2, input: 'Beta\n10\n15', expectedOutput: 'Beta final position: 25', description: 'Beta starts at 10 and moves 15' },
      { id: 3, input: 'Rover\n-5\n5', expectedOutput: 'Rover final position: 0', description: 'Rover from negative to zero' }
    ],
    hints: [
      'Hint 1: Inside `Robot.move(int steps)`, add `this.position += steps;`.',
      'Hint 2: The fields in the class store the internal state of each distinct robot instance.',
      'Hint 3: Ensure your print matches: `bot.name + " final position: " + bot.position`.'
    ],
    explanation: 'Object-oriented programming bundles data (fields) and methods (behavior) inside class definitions, creating distinct instances with independent state.',
    xpReward: 400,
    hintPenalty: 45
  },

  // MISSION 13 — The Blueprint Mystery
  {
    id: 'case-13',
    number: 'MISSION 13',
    missionNumberInt: 13,
    title: 'The Blueprint Mystery',
    subtitle: 'The Encapsulated Bank Account',
    client: 'First Federal Vault',
    systemName: 'AccountManager.java',
    level: 'LEVEL 3 — SENIOR INVESTIGATOR',
    difficulty: 'Medium',
    topic: 'Constructors and encapsulation',
    storyline: 'A rogue banking API allowed accounts to be drafted below zero. Encapsulate the account balance to reject invalid withdrawals.',
    investigationObjectives: [
      'Implement private balance field and constructor',
      'Implement deposit(amount) and withdraw(amount) methods',
      'Prevent withdrawals exceeding available balance'
    ],
    clues: [
      'Encapsulation hides internal data fields behind public getter/setter/business methods.',
      'If withdraw amount > balance, reject the withdrawal and print "Insufficient Funds".',
      'Output format: "Deposit: [dep], Withdrawn: [wit], Balance: [bal]" or with "Insufficient Funds".'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Banking Security Directive',
        type: 'report',
        timestamp: 'Section 9.1',
        content: 
          'Rule: Overdrafts strictly prohibited. If withdrawal exceeds balance, output "Insufficient Funds" without modifying balance.'
      }
    ],
    problemStatement: 'Create a BankAccount class with account holder name, initial balance, constructor, deposit(), withdraw(), and balance check. Prevent withdrawals that exceed the balance.',
    sampleInput: '100\n50\n30',
    expectedOutput: 'Deposit: 50.0, Withdrawn: 30.0, Balance: 120.0',
    starterCode: `import java.util.Scanner;

class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        this.balance += amount;
    }
    
    public boolean withdraw(double amount) {
        // TODO: Only withdraw if amount <= balance
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
}

public class AccountManager {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double initial = scanner.nextDouble();
            double dep = scanner.nextDouble();
            double wit = scanner.nextDouble();
            
            BankAccount acc = new BankAccount(initial);
            acc.deposit(dep);
            if (acc.withdraw(wit)) {
                System.out.println("Deposit: " + dep + ", Withdrawn: " + wit + ", Balance: " + acc.getBalance());
            } else {
                System.out.println("Deposit: " + dep + ", Insufficient Funds, Balance: " + acc.getBalance());
            }
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        this.balance += amount;
    }
    
    public boolean withdraw(double amount) {
        if (amount <= balance) {
            balance -= amount;
            return true;
        }
        return false;
    }
    
    public double getBalance() {
        return balance;
    }
}

public class AccountManager {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextDouble()) {
            double initial = scanner.nextDouble();
            double dep = scanner.nextDouble();
            double wit = scanner.nextDouble();
            
            BankAccount acc = new BankAccount(initial);
            acc.deposit(dep);
            if (acc.withdraw(wit)) {
                System.out.println("Deposit: " + dep + ", Withdrawn: " + wit + ", Balance: " + acc.getBalance());
            } else {
                System.out.println("Deposit: " + dep + ", Insufficient Funds, Balance: " + acc.getBalance());
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '100\n50\n30', expectedOutput: 'Deposit: 50.0, Withdrawn: 30.0, Balance: 120.0', description: 'Valid withdrawal' },
      { id: 2, input: '100\n50\n200', expectedOutput: 'Deposit: 50.0, Insufficient Funds, Balance: 150.0', description: 'Overdraft rejected' },
      { id: 3, input: '50\n50\n100', expectedOutput: 'Deposit: 50.0, Withdrawn: 100.0, Balance: 0.0', description: 'Exact balance withdrawal' }
    ],
    hints: [
      'Hint 1: Inside `withdraw(double amount)`, test `if (amount <= balance)`.',
      'Hint 2: If true, subtract `balance -= amount;` and `return true;`.',
      'Hint 3: Otherwise do not modify balance and `return false;`.'
    ],
    explanation: 'Encapsulation protects fields using private access modifiers, ensuring state changes only occur through validated method business logic.',
    xpReward: 400,
    hintPenalty: 45
  },

  // MISSION 14 — The Inheritance Lab
  {
    id: 'case-14',
    number: 'MISSION 14',
    missionNumberInt: 14,
    title: 'The Inheritance Lab',
    subtitle: 'The Department Manager Extension',
    client: 'OmniTech Enterprise Solutions',
    systemName: 'OrganizationDirectory.java',
    level: 'LEVEL 3 — SENIOR INVESTIGATOR',
    difficulty: 'Medium',
    topic: 'Inheritance',
    storyline: 'OmniTech Enterprise is modeling its corporate directory. Implement inheritance using an Employee base class and a derived Manager class with department details.',
    investigationObjectives: [
      'Create base class Employee with name',
      'Create subclass Manager using the extends keyword',
      'Display combined employee and manager details'
    ],
    clues: [
      'In Java, a subclass inherits superclass fields and methods using extends.',
      'The Manager class calls super(name) to initialize inherited attributes.',
      'Output format: "Employee: [name], Department: [dept]".'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Corporate Directory Blueprint',
        type: 'report',
        timestamp: 'Architecture Doc',
        content: 
          'Class hierarchy: Employee -> Manager (adds department).\nDisplay format: "Employee: Alice, Department: Engineering"'
      }
    ],
    problemStatement: 'Create a base class Employee and derived class Manager. The base class contains name; the derived class inherits it and adds a department field. Display all information.',
    sampleInput: 'Alice\nEngineering',
    expectedOutput: 'Employee: Alice, Department: Engineering',
    starterCode: `import java.util.Scanner;

class Employee {
    String name;
    public Employee(String name) {
        this.name = name;
    }
}

// TODO: Create Manager subclass extending Employee with department field
class Manager extends Employee {
    String department;
    
    public Manager(String name, String department) {
        super(name);
        this.department = department;
    }
}

public class OrganizationDirectory {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String name = scanner.next();
            String dept = scanner.next();
            
            Manager mgr = new Manager(name, dept);
            System.out.println("Employee: " + mgr.name + ", Department: " + mgr.department);
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

class Employee {
    String name;
    public Employee(String name) {
        this.name = name;
    }
}

class Manager extends Employee {
    String department;
    
    public Manager(String name, String department) {
        super(name);
        this.department = department;
    }
}

public class OrganizationDirectory {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String name = scanner.next();
            String dept = scanner.next();
            
            Manager mgr = new Manager(name, dept);
            System.out.println("Employee: " + mgr.name + ", Department: " + mgr.department);
        }
    }
}`,
    testCases: [
      { id: 1, input: 'Alice\nEngineering', expectedOutput: 'Employee: Alice, Department: Engineering', description: 'Manager Alice in Engineering' },
      { id: 2, input: 'Bob\nFinance', expectedOutput: 'Employee: Bob, Department: Finance', description: 'Manager Bob in Finance' },
      { id: 3, input: 'Carol\nSecurity', expectedOutput: 'Employee: Carol, Department: Security', description: 'Manager Carol in Security' }
    ],
    hints: [
      'Hint 1: Use `class Manager extends Employee` to inherit from Employee.',
      'Hint 2: In the constructor `Manager(String name, String department)`, call `super(name);`.',
      'Hint 3: Assign `this.department = department;`.'
    ],
    explanation: 'Inheritance allows a subclass to reuse fields and methods from a superclass while adding specialized fields (`department`) and behaviors.',
    xpReward: 400,
    hintPenalty: 45
  },

  // MISSION 15 — The Shape Shifter
  {
    id: 'case-15',
    number: 'MISSION 15',
    missionNumberInt: 15,
    title: 'The Shape Shifter',
    subtitle: 'The Polymorphic Graphics Pipeline',
    client: 'PixelRender VFX Studio',
    systemName: 'GeometryEngine.java',
    level: 'LEVEL 3 — SENIOR INVESTIGATOR',
    difficulty: 'Medium',
    topic: 'Polymorphism and method overriding',
    storyline: 'A vector graphics engine needs to calculate areas for different geometric shapes through a shared polymorphic Shape reference.',
    investigationObjectives: [
      'Define base class Shape with area() method',
      'Create Circle, Rectangle, and Triangle subclasses overriding area()',
      'Invoke area() through a Shape polymorphic reference'
    ],
    clues: [
      'Circle area: PI * r * r (formatted to 2 decimal places).',
      'Rectangle area: width * height.',
      'Triangle area: 0.5 * base * height.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'VFX Geometry Spec',
        type: 'report',
        timestamp: 'Formula Reference',
        content: 
          'Circle(r=5) Area: 78.54 | Rectangle(w=4, h=6) Area: 24.00 | Triangle(b=3, h=4) Area: 6.00'
      }
    ],
    problemStatement: 'Create a base class Shape with an area() method. Create derived classes Circle, Rectangle, and Triangle overriding area(). Print the calculated area formatted to 2 decimal places.',
    sampleInput: 'Circle\n5',
    expectedOutput: 'Circle Area: 78.54',
    starterCode: `import java.util.Scanner;

abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double radius;
    public Circle(double r) { this.radius = r; }
    double area() { return Math.PI * radius * radius; }
}

public class GeometryEngine {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String type = scanner.next();
            if ("Circle".equalsIgnoreCase(type)) {
                double r = scanner.nextDouble();
                Shape s = new Circle(r);
                System.out.printf("Circle Area: %.2f\\n", s.area());
            }
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

abstract class Shape {
    abstract double area();
}

class Circle extends Shape {
    double radius;
    public Circle(double r) { this.radius = r; }
    double area() { return Math.PI * radius * radius; }
}

class Rectangle extends Shape {
    double width, height;
    public Rectangle(double w, double h) { this.width = w; this.height = h; }
    double area() { return width * height; }
}

class Triangle extends Shape {
    double base, height;
    public Triangle(double b, double h) { this.base = b; this.height = h; }
    double area() { return 0.5 * base * height; }
}

public class GeometryEngine {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String type = scanner.next();
            if ("Circle".equalsIgnoreCase(type)) {
                double r = scanner.nextDouble();
                Shape s = new Circle(r);
                System.out.printf("Circle Area: %.2f\\n", s.area());
            } else if ("Rectangle".equalsIgnoreCase(type)) {
                double w = scanner.nextDouble();
                double h = scanner.nextDouble();
                Shape s = new Rectangle(w, h);
                System.out.printf("Rectangle Area: %.2f\\n", s.area());
            } else {
                double b = scanner.nextDouble();
                double h = scanner.nextDouble();
                Shape s = new Triangle(b, h);
                System.out.printf("Triangle Area: %.2f\\n", s.area());
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: 'Circle\n5', expectedOutput: 'Circle Area: 78.54', description: 'Circle radius 5' },
      { id: 2, input: 'Rectangle\n4\n6', expectedOutput: 'Rectangle Area: 24.00', description: 'Rectangle 4x6' },
      { id: 3, input: 'Triangle\n3\n4', expectedOutput: 'Triangle Area: 6.00', description: 'Triangle 3x4' }
    ],
    hints: [
      'Hint 1: Use an abstract `Shape` class with `abstract double area();`.',
      'Hint 2: Override `area()` in Circle (`Math.PI * r * r`), Rectangle (`w * h`), and Triangle (`0.5 * b * h`).',
      'Hint 3: Use `System.out.printf("%.2f")` for exact 2 decimal places.'
    ],
    explanation: 'Runtime polymorphism allows methods to be invoked dynamically based on the actual object instance, even when referenced through a base class type.',
    xpReward: 450,
    hintPenalty: 50
  },

  // =========================================================================
  // LEVEL 4 — ELITE CODE SPECIALIST (Hard)
  // =========================================================================

  // MISSION 16 — The Recursive Maze
  {
    id: 'case-16',
    number: 'MISSION 16',
    missionNumberInt: 16,
    title: 'The Recursive Maze',
    subtitle: 'The Labyrinth Factorial Lock',
    client: 'CyberTomb Archaeological Dig',
    systemName: 'RecursiveLock.java',
    level: 'LEVEL 4 — ELITE CODE SPECIALIST',
    difficulty: 'Hard',
    topic: 'Recursion',
    storyline: 'A hidden security door inside an ancient automated bunker requires the factorial of a sequence seed to disengage its locks.',
    investigationObjectives: [
      'Implement recursive factorial method',
      'Establish base case for n <= 1',
      'Compute factorial of non-negative integer'
    ],
    clues: [
      'Factorial of N (N!) is N * (N - 1) * ... * 1.',
      'Base case: if n <= 1, return 1.',
      'Recursive step: return n * factorial(n - 1).'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Vault Labyrinth Inscription',
        type: 'log',
        timestamp: '20:00:00 UTC',
        content: 
          'Seed: 5\n5! = 5 * 4 * 3 * 2 * 1 = 120\nOutput required: "120"',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Write a recursive Java method to calculate the factorial of a non-negative integer.',
    sampleInput: '5',
    expectedOutput: '120',
    starterCode: `import java.util.Scanner;

public class RecursiveLock {
    // TODO: Write recursive factorial method
    public static long factorial(int n) {
        return 1;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            System.out.println(factorial(n));
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class RecursiveLock {
    public static long factorial(int n) {
        if (n <= 1) return 1;
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            System.out.println(factorial(n));
        }
    }
}`,
    testCases: [
      { id: 1, input: '5', expectedOutput: '120', description: 'Factorial of 5' },
      { id: 2, input: '4', expectedOutput: '24', description: 'Factorial of 4' },
      { id: 3, input: '0', expectedOutput: '1', description: 'Factorial of 0' }
    ],
    hints: [
      'Hint 1: If `n <= 1`, return `1;` as the termination base case.',
      'Hint 2: For `n > 1`, return `n * factorial(n - 1);`.',
      'Hint 3: Ensure the method calls itself with `n - 1` to converge toward the base case.'
    ],
    explanation: 'Recursive algorithms solve problems by breaking them into smaller instances of the same problem until reaching a termination base case.',
    xpReward: 500,
    hintPenalty: 50
  },

  // MISSION 17 — The Exception Chamber
  {
    id: 'case-17',
    number: 'MISSION 17',
    missionNumberInt: 17,
    title: 'The Exception Chamber',
    subtitle: 'The Zero-Division Failsafe',
    client: 'SafetyCore Aerospace',
    systemName: 'SafeDivision.java',
    level: 'LEVEL 4 — ELITE CODE SPECIALIST',
    difficulty: 'Hard',
    topic: 'Exception handling',
    storyline: 'An aerospace trajectory calculator crashes unexpectedly whenever zero division is encountered. Build a resilient division system using try-catch.',
    investigationObjectives: [
      'Read two integer operands',
      'Wrap division in a try block',
      'Catch ArithmeticException and print an error message safely'
    ],
    clues: [
      'Dividing an integer by 0 throws java.lang.ArithmeticException.',
      'Catch ArithmeticException and output "Error: Cannot divide by zero!".',
      'For valid division, output "Result: [value]".'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Aerospace Crash Telemetry',
        type: 'log',
        timestamp: '21:30:10 UTC',
        content: 
          '[ERROR] java.lang.ArithmeticException: / by zero\n[GOAL] Catch exception and print "Error: Cannot divide by zero!" without crashing.'
      }
    ],
    problemStatement: 'Create a division program that reads two integers, handles division by zero using try-catch, displays an error message, and continues safely.',
    sampleInput: '10\n0',
    expectedOutput: 'Error: Cannot divide by zero!',
    starterCode: `import java.util.Scanner;

public class SafeDivision {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            
            // TODO: Use try-catch to divide a by b safely
            
        }
    }
}`,
    referenceSolution: `import java.util.Scanner;

public class SafeDivision {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            
            try {
                int res = a / b;
                System.out.println("Result: " + res);
            } catch (ArithmeticException e) {
                System.out.println("Error: Cannot divide by zero!");
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '10\n0', expectedOutput: 'Error: Cannot divide by zero!', description: 'Division by zero' },
      { id: 2, input: '20\n4', expectedOutput: 'Result: 5', description: 'Valid division 20 / 4' },
      { id: 3, input: '7\n2', expectedOutput: 'Result: 3', description: 'Integer truncation division' }
    ],
    hints: [
      'Hint 1: Place `int res = a / b;` inside a `try { ... }` block.',
      'Hint 2: Add `catch (ArithmeticException e) { System.out.println("Error: Cannot divide by zero!"); }`.',
      'Hint 3: On success, print `"Result: " + res`.'
    ],
    explanation: '`try-catch` blocks intercept runtime exceptions, allowing systems to log errors and recover gracefully without crashing the JVM.',
    xpReward: 500,
    hintPenalty: 50
  },

  // MISSION 18 — The Database Mission
  {
    id: 'case-18',
    number: 'MISSION 18',
    missionNumberInt: 18,
    title: 'The Database Mission',
    subtitle: 'The University Student Hash Map',
    client: 'Metropolis University Registrar',
    systemName: 'StudentDirectory.java',
    level: 'LEVEL 4 — ELITE CODE SPECIALIST',
    difficulty: 'Hard',
    topic: 'HashMap and collections',
    storyline: 'The student registrar requires an O(1) hash table lookup to search for student names by their unique student ID.',
    investigationObjectives: [
      'Instantiate a HashMap<String, String>',
      'Add student records (ID -> Name)',
      'Query by ID and print the name or "Not Found"'
    ],
    clues: [
      'HashMap stores key-value pairs with fast lookup.',
      'Use map.put(id, name) to insert records.',
      'Use map.getOrDefault(id, "Not Found") or check map.containsKey(id).'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Registrar Database Schema',
        type: 'report',
        timestamp: 'DB Spec',
        content: 
          'Pre-loaded records: 101 -> Alice | 102 -> Bob | 103 -> Charlie\nQuery for 101 prints "Alice"; query for 999 prints "Not Found".'
      }
    ],
    problemStatement: 'Use HashMap to store student IDs and names. Allow searching by ID, displaying the name if found, or printing "Not Found" otherwise.',
    sampleInput: '101',
    expectedOutput: 'Alice',
    starterCode: `import java.util.HashMap;
import java.util.Scanner;

public class StudentDirectory {
    public static void main(String[] args) {
        HashMap<String, String> students = new HashMap<>();
        students.put("101", "Alice");
        students.put("102", "Bob");
        students.put("103", "Charlie");
        
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String queryId = scanner.next();
            
            // TODO: Search for queryId in students and print name or "Not Found"
            
        }
    }
}`,
    referenceSolution: `import java.util.HashMap;
import java.util.Scanner;

public class StudentDirectory {
    public static void main(String[] args) {
        HashMap<String, String> students = new HashMap<>();
        students.put("101", "Alice");
        students.put("102", "Bob");
        students.put("103", "Charlie");
        
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNext()) {
            String queryId = scanner.next();
            if (students.containsKey(queryId)) {
                System.out.println(students.get(queryId));
            } else {
                System.out.println("Not Found");
            }
        }
    }
}`,
    testCases: [
      { id: 1, input: '101', expectedOutput: 'Alice', description: 'Find Alice' },
      { id: 2, input: '102', expectedOutput: 'Bob', description: 'Find Bob' },
      { id: 3, input: '999', expectedOutput: 'Not Found', description: 'ID not found' }
    ],
    hints: [
      'Hint 1: Use `students.containsKey(queryId)` to check if the student exists.',
      'Hint 2: If found, print `students.get(queryId)`.',
      'Hint 3: Otherwise print `"Not Found"`.'
    ],
    explanation: '`HashMap` provides average O(1) time complexity for insertions and lookups based on key hashing.',
    xpReward: 500,
    hintPenalty: 50
  },

  // MISSION 19 — The Parallel Universe
  {
    id: 'case-19',
    number: 'MISSION 19',
    missionNumberInt: 19,
    title: 'The Parallel Universe',
    subtitle: 'The Concurrent Processor Threads',
    client: 'HyperThread Cloud Core',
    systemName: 'ParallelWorker.java',
    level: 'LEVEL 4 — ELITE CODE SPECIALIST',
    difficulty: 'Hard',
    topic: 'Multithreading and concurrent execution',
    storyline: 'Two independent compute nodes must execute tasks simultaneously without blocking one another. Build two concurrent Java threads.',
    investigationObjectives: [
      'Create Thread 1 to print numbers 1 to 5',
      'Create Thread 2 to print letters A to E',
      'Start both threads and demonstrate concurrent execution'
    ],
    clues: [
      'In Java, threads can be created by extending Thread or implementing Runnable.',
      'Thread 1 prints numbers 1 to 5.',
      'Thread 2 prints letters A to E.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Concurrency Kernel Monitor',
        type: 'log',
        timestamp: '22:00:00 UTC',
        content: 
          '[KERNEL] Spawning Thread-1 (Numbers: 1 2 3 4 5)\n[KERNEL] Spawning Thread-2 (Letters: A B C D E)\nThreads executing concurrently.'
      }
    ],
    problemStatement: 'Create two Java threads: Thread 1 prints numbers 1 to 5, and Thread 2 prints letters A to E. Start both threads concurrently.',
    sampleInput: 'START',
    expectedOutput: 'Thread-1: 1 2 3 4 5\nThread-2: A B C D E',
    starterCode: `public class ParallelWorker {
    public static void main(String[] args) {
        // TODO: Create Thread 1 (prints numbers 1 to 5)
        // TODO: Create Thread 2 (prints letters A to E)
        // Start both threads
        
        System.out.println("Thread-1: 1 2 3 4 5");
        System.out.println("Thread-2: A B C D E");
    }
}`,
    referenceSolution: `public class ParallelWorker {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            System.out.println("Thread-1: 1 2 3 4 5");
        });
        Thread t2 = new Thread(() -> {
            System.out.println("Thread-2: A B C D E");
        });
        t1.start();
        t2.start();
        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {}
    }
}`,
    testCases: [
      { id: 1, input: 'START', expectedOutput: 'Thread-1: 1 2 3 4 5\nThread-2: A B C D E', description: 'Concurrent threads output' }
    ],
    hints: [
      'Hint 1: Instantiate two `Thread` instances passing Runnables: `new Thread(() -> { ... })`.',
      'Hint 2: Call `.start()` on both threads to run them asynchronously.',
      'Hint 3: Use `.join()` if you need the main thread to wait for their completion.'
    ],
    explanation: 'Multithreading allows multiple threads of execution to run concurrently on modern multi-core processors, maximizing system throughput.',
    xpReward: 600,
    hintPenalty: 50
  },

  // MISSION 20 — THE MASTER OVERRIDE (FINAL BOSS)
  {
    id: 'case-20',
    number: 'MISSION 20',
    missionNumberInt: 20,
    title: 'THE MASTER OVERRIDE',
    subtitle: 'The Central University Restoration',
    level: 'LEVEL 4 — ELITE CODE SPECIALIST',
    difficulty: 'Final Boss',
    topic: 'Comprehensive OOP, Collections & Exception Handling',
    client: 'Metropolitan University HQ',
    systemName: 'MasterOverride.java',
    storyline: 'The central university network was maliciously locked down. You must synthesize all your Java skills—classes, constructors, ArrayList/HashMap, conditionals, average calculations, and exception handling—to restore student verification and unlock the campus!',
    investigationObjectives: [
      'Read student ID, name, and subject marks',
      'Calculate average marks and determine pass/fail (pass threshold >= 40)',
      'Format output: "ID: [id] | Name: [name] | Average: [avg] | Status: [PASSED/FAILED]"',
      'Handle invalid inputs safely'
    ],
    clues: [
      'Pass threshold is 40.0: average >= 40 is PASSED, otherwise FAILED.',
      'Average is the sum of marks divided by the count, formatted to 1 decimal place.',
      'Combine OOP encapsulation with robust exception handling.'
    ],
    evidence: [
      {
        id: 'ev-01',
        title: 'Master Campus Access Console',
        type: 'log',
        timestamp: '00:00:00 FINAL BOSS',
        content: 
          '[ALERT] Central System Locked!\nInput: ID 1001, Alex Hunter, Marks: 85 90 78\nExpected: ID: 1001 | Name: Alex Hunter | Average: 84.3 | Status: PASSED',
        isKeyEvidence: true
      }
    ],
    problemStatement: 'Create a student management program using OOP, constructors, methods, and conditionals. Read student ID, name, and marks. Compute average marks, evaluate pass/fail (threshold 40), and display output formatted as: "ID: [id] | Name: [name] | Average: [avg] | Status: [PASSED/FAILED]".',
    sampleInput: '1001\nAlex Hunter\n85 90 78',
    expectedOutput: 'ID: 1001 | Name: Alex Hunter | Average: 84.3 | Status: PASSED',
    starterCode: `import java.util.*;

class Student {
    String id;
    String name;
    List<Double> marks = new ArrayList<>();

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public void addMark(double mark) {
        marks.add(mark);
    }

    public double calculateAverage() {
        if (marks.isEmpty()) return 0.0;
        double sum = 0;
        for (double m : marks) sum += m;
        return sum / marks.size();
    }

    public String getStatus() {
        return calculateAverage() >= 40.0 ? "PASSED" : "FAILED";
    }
}

public class MasterOverride {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String id = scanner.nextLine();
            String name = scanner.nextLine();
            String[] markTokens = scanner.nextLine().split("\\\\s+");

            Student student = new Student(id, name);
            for (String tok : markTokens) {
                student.addMark(Double.parseDouble(tok));
            }

            double avg = student.calculateAverage();
            System.out.printf("ID: %s | Name: %s | Average: %.1f | Status: %s\\n",
                student.id, student.name, avg, student.getStatus());
        }
    }
}`,
    referenceSolution: `import java.util.*;

class Student {
    String id;
    String name;
    List<Double> marks = new ArrayList<>();

    public Student(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public void addMark(double mark) {
        marks.add(mark);
    }

    public double calculateAverage() {
        if (marks.isEmpty()) return 0.0;
        double sum = 0;
        for (double m : marks) sum += m;
        return sum / marks.size();
    }

    public String getStatus() {
        return calculateAverage() >= 40.0 ? "PASSED" : "FAILED";
    }
}

public class MasterOverride {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String id = scanner.nextLine();
            String name = scanner.nextLine();
            String[] markTokens = scanner.nextLine().split("\\\\s+");

            Student student = new Student(id, name);
            for (String tok : markTokens) {
                student.addMark(Double.parseDouble(tok));
            }

            double avg = student.calculateAverage();
            System.out.printf("ID: %s | Name: %s | Average: %.1f | Status: %s\\n",
                student.id, student.name, avg, student.getStatus());
        }
    }
}`,
    testCases: [
      { id: 1, input: '1001\nAlex Hunter\n85 90 78', expectedOutput: 'ID: 1001 | Name: Alex Hunter | Average: 84.3 | Status: PASSED', description: 'Passing student Alex' },
      { id: 2, input: '1002\nJordan Lee\n30 25 35', expectedOutput: 'ID: 1002 | Name: Jordan Lee | Average: 30.0 | Status: FAILED', description: 'Failing student Jordan (< 40)' },
      { id: 3, input: '1003\nSam Taylor\n40 40 40', expectedOutput: 'ID: 1003 | Name: Sam Taylor | Average: 40.0 | Status: PASSED', description: 'Exact threshold 40.0' }
    ],
    hints: [
      'Hint 1: Accumulate all marks in an ArrayList and calculate sum / marks.size().',
      'Hint 2: Compare `average >= 40.0 ? "PASSED" : "FAILED"`.',
      'Hint 3: Format the output string using `printf` or String.format: `ID: %s | Name: %s | Average: %.1f | Status: %s`.'
    ],
    explanation: 'The Master Override represents the pinnacle of Java software craftsmanship—combining encapsulation, collections, algorithms, and business logic into a unified production program.',
    xpReward: 1000,
    hintPenalty: 60
  }
];
