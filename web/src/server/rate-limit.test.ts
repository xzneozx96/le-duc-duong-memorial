import { describe, expect, it } from "vitest";
import { clientIp, clientKey, createRateLimiter, limitKey } from "./rate-limit";

const HOUR = 3_600_000;

describe("createRateLimiter", () => {
  it("allows the limit and refuses the next hit from the same key", () => {
    const now = 0;
    const rl = createRateLimiter({ limit: 3, windowMs: HOUR, now: () => now });
    expect([1, 2, 3].map(() => rl.hit("a"))).toEqual([true, true, true]);
    expect(rl.hit("a")).toBe(false);
  });

  it("counts each key separately", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: HOUR, now: () => 0 });
    expect(rl.hit("a")).toBe(true);
    expect(rl.hit("b")).toBe(true);
    expect(rl.hit("a")).toBe(false);
  });

  it("allows again once the old hits are older than the window", () => {
    let now = 0;
    const rl = createRateLimiter({ limit: 2, windowMs: HOUR, now: () => now });
    rl.hit("a");
    now = 30 * 60_000;
    rl.hit("a");
    expect(rl.hit("a")).toBe(false);
    now = HOUR; // the first hit has expired, the second has not
    expect(rl.hit("a")).toBe(true);
    expect(rl.hit("a")).toBe(false);
  });

  it("does not count refused hits against the visitor", () => {
    let now = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: HOUR, now: () => now });
    rl.hit("a");
    now = HOUR - 1;
    expect(rl.hit("a")).toBe(false);
    now = HOUR;
    expect(rl.hit("a")).toBe(true);
  });
});

describe("clientIp", () => {
  const req = (h: Record<string, string>) => new Request("http://x/", { headers: h });

  it("takes the first hop of X-Forwarded-For, trimmed", () => {
    expect(clientIp(req({ "x-forwarded-for": " 203.0.113.7 , 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("falls back to a constant when the header is absent or empty", () => {
    expect(clientIp(req({}))).toBe("unknown");
    expect(clientIp(req({ "x-forwarded-for": " " }))).toBe("unknown");
  });
});

describe("limitKey", () => {
  it("keeps an IPv4 address whole", () => {
    expect(limitKey("203.0.113.7")).toBe("203.0.113.7");
  });

  it("treats IPv4-mapped IPv6 as the IPv4 address, in dotted and hex form", () => {
    expect(limitKey("::ffff:203.0.113.7")).toBe("203.0.113.7");
    expect(limitKey("::FFFF:cb00:7107")).toBe("203.0.113.7");
  });

  it("keys IPv6 by its /64 prefix, however the address is written", () => {
    const k = limitKey("2001:db8:1:2:aaaa:bbbb:cccc:dddd");
    expect(k).toBe(limitKey("2001:0db8:0001:0002::1"));
    expect(k).toBe(limitKey("[2001:DB8:1:2:1:2:3:4]"));
    expect(limitKey("2001:db8:1:3::1")).not.toBe(k);
    expect(limitKey("2001:db8::1")).toBe(limitKey("2001:db8:0:0:ffff::2"));
  });

  it("does not confuse an IPv6 prefix with an IPv4 address, and passes unparseable values through", () => {
    expect(limitKey("2001:db8:1:2::1")).not.toBe("2001:db8:1:2::1");
    expect(limitKey("unknown")).toBe("unknown");
    expect(limitKey("fe80::1%eth0")).toBe(limitKey("fe80::2"));
  });
});

describe("clientKey", () => {
  it("is the /64-aware key of the first forwarded hop", () => {
    const r = new Request("http://x/", { headers: { "x-forwarded-for": "2001:db8:1:2::9, 10.0.0.1" } });
    expect(clientKey(r)).toBe(limitKey("2001:db8:1:2::1"));
  });
});
