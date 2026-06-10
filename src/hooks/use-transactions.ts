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
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsDashboardLoading, setTransactionsDashboardLoading] =
    useState(false);

  const onListTransactionsByFilters = useCallback(
    async ({
      search,
      category,
      type,
      initialDate,
      finalDate,
    }: {
      search?: string;
      category?: string;
      type?: string;
      initialDate?: string;
      finalDate?: string;
    }) => {
      setTransactionsLoading(true);

      const result = await listTransactionsByFiltersAction({
        search,
        category,
        type,
        initialDate,
        finalDate,
      });

      if (!result.success) {
        setTransactionsLoading(false);
        throw result.message;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setTransactions(result.data || []);
      setTransactionsLoading(false);
    },
    [],
  );

  const onListTransactionsDashboard = useCallback(async () => {
    setTransactionsDashboardLoading(true);

    const result = await listTransactionsDashboardAction();

    if (!result.success) {
      setTransactionsDashboardLoading(false);
      throw result.message;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    setTransactionsDashboard(result.data || []);
    setTransactionsDashboardLoading(false);
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
    transactionsLoading,
    transactionsDashboardLoading,
    onListTransactionsByFilters,
    onListTransactionsDashboard,
    onCreateTransaction,
    onDeleteTransaction,
  };
}
