"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Search, Trash2, X } from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilterChip } from "@/components/filter-chip";

import {
  CATEGORIES,
  categoryColor,
  formatBRL,
  formatShortDate,
  SEED_TRANSACTIONS,
} from "@/helpers/mocks/finance-data";

type TypeFilter = "all" | "income" | "expense";

export function TransactionsTemplate() {
  const transactions = SEED_TRANSACTIONS;

  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [category, setCategory] = useState<string>("all");

  const allCategories = useMemo(
    () =>
      Array.from(
        new Set(
          [...CATEGORIES.income, ...CATEGORIES.expense].map((c) => c.name),
        ),
      ),
    [],
  );

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (type === "all" ? true : t.type === type))
      .filter((t) => (category === "all" ? true : t.category === category))
      .filter((t) =>
        query
          ? t.description.toLowerCase().includes(query.toLowerCase())
          : true,
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, type, category, query]);

  const hasFilters = query || type !== "all" || category !== "all";

  return (
    <AppLayout>
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">Transações</h1>
            <p className="mt-1 text-muted-foreground">
              {filtered.length}{" "}
              {filtered.length === 1 ? "lançamento" : "lançamentos"}
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
              <FilterChip
                active={type === "all"}
                onClick={() => setType("all")}
              >
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
                active={category === "all"}
                onClick={() => setCategory("all")}
                size="sm"
              >
                Todas categorias
              </FilterChip>
              {allCategories.map((c) => (
                <FilterChip
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  size="sm"
                >
                  {c}
                </FilterChip>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setQuery("");
                  setType("all");
                  setCategory("all");
                }}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" /> Limpar filtros
              </button>
            )}
          </div>
        </Card>

        {/* List */}
        <Card className="divide-y divide-border/60 border-border/60 bg-surface/40 p-0 overflow-hidden">
          {filtered.length === 0 && (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Nenhuma transação encontrada com esses filtros.
            </div>
          )}

          {filtered.map((t) => {
            const color = categoryColor(t.type, t.category);
            const isIncome = t.type === "income";
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
                      {t.category}
                    </span>
                    <span>·</span>
                    <span>{formatShortDate(t.date)}</span>
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
                    {isIncome ? "+" : "−"} {formatBRL(t.amount)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remover"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </Card>
      </div>
    </AppLayout>
  );
}
