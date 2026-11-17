import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript'};
http.createServer(async (req,res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url,'http://localhost').pathname === '/' ? '/index.html' : new URL(req.url,'http://localhost').pathname));
  if (!file.startsWith(root + path.sep) || !['/index.html','/src/app.js','/src/styles.css'].includes(file.slice(root.length))) { res.writeHead(404); return res.end('Not found'); }
  try { res.writeHead(200, {'Content-Type':types[path.extname(file)]}); res.end(await readFile(file)); } catch {res.writeHead(404); res.end('Not found');}
}).listen(process.env.PORT || 3000, '0.0.0.0', () => console.log('EC Nexus running at http://localhost:' + (process.env.PORT || 3000)));
