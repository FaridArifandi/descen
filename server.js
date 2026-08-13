// server.js - Production Entrypoint untuk cPanel (Phusion Passenger)
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = false; // Selalu false di production server
const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

const app = next({
  dev,
  dir: path.resolve(__dirname),
  hostname,
  port,
});

const handle = app.getRequestHandler();

function serveStaticFile(filePath, res, maxAge = 31536000) {
  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${maxAge}`,
      });
      fs.createReadStream(filePath).pipe(res);
      return true;
    }
  } catch (e) {
    console.error('Error serving file:', filePath, e);
  }
  return false;
}

app.prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // 1. Direct Static Serving untuk Next.js static assets (_next/static/*)
        if (pathname && pathname.startsWith('/_next/static/')) {
          const relativePath = pathname.replace('/_next/static/', '');
          const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(__dirname, '.next', 'static', safePath);
          if (serveStaticFile(filePath, res, 31536000)) {
            return;
          }
        }

        // 2. Direct Static Serving untuk upload files (/uploads/*)
        if (pathname && pathname.startsWith('/uploads/')) {
          const relativePath = pathname.replace('/uploads/', '');
          const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(__dirname, 'public', 'uploads', safePath);
          if (serveStaticFile(filePath, res, 31536000)) {
            return;
          }
        }

        // 3. Direct Static Serving untuk public root files (/favicon.ico, /images/*, dll)
        if (pathname && pathname !== '/' && !pathname.startsWith('/api/')) {
          const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
          const publicFilePath = path.join(__dirname, 'public', safePath);
          if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
            if (serveStaticFile(publicFilePath, res, 86400)) {
              return;
            }
          }
        }

        // 4. Delegasi semua route dinamis dan API ke Next.js Request Handler
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Server error handling:', req.url, err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    }).listen(port, () => {
      console.log(`> Desa Cantik server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Next.js preparation error:', err);
    process.exit(1);
  });
