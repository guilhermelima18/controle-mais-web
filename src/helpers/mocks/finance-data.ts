export type TxType = "income" | "expense";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TxType;
  category: string;
  date: string;
};

export const CATEGORIES: Record<TxType, { name: string; color: string }[]> = {
  income: [
    { name: "Salário", color: "oklch(0.78 0.17 152)" },
    { name: "Freelance", color: "oklch(0.72 0.15 200)" },
    { name: "Investimentos", color: "oklch(0.78 0.16 80)" },
    { name: "Outros", color: "oklch(0.70 0.10 260)" },
  ],
  expense: [
    { name: "Alimentação", color: "oklch(0.70 0.20 22)" },
    { name: "Transporte", color: "oklch(0.72 0.15 240)" },
    { name: "Moradia", color: "oklch(0.70 0.18 310)" },
    { name: "Lazer", color: "oklch(0.78 0.16 80)" },
    { name: "Saúde", color: "oklch(0.75 0.15 160)" },
    { name: "Educação", color: "oklch(0.70 0.14 50)" },
  ],
};

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MONTHS_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];
export const formatShortDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d} de ${MONTHS_PT[parseInt(m, 10) - 1]}.`;
};

export const categoryColor = (type: TxType, name: string) =>
  CATEGORIES[type].find((c) => c.name === name)?.color ?? "oklch(0.6 0.05 260)";
