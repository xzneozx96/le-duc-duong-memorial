import "server-only";

export type RateLimiter = { hit: (key: string) => boolean };

/** In-memory sliding window: at most `limit` accepted hits per key within `windowMs`. */
export function createRateLimiter(o: {
  limit: number;
  windowMs: number;
  now?: () => number;
}): RateLimiter {
  const now = o.now ?? Date.now;
  const hits = new Map<string, number[]>();
  return {
    hit(key) {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((at) => at > t - o.windowMs);
      if (recent.length >= o.limit) {
        hits.set(key, recent);
        return false;
      }
      recent.push(t);
      hits.set(key, recent);
      // Forget keys that have gone quiet so the map cannot grow without bound.
      if (hits.size > 10_000) {
        for (const [k, v] of hits) if (v.every((at) => at <= t - o.windowMs)) hits.delete(k);
      }
      return true;
    },
  };
}

/** First hop of X-Forwarded-For (set by the reverse proxy), or "unknown". */
export function clientIp(req: Request): string {
  const first = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return first || "unknown";
}

/** The eight 16-bit groups of an IPv6 address, or null when it is not one. */
function ipv6Groups(ip: string): number[] | null {
  let a = ip.replace(/^\[|\]$/g, "").split("%")[0].toLowerCase();
  const dotted = a.match(/^(.*:)(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  if (dotted) {
    const o = dotted.slice(2).map(Number);
    if (o.some((n) => n > 255)) return null;
    a = `${dotted[1]}${((o[0] << 8) | o[1]).toString(16)}:${((o[2] << 8) | o[3]).toString(16)}`;
  }
  if (!a.includes(":") || a.split("::").length > 2) return null;
  const [head, tail] = a.split("::");
  const h = head ? head.split(":") : [];
  const t = tail === undefined ? [] : tail ? tail.split(":") : [];
  const fill = 8 - h.length - t.length;
  if (tail === undefined ? h.length !== 8 : fill < 1) return null;
  const parts = tail === undefined ? h : [...h, ...Array<string>(fill).fill("0"), ...t];
  if (!parts.every((x) => /^[0-9a-f]{1,4}$/.test(x))) return null;
  return parts.map((x) => parseInt(x, 16));
}

/**
 * What a visitor is limited by: the whole IPv4 address, or the /64 prefix of an IPv6 address
 * (so rotating addresses inside one /64 does not bypass the limit). IPv4-mapped IPv6 counts as IPv4.
 */
export function limitKey(ip: string): string {
  const g = ipv6Groups(ip);
  if (!g) return ip;
  if (g.slice(0, 5).every((x) => x === 0) && g[5] === 0xffff) {
    return [g[6] >> 8, g[6] & 255, g[7] >> 8, g[7] & 255].join(".");
  }
  return `${g.slice(0, 4).map((x) => x.toString(16)).join(":")}::/64`;
}

export function clientKey(req: Request): string {
  return limitKey(clientIp(req));
}

export const postLimiter = createRateLimiter({ limit: 30, windowMs: 60 * 60 * 1000 });
