"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { AppLayout } from "@/components/app-layout";
import { TypeButton } from "@/components/type-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { CATEGORIES, TxType } from "@/helpers/mocks/finance-data";

export function TransactionsNewTemplate() {
  const navigate = useRouter();

  const [type, setType] = useState<TxType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0].name);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const handleType = (t: TxType) => {
    setType(t);
    setCategory(CATEGORIES[t][0].name);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = parseFloat(amount.replace(",", "."));

    if (!description.trim() || !value || value <= 0) {
      toast.error("Preencha descrição e valor válido.");
      return;
    }

    toast.success("Transação cadastrada!");
    navigate.push("/transactions");
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-3xl font-semibold md:text-4xl">Nova transação</h1>
          <p className="mt-1 text-muted-foreground">
            Registre uma entrada ou saída do seu fluxo.
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
                <input
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                  placeholder="0,00"
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Mercado, salário, conta de luz…"
                className="h-11 border-border/60 bg-background/60"
              />
            </div>

            <div className="space-y-2">
              <Label>Categoria</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES[type].map((c) => {
                  const active = category === c.name;

                  return (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => setCategory(c.name)}
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
            >
              Cadastrar transação
            </Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
