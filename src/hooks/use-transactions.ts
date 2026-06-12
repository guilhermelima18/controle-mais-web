"use client";

import { useCallback, useState } from "react";
import {
  listTransactionsByFiltersAction,
  createTransactionAction,
  listTransactionsDashboardAction,
  deleteTransactionAction,
  listTransactionAction,
  updateTransactionAction,
} from "@/app/actions/transactions";

type TransactionsFilters = {
  data: Transactions[];
  meta: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
  };
};

export type Transactions = {
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
  const [transaction, setTransaction] = useState<Transactions | null>(null);
  const [transactions, setTransactions] = useState<TransactionsFilters | null>(
    null,
  );
  const [transactionsDashboard, setTransactionsDashboard] =
    useState<TransactionsDashboard | null>(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
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
      page = "1",
      perPage = "5",
    }: {
      search?: string;
      category?: string;
      type?: string;
      initialDate?: string;
      finalDate?: string;
      page?: string;
      perPage?: string;
    }) => {
      setTransactionsLoading(true);

      const result = await listTransactionsByFiltersAction({
        search,
        category,
        type,
        initialDate,
        finalDate,
        page,
        perPage,
      });

      if (!result.success) {
        setTransactionsLoading(false);
        throw result.message;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      console.log(result);

      setTransactions(result.data);
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

  const onListTransaction = useCallback(
    async ({ transactionId }: { transactionId: string }) => {
      setTransactionLoading(true);

      const result = await listTransactionAction({ transactionId });

      if (!result.success) {
        setTransactionLoading(false);
        throw result.message;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      setTransaction(result.data || null);
      setTransactionLoading(false);
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

  const onUpdateTransaction = useCallback(
    async ({
      description,
      amount,
      type,
      date,
      categoryId,
      userId,
      transactionId,
    }: {
      description?: string;
      amount?: number;
      type?: "INCOME" | "EXPENSE";
      date?: string;
      categoryId?: string;
      userId: string;
      transactionId: string;
    }) => {
      const result = await updateTransactionAction({
        description,
        amount,
        type,
        date,
        categoryId,
        userId,
        transactionId,
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
    transaction,
    transactions,
    transactionsDashboard,
    transactionLoading,
    transactionsLoading,
    transactionsDashboardLoading,
    onListTransaction,
    onListTransactionsByFilters,
    onListTransactionsDashboard,
    onCreateTransaction,
    onUpdateTransaction,
    onDeleteTransaction,
  };
}
