// server.js - Production Entrypoint untuk cPanel (Phusion Passenger)
const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

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
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
};

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
    // ignore
  }
  return false;
}

app.prepare()
  .then(() => {
    const server = http.createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const { pathname } = parsedUrl;

        // 1. Direct Static Serving untuk Next.js static assets (_next/static/*)
        if (pathname && pathname.startsWith('/_next/static/')) {
          const relativePath = pathname.replace('/_next/static/', '');
          const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(__dirname, '.next', 'static', safePath);
          if (serveStaticFile(filePath, res, 31536000)) return;
        }

        // 2. Direct Static Serving untuk upload files (/uploads/*)
        if (pathname && pathname.startsWith('/uploads/')) {
          const relativePath = pathname.replace('/uploads/', '');
          const safePath = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, '');
          const filePath = path.join(__dirname, 'public', 'uploads', safePath);
          if (serveStaticFile(filePath, res, 31536000)) return;
        }

        // 3. Direct Static Serving untuk public files (/favicon.ico, /images/*, dll)
        if (pathname && pathname !== '/' && !pathname.startsWith('/api/')) {
          const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
          const publicFilePath = path.join(__dirname, 'public', safePath);
          if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
            if (serveStaticFile(publicFilePath, res, 86400)) return;
          }
        }

        // 4. Delegasi ke Next.js Request Handler
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Request error:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      }
    });

    const port = process.env.PORT || 3000;
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Desa Cantik server ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Next.js prepare fatal error:', err);
    // Jalankan server darurat jika .next belum dibuild agar tidak 503
    const emergencyServer = http.createServer((req, res) => {
      res.writeHead(503, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:sans-serif;text-align:center;padding:50px;">
          <h2>Aplikasi Sedang Mempersiapkan Build</h2>
          <p>Silakan jalankan <code>npm run build</code> di Terminal cPanel lalu restart aplikasi.</p>
          <pre style="color:red;background:#f8f9fa;padding:15px;border-radius:8px;display:inline-block;text-align:left;">${err.message}</pre>
        </div>
      `);
    });
    emergencyServer.listen(process.env.PORT || 3000);
  });
