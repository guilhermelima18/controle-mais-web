"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  Loader2,
  Pencil,
  Search,
  X,
} from "lucide-react";
import { useDebounce } from "use-debounce";

import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";

import { AppLayout } from "@/components/app-layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/filter-chip";
import { DeleteTransactionButton } from "@/components/delete-transaction-button";

import { categoryColor } from "@/helpers/mocks/finance-data";
import { formatCurrency } from "@/helpers/masks";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type TypeFilter = "income" | "expense";

export function TransactionsTemplate() {
  const navigate = useRouter();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const [type, setType] = useState<TypeFilter | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [initialDate, setInitialDate] = useState(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return firstDay.toISOString().slice(0, 10);
  });
  const [finalDate, setFinalDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [inputSearch] = useDebounce(query, 500);

  const { categories, onListCategories } = useCategories();
  const {
    transactions,
    transactionsLoading,
    onListTransactionsByFilters,
    onDeleteTransaction,
  } = useTransactions();

  const hasFilters = query || type || category;

  const handleUpdateTransaction = async ({
    transactionId,
  }: {
    transactionId: string;
  }) => {
    navigate.push(`/transactions/update/${transactionId}`);
  };

  const handleDeleteTransaction = async ({
    transactionId,
  }: {
    transactionId: string;
  }) => {
    await onDeleteTransaction({ transactionId });
    await onListTransactionsByFilters({
      search: inputSearch ?? undefined,
      category,
      type: type?.toUpperCase() ?? undefined,
      initialDate,
      finalDate,
      page: "1",
    });
  };

  useEffect(() => {
    onListCategories();
  }, [onListCategories]);

  useEffect(() => {
    onListTransactionsByFilters({
      search: inputSearch ?? undefined,
      category,
      type: type?.toUpperCase() ?? undefined,
      initialDate,
      finalDate,
      page: String(page),
    });
  }, [
    page,
    inputSearch,
    category,
    type,
    initialDate,
    finalDate,
    onListTransactionsByFilters,
  ]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold md:text-4xl">Transações</h1>
            <p className="mt-1 text-muted-foreground">
              {transactions && transactions?.meta?.totalItems}{" "}
              {transactions && transactions?.meta?.totalItems > 1
                ? "lançamentos"
                : "lançamento"}
            </p>
          </div>
        </header>

        <Card className="border-border/60 bg-surface/60 p-5">
          <div className="flex flex-col gap-4">
            <div className="w-full flex items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="initial-date">Data Início</Label>
                <Input
                  id="date"
                  type="date"
                  value={initialDate}
                  onChange={(e) => {
                    if (page !== 1) setPage(1);
                    setInitialDate(e.target.value);
                  }}
                  className="h-11 border-border/60 bg-background/60"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final-date">Data Fim</Label>
                <Input
                  id="date"
                  type="date"
                  value={finalDate}
                  onChange={(e) => {
                    if (page !== 1) setPage(1);
                    setFinalDate(e.target.value);
                  }}
                  className="h-11 border-border/60 bg-background/60"
                />
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query ?? ""}
                onChange={(e) => {
                  if (page !== 1) setPage(1);
                  setQuery(e.target.value);
                }}
                placeholder="Buscar por descrição…"
                className="h-11 border-border/60 bg-background/60 pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={!type}
                onClick={() => {
                  setPage(1);
                  setType(undefined);
                }}
              >
                Todos
              </FilterChip>
              <FilterChip
                active={type === "income"}
                onClick={() => {
                  setPage(1);
                  setType("income");
                }}
                tone="income"
              >
                Entradas
              </FilterChip>
              <FilterChip
                active={type === "expense"}
                onClick={() => {
                  setPage(1);
                  setType("expense");
                }}
                tone="expense"
              >
                Saídas
              </FilterChip>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterChip
                active={category === undefined}
                onClick={() => {
                  setPage(1);
                  setCategory(undefined);
                }}
                size="sm"
              >
                Todas categorias
              </FilterChip>
              {categories.map((c) => (
                <FilterChip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => {
                    setPage(1);
                    setCategory(c.id);
                  }}
                  size="sm"
                >
                  {c.name}
                </FilterChip>
              ))}
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setPage(1);
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

        {transactionsLoading ? (
          <div className="w-full h-52 flex items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <Card className="bg-surface/40 max-h-90 divide-y divide-border/60 border-border/60 p-0 overflow-auto">
            {transactions?.data?.length === 0 && (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Nenhuma transação encontrada com esses filtros.
              </div>
            )}

            {transactions?.data?.map((t) => {
              const type = t.type?.toLowerCase() as "income" | "expense";
              const color = categoryColor(type, t.category.name);
              const isIncome = type === "income";

              return (
                <div
                  key={t.id}
                  className="group flex items-center gap-4 py-2 px-4 transition-colors hover:bg-background/40"
                >
                  <div
                    className="grid h-8 w-8 place-items-center rounded-xl"
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

                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                    onClick={() =>
                      handleUpdateTransaction({ transactionId: t.id })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

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
        )}

        {!transactionsLoading &&
          transactions &&
          transactions?.meta?.totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    text="Anterior"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {Array.from({ length: transactions.meta.totalPages }).map(
                  (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    text="Próximo"
                    onClick={() =>
                      setPage(Math.min(transactions.meta.totalPages, page + 1))
                    }
                    className={
                      page === transactions.meta.totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
      </div>
    </AppLayout>
  );
}
