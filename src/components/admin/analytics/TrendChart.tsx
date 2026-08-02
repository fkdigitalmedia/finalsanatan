"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Row = { day: string; pageviews: number; sessions: number; ai: number };

export function TrendChart({ data }: { data: Row[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-2, 24 90% 55%))" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(var(--chart-2, 24 90% 55%))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
          <XAxis
            dataKey="day"
            tickFormatter={(v: string) => v.slice(5)}
            fontSize={11}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            fontSize={11}
            stroke="hsl(var(--muted-foreground))"
            width={36}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="pageviews"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#pv)"
            name="Pageviews"
          />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke="hsl(var(--chart-2, 24 90% 55%))"
            strokeWidth={2}
            fill="url(#ss)"
            name="Sessions"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
