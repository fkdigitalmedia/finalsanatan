// ============================================================
// Performance metrics registry
// ------------------------------------------------------------
// Lightweight, allocation-bounded latency recorder. Each metric
// keeps a rolling window of the last N samples so p50/p95/p99 stay
// meaningful without unbounded memory growth. No timers, no I/O —
// safe on the Worker runtime.
// ============================================================

export const WINDOW_SIZE = 200;

export interface LatencySummary {
  name: string;
  count: number;
  errors: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  maxMs: number;
  lastMs: number;
}

class RollingMetric {
  private samples: number[] = [];
  private cursor = 0;
  count = 0;
  errors = 0;
  total = 0;
  max = 0;
  last = 0;

  constructor(readonly name: string) {}

  record(ms: number, ok = true): void {
    const value = Math.max(0, ms);
    if (this.samples.length < WINDOW_SIZE) this.samples.push(value);
    else {
      this.samples[this.cursor] = value;
      this.cursor = (this.cursor + 1) % WINDOW_SIZE;
    }
    this.count++;
    this.total += value;
    this.last = value;
    if (value > this.max) this.max = value;
    if (!ok) this.errors++;
  }

  private percentile(p: number): number {
    if (this.samples.length === 0) return 0;
    const sorted = [...this.samples].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
    return round(sorted[idx]);
  }

  summary(): LatencySummary {
    return {
      name: this.name,
      count: this.count,
      errors: this.errors,
      avgMs: this.count === 0 ? 0 : round(this.total / this.count),
      p50Ms: this.percentile(50),
      p95Ms: this.percentile(95),
      p99Ms: this.percentile(99),
      maxMs: round(this.max),
      lastMs: round(this.last),
    };
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

/** Metric groups map onto the subsystems the dashboard reports on. */
export type MetricGroup = "api" | "db" | "ai" | "pdf" | "ssr" | "queue" | "search";

const registry = new Map<string, RollingMetric>();
const startedAt = Date.now();

function metricKey(group: MetricGroup, name: string): string {
  return `${group}::${name}`;
}

/** Record a completed operation. */
export function recordMetric(group: MetricGroup, name: string, ms: number, ok = true): void {
  const key = metricKey(group, name);
  let metric = registry.get(key);
  if (!metric) {
    // Bound the registry so a high-cardinality name can never leak memory.
    if (registry.size >= 300) return;
    metric = new RollingMetric(name);
    registry.set(key, metric);
  }
  metric.record(ms, ok);
}

/** Time an async operation and record it under `group`/`name`. */
export async function measure<T>(
  group: MetricGroup,
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const t0 = Date.now();
  try {
    const out = await fn();
    recordMetric(group, name, Date.now() - t0, true);
    return out;
  } catch (err) {
    recordMetric(group, name, Date.now() - t0, false);
    throw err;
  }
}

export interface GroupSummary {
  group: MetricGroup;
  count: number;
  errors: number;
  avgMs: number;
  p95Ms: number;
  p99Ms: number;
  operations: LatencySummary[];
}

export function groupSummary(group: MetricGroup): GroupSummary {
  const operations: LatencySummary[] = [];
  let count = 0;
  let errors = 0;
  let weightedAvg = 0;
  let p95 = 0;
  let p99 = 0;

  for (const [key, metric] of registry) {
    if (!key.startsWith(`${group}::`)) continue;
    const s = metric.summary();
    operations.push(s);
    count += s.count;
    errors += s.errors;
    weightedAvg += s.avgMs * s.count;
    p95 = Math.max(p95, s.p95Ms);
    p99 = Math.max(p99, s.p99Ms);
  }

  operations.sort((a, b) => b.p95Ms - a.p95Ms);
  return {
    group,
    count,
    errors,
    avgMs: count === 0 ? 0 : round(weightedAvg / count),
    p95Ms: p95,
    p99Ms: p99,
    operations: operations.slice(0, 15),
  };
}

export const ALL_GROUPS: MetricGroup[] = ["api", "db", "ai", "pdf", "ssr", "queue", "search"];

export function allGroupSummaries(): GroupSummary[] {
  return ALL_GROUPS.map(groupSummary).filter((g) => g.count > 0);
}

export function metricsUptimeSeconds(): number {
  return Math.round((Date.now() - startedAt) / 1000);
}

export function resetMetrics(): void {
  registry.clear();
}
