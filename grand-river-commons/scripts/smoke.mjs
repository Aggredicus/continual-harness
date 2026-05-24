import { spawn } from 'node:child_process';

const port = Number(process.env.SMOKE_PORT ?? 5174);
const url = `http://127.0.0.1:${port}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 10000) {
  const startedAt = Date.now();
  let lastError;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return response;
      lastError = new Error(`Unexpected status ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(250);
  }

  throw lastError ?? new Error('Server did not start before timeout.');
}

const child = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: new URL('..', import.meta.url),
  env: { ...process.env, HOST: '127.0.0.1', PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe']
});

let stdout = '';
let stderr = '';
child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

try {
  const response = await waitForServer();
  const html = await response.text();

  if (!html.includes('Grand River Commons')) {
    throw new Error('Smoke test failed: homepage did not include expected title.');
  }

  const jsResponse = await fetch(`${url}/src/main.js`);
  if (!jsResponse.ok) {
    throw new Error(`Smoke test failed: main.js returned ${jsResponse.status}.`);
  }

  console.log(`Smoke test passed: ${url} served the app and module entrypoint.`);
} catch (error) {
  console.error('Smoke test failed.');
  console.error(error);
  if (stdout) console.error(`Server stdout:\n${stdout}`);
  if (stderr) console.error(`Server stderr:\n${stderr}`);
  process.exitCode = 1;
} finally {
  child.kill('SIGTERM');
}
