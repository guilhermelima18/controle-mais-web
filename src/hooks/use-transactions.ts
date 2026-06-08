"use client";

import { useCallback, useState } from "react";
import {
  listTransactionsByFiltersAction,
  createTransactionAction,
} from "@/app/actions/transactions";

type Transactions = {
  id: string;
  description: string;
  amount: string;
  type: "INCOME" | "EXPENSE";
  date: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    type: "INCOME" | "EXPENSE";
  };
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  const onListTransactionsByFilters = useCallback(
    async ({
      search,
      category,
      type,
    }: {
      search?: string;
      category?: string;
      type?: string;
    }) => {
      const result = await listTransactionsByFiltersAction({
        search,
        category,
        type,
      });

      if (!result.success) {
        throw result.message;
      }

      setTransactions(result.data || []);
    },
    [],
  );
  const onCreateTransaction = useCallback(
    async ({
      description,
      amount,
      type,
      date,
      userId,
      categoryId,
    }: {
      description: string;
      amount: number;
      type: "INCOME" | "EXPENSE";
      date: string;
      userId: string;
      categoryId: string;
    }) => {
      const result = await createTransactionAction({
        description,
        amount,
        type,
        date,
        userId,
        categoryId,
      });

      if (!result.success) {
        throw result.message;
      }

      return result;
    },
    [],
  );

  return {
    transactions,
    onListTransactionsByFilters,
    onCreateTransaction,
  };
}
