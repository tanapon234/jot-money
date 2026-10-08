const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const host = '127.0.0.1';
const port = 8000;
const root = path.join(__dirname, 'dist');
const mime = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

const server = http.createServer((request, response) => {
  const requested = decodeURIComponent((request.url || '/').split('?')[0]);
  const relative = requested === '/' ? 'index.html' : requested.replace(/^\/+/, '');
  const file = path.resolve(root, relative);

  if (!file.startsWith(root + path.sep) && file !== root) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
    response.end(data);
  });
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Demo is running at ${url}`);
  console.log('Press Ctrl+C to stop the server.');
  exec(`start "" "${url}"`);
});
