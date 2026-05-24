import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = resolve(__dirname, '..');
const host = process.env.HOST ?? '0.0.0.0';
const port = Number(process.env.PORT ?? 5173);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0] ?? '/');
  const normalized = normalize(decoded).replace(/^\.\.(\/|\\|$)/, '');
  const requested = resolve(join(rootDir, normalized));
  if (!requested.startsWith(rootDir)) return null;
  return requested;
}

function sendText(response, status, text) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end(text);
}

const server = createServer((request, response) => {
  const requested = safePath(request.url ?? '/');
  if (!requested) return sendText(response, 403, 'Forbidden');

  let filePath = requested;
  if (!existsSync(filePath)) {
    filePath = join(rootDir, 'index.html');
  } else if (statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) return sendText(response, 404, 'Not found');

  const ext = extname(filePath);
  response.writeHead(200, {
    'Content-Type': mimeTypes[ext] ?? 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Grand River Commons dev server running at http://${host}:${port}`);
});
