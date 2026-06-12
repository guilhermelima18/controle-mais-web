"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";

import { useCategories } from "@/hooks/use-categories";
import { Transactions, useTransactions } from "@/hooks/use-transactions";

import { AppLayout } from "@/components/app-layout";
import { TypeButton } from "@/components/type-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { transformCategories, TxType } from "@/helpers/adapters/categories";

type TransactionUpdateTemplateProps = {
  transaction: Transactions;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export function TransactionUpdateTemplate({
  transaction,
  user,
}: TransactionUpdateTemplateProps) {
  const navigate = useRouter();

  const [type, setType] = useState<TxType>(
    transaction.type.toLowerCase() as "income" | "expense",
  );
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState<number | undefined>(
    Number(transaction.amount),
  );
  const [category, setCategory] = useState<string | null>(
    transaction.category.name,
  );
  const [categorySelected, setCategorySelected] = useState<string | null>(
    transaction.category.id,
  );
  const [date, setDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });
  const [loading, setLoading] = useState(false);

  const { categories, onListCategories } = useCategories();
  const { onUpdateTransaction } = useTransactions();

  const categoriesMapped =
    categories && categories?.length > 0
      ? transformCategories(categories)
      : { income: [], expense: [] };

  const handleType = (t: TxType) => {
    setType(t);
    setCategory(categoriesMapped[t][0].name);
    setCategorySelected(categoriesMapped[t][0].id);
  };

  const submit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    const [year, month, day] = date.split("-").map(Number);
    const finalDateTime = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    const isoWithTime = finalDateTime.toISOString();

    if (!description?.trim() || !amount || !categorySelected) {
      return toast.error("Preencha os campos corretamente!", {
        position: "top-right",
      });
    }

    await onUpdateTransaction({
      description,
      amount,
      type: type.toUpperCase() as "INCOME" | "EXPENSE",
      date: isoWithTime,
      categoryId: categorySelected as string,
      userId: user?.id,
      transactionId: transaction.id,
    });

    toast.success("Transação atualizada!", {
      position: "top-right",
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    navigate.push("/transactions");

    setLoading(false);
  };

  useEffect(() => {
    onListCategories();
  }, [onListCategories]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold md:text-4xl">
            Atualizar transação
          </h1>
          <p className="mt-1 text-muted-foreground">
            Edite uma entrada ou saída do seu fluxo.
          </p>
        </header>

        <Card className="border-border/60 bg-surface/60 p-6 md:p-8">
          <form onSubmit={submit} className="space-y-7">
            <div className="grid grid-cols-2 gap-3">
              <TypeButton
                active={type === "income"}
                onClick={() => handleType("income")}
                tone="income"
              >
                <ArrowUpRight className="h-5 w-5" /> Entrada
              </TypeButton>
              <TypeButton
                active={type === "expense"}
                onClick={() => handleType("expense")}
                tone="expense"
              >
                <ArrowDownRight className="h-5 w-5" /> Saída
              </TypeButton>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Valor
              </Label>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className="font-display text-3xl font-semibold"
                  style={{
                    color:
                      type === "income"
                        ? "var(--color-income)"
                        : "var(--color-expense)",
                  }}
                >
                  R$
                </span>

                <NumericFormat
                  value={amount}
                  onValueChange={(values) => {
                    setAmount(values.floatValue);
                  }}
                  placeholder="0,00"
                  decimalSeparator=","
                  thousandSeparator="."
                  fixedDecimalScale
                  allowLeadingZeros
                  decimalScale={2}
                  allowNegative={false}
                  inputMode="decimal"
                  className="w-full bg-transparent font-display text-5xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/40"
                />
              </div>
              <div className="mt-2 h-px bg-border/60" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Descrição</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => {
                  const value = e.target.value
                    ?.toLowerCase()
                    ?.split(" ")
                    ?.map(
                      (word) => word.charAt(0).toUpperCase() + word.slice(1),
                    )
                    ?.join(" ");

                  setDescription(value);
                }}
                placeholder="Ex.: Mercado, salário, conta de luz…"
                className="h-11 border-border/60 bg-background/60"
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {categoriesMapped[type].map((c) => {
                  const active = category === c.name;

                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => {
                        setCategorySelected(c.id);
                        setCategory(c.name);
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-all",
                        active
                          ? "border-transparent"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                      style={
                        active
                          ? {
                              background: `color-mix(in oklab, ${c.color} 20%, transparent)`,
                              color: c.color,
                              boxShadow: `inset 0 0 0 1px ${c.color}`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: c.color }}
                      />
                      {c.name}
                      {active && <Check className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 border-border/60 bg-background/60"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-base font-semibold shadow-lg shadow-primary/20 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Atualizar transação"
              )}
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
