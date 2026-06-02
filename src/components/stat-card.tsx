import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { formatBRL } from "@/helpers/mocks/finance-data";

export function StatCard({
  label,
  value,
  type,
}: {
  label: string;
  value: number;
  type: "income" | "expense";
}) {
  const isIncome = type === "income";

  return (
    <div className="rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {isIncome ? (
          <ArrowUpRight className="h-3.5 w-3.5 text-income" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5 text-expense" />
        )}
        {label}
      </div>
      <p
        className="mt-1.5 font-display text-xl font-semibold tracking-tight"
        style={{
          color: isIncome ? "var(--color-income)" : "var(--color-expense)",
        }}
      >
        {formatBRL(value)}
      </p>
    </div>
  );
}
