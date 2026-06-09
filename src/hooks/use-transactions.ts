"use client";

import { useCallback, useState } from "react";
import {
  listTransactionsByFiltersAction,
  createTransactionAction,
  listTransactionsDashboardAction,
  deleteTransactionAction,
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

type TransactionsDashboard = {
  total: number;
  income: number;
  expense: number;
  perType: {
    income: {
      name: string;
      value: number;
      percentage: number;
    }[];
    expense: {
      name: string;
      value: number;
      percentage: number;
    }[];
  };
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transactions[]>([]);
  const [transactionsDashboard, setTransactionsDashboard] =
    useState<TransactionsDashboard | null>(null);

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

  const onListTransactionsDashboard = useCallback(async () => {
    const result = await listTransactionsDashboardAction();

    if (!result.success) {
      throw result.message;
    }

    setTransactionsDashboard(result.data || []);
  }, []);

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

  const onDeleteTransaction = useCallback(
    async ({ transactionId }: { transactionId: string }) => {
      const result = await deleteTransactionAction({ transactionId });

      if (!result.success) {
        throw result.message;
      }

      return result;
    },
    [],
  );

  return {
    transactions,
    transactionsDashboard,
    onListTransactionsByFilters,
    onListTransactionsDashboard,
    onCreateTransaction,
    onDeleteTransaction,
  };
}
