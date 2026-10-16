const CACHE_PREFIX = "eurotrip-2027";
const CACHE_VERSION = "v2";
const PAGE_CACHE = `${CACHE_PREFIX}-pages-${CACHE_VERSION}`;
const ASSET_CACHE = `${CACHE_PREFIX}-assets-${CACHE_VERSION}`;

const PUBLIC_OFFLINE_ROUTES = [
  "/offline",
  "/itinerario",
  "/traslados",
  "/presupuesto",
];
const PUBLIC_OFFLINE_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(Promise.all([precachePublicShell(), self.skipWaiting()]));
});

async function precachePublicShell() {
  const pageCache = await caches.open(PAGE_CACHE);
  const assetCache = await caches.open(ASSET_CACHE);
  const assetUrls = new Set(PUBLIC_OFFLINE_ASSETS);

  for (const route of PUBLIC_OFFLINE_ROUTES) {
    try {
      const request = new Request(route, { cache: "reload" });
      const response = await fetch(request);

      if (!response.ok) {
        continue;
      }

      await pageCache.put(request, response.clone());

      const html = await response.text();

      for (const match of html.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)) {
        assetUrls.add(match[1]);
      }
    } catch {
      // A partial precache must not prevent the service worker from installing.
    }
  }

  await Promise.allSettled(
    [...assetUrls].map((assetUrl) =>
      assetCache.add(new Request(assetUrl, { cache: "reload" })),
    ),
  );
}

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key.startsWith(CACHE_PREFIX) &&
                key !== PAGE_CACHE &&
                key !== ASSET_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin || url.pathname.startsWith("/api/")) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request, url.pathname));
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(cacheFirstAsset(request));
  }
});

async function networkFirstPage(request, pathname) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return (
      (await cache.match(request)) ??
      (await cache.match(pathname)) ??
      (await cache.match("/offline")) ??
      Response.error()
    );
  }
}

async function cacheFirstAsset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);

  if (response.ok) {
    await cache.put(request, response.clone());
  }

  return response;
}
