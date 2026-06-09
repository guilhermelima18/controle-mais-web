import { Card } from "./ui/card";

import { formatBRL } from "@/helpers/mocks/finance-data";

export function CategoryPanel({
  title,
  total,
  items,
  accent,
}: {
  title: string;
  total: number;
  items: { name: string; value: number; color: string }[];
  accent: "income" | "expense";
}) {
  return (
    <Card className="border-border/60 bg-surface/60 p-6">
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        <span
          className="font-display text-base font-semibold"
          style={{ color: `var(--color-${accent})` }}
        >
          {formatBRL(total)}
        </span>
      </div>

      <div className="flex h-2.5 overflow-hidden rounded-full bg-background/60">
        {items.map((c) => (
          <div
            key={c.name}
            style={{
              width: `${(c.value / total) * 100}%`,
              background: c.color,
            }}
            className="h-full"
          />
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {items.map((c) => {
          const pct = (c.value / total) * 100;

          return (
            <li key={c.name} className="flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: c.color }}
              />
              <span className="text-sm">{c.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {pct.toFixed(1)}%
              </span>
              <span className="w-24 text-right text-sm font-medium tabular-nums">
                {formatBRL(c.value)}
              </span>
            </li>
          );
        })}

        {items?.length === 0 && (
          <li className="py-6 text-center text-sm text-muted-foreground">
            Nenhum lançamento ainda.
          </li>
        )}
      </ul>
    </Card>
  );
}
