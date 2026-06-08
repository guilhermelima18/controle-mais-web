import { Categories } from "@/hooks/use-categories";

export type TxType = "income" | "expense";

const COLOR_MAP: Record<string, string> = {
  Salário: "oklch(0.78 0.17 152)",
  Freelance: "oklch(0.72 0.15 200)",
  Investimentos: "oklch(0.78 0.16 80)",
  Alimentação: "oklch(0.70 0.20 22)",
  Transporte: "oklch(0.72 0.15 240)",
  Moradia: "oklch(0.70 0.18 310)",
  Lazer: "oklch(0.78 0.16 80)",
  Saúde: "oklch(0.75 0.15 160)",
  Educação: "oklch(0.70 0.14 50)",
  Outros: "oklch(0.70 0.10 260)",
};

export const transformCategories = (data: Categories[]) => {
  return data.reduce(
    (acc, item) => {
      const type = item.type === "EXPENSE" ? "expense" : "income";

      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push({
        id: item.id,
        name: item.name,
        color: COLOR_MAP[item.name] ?? "oklch(0.70 0.10 260)",
      });

      return acc;
    },
    { income: [], expense: [] } as Record<
      TxType,
      { id: string; name: string; color: string }[]
    >,
  );
};
