import express from 'express';
import cors from 'cors';
import { JavaSandbox } from './javaSandbox';

const app = express();
const PORT = 3747;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://192.168.1.6:5173'] }));
app.use(express.json({ limit: '512kb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'BUG HUNTER Java Execution Server running.' });
});

/**
 * POST /run
 * Compile + execute Java code with custom input, return stdout/stderr.
 * Does NOT evaluate test cases or award XP — only for preview/debug runs.
 */
app.post('/run', async (req, res) => {
  const { code, input } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, compileError: 'No code submitted.' });
  }

  const inputStr = typeof input === 'string' ? input : '';

  try {
    const result = await JavaSandbox.runSingle(code, inputStr);
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ success: false, stderr: msg, compileError: `Server error: ${msg}`, executionTimeMs: 0 });
  }
});

/**
 * POST /submit
 * Compile + run against all test cases for the mission.
 * Returns full test case results, pass/fail status, error details.
 * Mission is considered solved ONLY if allPassed === true.
 */
app.post('/submit', async (req, res) => {
  const { code, missionId } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      allPassed: false,
      passedCount: 0,
      totalCount: 0,
      testResults: [],
      status: 'COMPILE_ERROR',
      message: 'No code submitted.'
    });
  }

  if (!missionId || typeof missionId !== 'number' || missionId < 1 || missionId > 20) {
    return res.status(400).json({
      allPassed: false,
      passedCount: 0,
      totalCount: 0,
      testResults: [],
      status: 'FAILED',
      message: 'Invalid mission ID.'
    });
  }

  try {
    const result = await JavaSandbox.submitMission(missionId, code);
    return res.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return res.status(500).json({
      allPassed: false,
      passedCount: 0,
      totalCount: 0,
      testResults: [],
      status: 'FAILED',
      message: `Execution server error: ${msg}`
    });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n[BUG HUNTER Java Execution Server]`);
  console.log(`  Listening on http://localhost:${PORT}`);
  console.log(`  Endpoints: POST /run  |  POST /submit  |  GET /health`);
  console.log(`  Java: ${process.env.JAVA_HOME || 'JDK detected automatically'}\n`);
});

export default app;
