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

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: "1", description: "Salário mensal", amount: 8500, type: "income", category: "Salário", date: "2026-05-05" },
  { id: "2", description: "Projeto freelance UI", amount: 2400, type: "income", category: "Freelance", date: "2026-05-12" },
  { id: "3", description: "Dividendos ações", amount: 480, type: "income", category: "Investimentos", date: "2026-05-15" },
  { id: "4", description: "Aluguel", amount: 2200, type: "expense", category: "Moradia", date: "2026-05-05" },
  { id: "5", description: "Supermercado Pão de Açúcar", amount: 680, type: "expense", category: "Alimentação", date: "2026-05-08" },
  { id: "6", description: "Uber para o trabalho", amount: 145, type: "expense", category: "Transporte", date: "2026-05-10" },
  { id: "7", description: "Cinema com amigos", amount: 95, type: "expense", category: "Lazer", date: "2026-05-14" },
  { id: "8", description: "Farmácia", amount: 78, type: "expense", category: "Saúde", date: "2026-05-16" },
  { id: "9", description: "Restaurante japonês", amount: 220, type: "expense", category: "Alimentação", date: "2026-05-17" },
  { id: "10", description: "Curso online", amount: 350, type: "expense", category: "Educação", date: "2026-05-18" },
  { id: "11", description: "Gasolina", amount: 280, type: "expense", category: "Transporte", date: "2026-05-19" },
  { id: "12", description: "Show de música", amount: 180, type: "expense", category: "Lazer", date: "2026-05-19" },
];

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const MONTHS_PT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
export const formatShortDate = (iso: string) => {
  const [, m, d] = iso.split("-");
  return `${d} de ${MONTHS_PT[parseInt(m, 10) - 1]}.`;
};

export const categoryColor = (type: TxType, name: string) =>
  CATEGORIES[type].find((c) => c.name === name)?.color ?? "oklch(0.6 0.05 260)";
