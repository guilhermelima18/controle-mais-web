"use client";

import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Search, X } from "lucide-react";

import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/filter-chip";
import { DeleteTransactionButton } from "@/components/delete-transaction-button";

import { categoryColor } from "@/helpers/mocks/finance-data";
import { formatCurrency } from "@/helpers/masks";

type TypeFilter = "income" | "expense";

export function TransactionsTemplate() {
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [type, setType] = useState<TypeFilter | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const { categories, onListCategories } = useCategories();
  const { transactions, onListTransactionsByFilters, onDeleteTransaction } =
    useTransactions();

  const hasFilters = query || type || category;

  const handleDeleteTransaction = async ({
    transactionId,
  }: {
    transactionId: string;
  }) => {
    await onDeleteTransaction({ transactionId });
    await onListTransactionsByFilters({
      search: undefined,
      category,
      type:
        type === "expense"
          ? "EXPENSE"
          : type === "income"
            ? "INCOME"
            : undefined,
    });
  };

  useEffect(() => {
    onListCategories();
  }, [onListCategories]);

  useEffect(() => {
    onListTransactionsByFilters({
      search: undefined,
      category,
      type:
        type === "expense"
          ? "EXPENSE"
          : type === "income"
            ? "INCOME"
            : undefined,
    });
  }, [category, type, onListTransactionsByFilters]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">Transações</h1>
            <p className="mt-1 text-muted-foreground">
              {transactions?.length}{" "}
              {transactions?.length === 1 ? "lançamento" : "lançamentos"}
            </p>
          </div>
        </header>

        <Card className="border-border/60 bg-surface/60 p-5">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por descrição…"
                className="h-11 border-border/60 bg-background/60 pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip active={!type} onClick={() => setType(undefined)}>
                Todos
              </FilterChip>
              <FilterChip
                active={type === "income"}
                onClick={() => setType("income")}
                tone="income"
              >
                Entradas
              </FilterChip>
              <FilterChip
                active={type === "expense"}
                onClick={() => setType("expense")}
                tone="expense"
              >
                Saídas
              </FilterChip>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={category === undefined}
                onClick={() => setCategory(undefined)}
                size="sm"
              >
                Todas categorias
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => setCategory(c.id)}
                  size="sm"
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setQuery(undefined);
                  setType(undefined);
                  setCategory(undefined);
                }}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" /> Limpar filtros
              </button>
            )}
          </div>
        </Card>

        <Card className="divide-y divide-border/60 border-border/60 bg-surface/40 p-0 overflow-hidden">
          {transactions?.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Nenhuma transação encontrada com esses filtros.
            </div>
          )}

          {transactions.map((t) => {
            const type = t.type?.toLowerCase() as "income" | "expense";
            const color = categoryColor(type, t.category.name);
            const isIncome = type === "income";

            return (
              <div
                key={t.id}
                className="group flex items-center gap-4 p-4 transition-colors hover:bg-background/40"
              >
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{
                    background: `color-mix(in oklab, ${color} 18%, transparent)`,
                    color,
                  }}
                >
                  {isIncome ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : (
                    <ArrowDownRight className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.description}</p>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className="rounded-full px-2 py-0.5"
                      style={{
                        background: `color-mix(in oklab, ${color} 15%, transparent)`,
                        color,
                      }}
                    >
                      {t.category.name}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(t.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="font-display text-base font-semibold tabular-nums"
                    style={{
                      color: isIncome
                        ? "var(--color-income)"
                        : "var(--color-expense)",
                    }}
                  >
                    {isIncome ? "+" : "−"}{" "}
                    {formatCurrency(
                      Math.round(Number(t.amount) * 100).toString(),
                    )}
                  </p>
                </div>

                <DeleteTransactionButton
                  id={t.id}
                  onDelete={(id) =>
                    handleDeleteTransaction({ transactionId: id })
                  }
                />
              </div>
            );
          })}
        </Card>
      </div>
    </AppLayout>
  );
}
