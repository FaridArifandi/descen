// server.js - Entrypoint untuk cPanel Setup Node.js App (Passenger)
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

const app = next({
  dev,
  dir: path.resolve(__dirname),
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // Direct static serving for /uploads/ files
        if (pathname && pathname.startsWith('/uploads/')) {
          const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(__dirname, 'public', safePath);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';
            res.writeHead(200, {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=31536000',
            });
            return fs.createReadStream(filePath).pipe(res);
          }
        }

        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, () => {
      console.log(`> Ready on port ${port} (mode: ${dev ? 'dev' : 'production'})`);
    });
  })
  .catch((err) => {
    console.error('Next.js app.prepare error:', err);
    process.exit(1);
  });
