// ============================================================
// Unified cache layer — Upstash / Redis REST driver
// ------------------------------------------------------------
// Server-only. Activates automatically when UPSTASH_REDIS_REST_URL
// and UPSTASH_REDIS_REST_TOKEN are present; otherwise the memory
// driver stays in charge. Uses the REST API (fetch), which is the
// only Redis transport available on the edge/Worker runtime.
//
// Tag invalidation is modelled with Redis sets: tag:<name> holds the
// member keys, so invalidateTag is a SMEMBERS + DEL round trip.
// ============================================================

import type { CacheDriver, CacheDriverStats, CacheSetOptions } from "./types";

type Command = (string | number)[];

export class UpstashCacheDriver implements CacheDriver {
  readonly name = "upstash";
  private hits = 0;
  private misses = 0;
  private sets = 0;
  private errors = 0;

  constructor(
    private url: string,
    private token: string,
    private defaultTtlMs = 5 * 60_000,
  ) {}

  /** Present only when the environment carries Upstash credentials. */
  static fromEnv(defaultTtlMs?: number): UpstashCacheDriver | null {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return new UpstashCacheDriver(url, token, defaultTtlMs);
  }

  private async exec<T>(command: Command): Promise<T | null> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
      });
      if (!res.ok) {
        this.errors++;
        return null;
      }
      const json = (await res.json()) as { result?: T };
      return (json.result ?? null) as T | null;
    } catch {
      this.errors++;
      return null;
    }
  }

  private async pipeline(commands: Command[]): Promise<void> {
    if (commands.length === 0) return;
    try {
      const res = await fetch(`${this.url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      });
      if (!res.ok) this.errors++;
    } catch {
      this.errors++;
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.exec<string>(["GET", key]);
    if (raw == null) {
      this.misses++;
      return undefined;
    }
    this.hits++;
    try {
      return JSON.parse(raw) as T;
    } catch {
      this.errors++;
      return undefined;
    }
  }

  async set<T>(key: string, value: T, opts: CacheSetOptions = {}): Promise<void> {
    const ttlSeconds = Math.max(1, Math.round((opts.ttlMs ?? this.defaultTtlMs) / 1000));
    const commands: Command[] = [["SET", key, JSON.stringify(value), "EX", ttlSeconds]];
    for (const tag of opts.tags ?? []) {
      commands.push(["SADD", `tag:${tag}`, key]);
      // Tag sets outlive their members slightly; they self-heal on invalidation.
      commands.push(["EXPIRE", `tag:${tag}`, ttlSeconds * 2]);
    }
    await this.pipeline(commands);
    this.sets++;
  }

  async delete(key: string): Promise<void> {
    await this.exec(["DEL", key]);
  }

  async invalidateTag(tag: string): Promise<number> {
    const members = (await this.exec<string[]>(["SMEMBERS", `tag:${tag}`])) ?? [];
    if (members.length === 0) return 0;
    await this.pipeline([
      ["DEL", ...members],
      ["DEL", `tag:${tag}`],
    ]);
    return members.length;
  }

  /**
   * SCAN-based prefix sweep. Kept deliberately bounded — prefer tags for
   * hot paths; this is an admin/maintenance operation.
   */
  async invalidatePrefix(prefix: string): Promise<number> {
    let cursor = "0";
    let removed = 0;
    for (let i = 0; i < 20; i++) {
      const page = await this.exec<[string, string[]]>([
        "SCAN",
        cursor,
        "MATCH",
        `${prefix}*`,
        "COUNT",
        200,
      ]);
      if (!page) break;
      const [next, keys] = page;
      if (keys.length > 0) {
        await this.pipeline([["DEL", ...keys]]);
        removed += keys.length;
      }
      cursor = next;
      if (cursor === "0") break;
    }
    return removed;
  }

  async clear(): Promise<void> {
    await this.exec(["FLUSHDB"]);
  }

  stats(): CacheDriverStats {
    return {
      driver: this.name,
      size: -1, // Unknown without a DBSIZE round trip; reported by the dashboard as n/a.
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      evictions: 0,
      errors: this.errors,
    };
  }
}
