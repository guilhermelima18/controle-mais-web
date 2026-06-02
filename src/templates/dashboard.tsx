"use client";

import { useMemo } from "react";
import { TrendingUp, Wallet } from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { CategoryPanel } from "@/components/category-panel";

import {
  categoryColor,
  formatBRL,
  SEED_TRANSACTIONS,
} from "@/helpers/mocks/finance-data";

export function DashboardTemplate() {
  const transactions = SEED_TRANSACTIONS;

  const { income, expense, balance, byCategory } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);

    const byCategory = (type: "income" | "expense") => {
      const map = new Map<string, number>();
      transactions
        .filter((t) => t.type === type)
        .forEach((t) => {
          map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
        });

      return [...map.entries()]
        .map(([name, value]) => ({
          name,
          value,
          color: categoryColor(type, name),
        }))
        .sort((a, b) => b.value - a.value);
    };

    return {
      income,
      expense,
      balance: income - expense,
      byCategory: {
        income: byCategory("income"),
        expense: byCategory("expense"),
      },
    };
  }, [transactions]);

  return (
    <AppLayout>
      <div className="space-y-8">
        <header>
          <p className="text-sm text-muted-foreground">Junho de 2026</p>
          <h1 className="mt-1 text-3xl font-semibold md:text-4xl">
            Olá, Guilherme 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aqui está o resumo das suas finanças.
          </p>
        </header>

        <Card className="relative overflow-hidden border-border/60 bg-linear-to-br from-surface-elevated via-surface to-surface-elevated p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" /> Saldo atual
              </div>
              <p className="mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl">
                {formatBRL(balance)}
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs text-primary">
                <TrendingUp className="h-3.5 w-3.5" />
                +12,4% vs. mês anterior
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Entradas" value={income} type="income" />
              <StatCard label="Saídas" value={expense} type="expense" />
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <CategoryPanel
            title="Entradas por categoria"
            total={income}
            items={byCategory.income}
            accent="income"
          />
          <CategoryPanel
            title="Saídas por categoria"
            total={expense}
            items={byCategory.expense}
            accent="expense"
          />
        </div>
      </div>
    </AppLayout>
  );
}
