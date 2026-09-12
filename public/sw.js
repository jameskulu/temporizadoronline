/* Temporizador Online — service worker (offscreen PWA caching) */
const VERSION = 'temporizador-v1';
const APP_SHELL = '/';
const SHELL_CACHE = 'shell-' + VERSION;
const ASSET_CACHE = 'assets-' + VERSION;

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(SHELL_CACHE)
			.then((cache) => cache.add(APP_SHELL))
			.catch(() => {})
			.then(() => self.skipWaiting())
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE)
						.map((k) => caches.delete(k))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;
	const url = new URL(req.url);
	if (url.origin !== self.location.origin) return;

	// App navigations: network-first, fall back to the cached shell (offline).
	if (req.mode === 'navigate') {
		event.respondWith(
			fetch(req)
				.then((res) => {
					if (res && res.ok) {
						const copy = res.clone();
						caches.open(SHELL_CACHE).then((c) => c.put(APP_SHELL, copy));
					}
					return res;
				})
				.catch(() =>
					caches.match(APP_SHELL).then((c) => c || caches.match('/index.html'))
				)
		);
		return;
	}

	// Hashed static assets: stale-while-revalidate.
	if (/\.(css|js|mjs|svg|png|woff2?|ico|webmanifest)$/.test(url.pathname)) {
		event.respondWith(
			caches.match(req).then((cached) => {
				const network = fetch(req)
					.then((res) => {
						if (res && res.ok) {
							const copy = res.clone();
							caches.open(ASSET_CACHE).then((c) => c.put(req, copy));
						}
						return res;
					})
					.catch(() => cached);
				return cached || network;
			})
		);
		return;
	}
});