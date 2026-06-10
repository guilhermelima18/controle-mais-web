/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/axios";

export async function listTransactionsByFiltersAction({
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
}) {
  try {
    const response = await api.get("/transactions", {
      params: {
        search,
        category,
        type,
        initialDate,
        finalDate,
      },
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao listar as transações." };
  }
}

export async function listTransactionsDashboardAction() {
  try {
    const response = await api.get("/transactions/dashboard");

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao listar as transações." };
  }
}

export async function createTransactionAction({
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
}) {
  try {
    await api.post("/transactions", {
      description,
      amount,
      type,
      date,
      userId,
      categoryId,
    });

    return { success: true };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao criar a transação." };
  }
}

export async function deleteTransactionAction({
  transactionId,
}: {
  transactionId: string;
}) {
  try {
    const response = await api.delete(`/transactions/${transactionId}`);

    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao excluir a transação." };
  }
}
