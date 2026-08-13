// server.js - Entrypoint untuk cPanel Setup Node.js App (Passenger)
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const hostname = '0.0.0.0';

// Penting untuk Passenger cPanel: set dir ke __dirname agar Next.js mencari folder .next di lokasi yang tepat
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
