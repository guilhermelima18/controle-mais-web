"use client";

import { useEffect, useMemo } from "react";
import { Loader2, Wallet } from "lucide-react";

import { useTransactions } from "@/hooks/use-transactions";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import { CategoryPanel } from "@/components/category-panel";

import { categoryColor } from "@/helpers/mocks/finance-data";
import { formatCurrency } from "@/helpers/masks";

type DashboardTemplateProps = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export function DashboardTemplate({ user }: DashboardTemplateProps) {
  const currentMonth = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const {
    transactionsDashboard,
    transactionsDashboardLoading,
    onListTransactionsDashboard,
  } = useTransactions();

  const total = Number(transactionsDashboard?.total);
  const isNegative = total < 0;
  const absoluteTotal = Math.abs(total);

  const typeIncome = useMemo(() => {
    if (transactionsDashboard) {
      return transactionsDashboard.perType.income.map(({ name, value }) => ({
        name,
        value,
        color: categoryColor("income", name),
      }));
    }

    return [];
  }, [transactionsDashboard]);

  const typeExpense = useMemo(() => {
    if (transactionsDashboard) {
      return transactionsDashboard.perType.expense.map(({ name, value }) => ({
        name,
        value,
        color: categoryColor("expense", name),
      }));
    }

    return [];
  }, [transactionsDashboard]);

  useEffect(() => {
    onListTransactionsDashboard();
  }, [onListTransactionsDashboard]);

  return (
    <AppLayout>
      {transactionsDashboardLoading ? (
        <div className="w-full h-96 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <header>
            <p className="text-sm text-muted-foreground capitalize">
              {currentMonth}
            </p>
            <h1 className="mt-1 text-3xl font-semibold md:text-4xl">
              Olá, {user?.name} 👋
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
                <p
                  className={`mt-3 font-display text-5xl font-semibold tracking-tight md:text-6xl ${isNegative ? "text-expense" : "text-income"}`}
                >
                  {isNegative ? "− " : ""}
                  {formatCurrency(Math.round(absoluteTotal * 100).toString())}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <StatCard
                  label="Entradas"
                  value={(transactionsDashboard?.income as number) ?? 0}
                  type="income"
                />
                <StatCard
                  label="Saídas"
                  value={(transactionsDashboard?.expense as number) ?? 0}
                  type="expense"
                />
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryPanel
              title="Entradas por categoria"
              total={(transactionsDashboard?.income as number) ?? 0}
              items={typeIncome}
              accent="income"
            />
            <CategoryPanel
              title="Saídas por categoria"
              total={(transactionsDashboard?.expense as number) ?? 0}
              items={typeExpense}
              accent="expense"
            />
          </div>
        </div>
      )}
    </AppLayout>
  );
}
