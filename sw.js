/* Ghostframe service worker — offline-first app shell.
   Cache-first with background refresh (stale-while-revalidate): the app always
   opens instantly with zero signal; updates download silently when online and
   apply on the next launch/reload. */
'use strict';

const CACHE = 'ghostframe-v0.12.0';
const SHELL = ['./', 'index.html', 'guide.html', 'manifest.json', 'qr.svg',
  'icon-192.png', 'icon-512.png', 'icon-180.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(SHELL.map(u => c.add(u).catch(() => {}))) // one miss must not sink the install
  ));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const sameOrigin = url.origin === location.origin;
  const isZipLib = url.hostname === 'cdnjs.cloudflare.com'; // JSZip: cache after first online use
  if (!sameOrigin && !isZipLib) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: sameOrigin });
    const refresh = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    if (cached) { e.waitUntil(refresh); return cached; }
    const net = await refresh;
    if (net) return net;
    if (req.mode === 'navigate') {
      const shell = await cache.match('index.html');
      if (shell) return shell;
    }
    return new Response('Offline and not cached yet.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  })());
});
