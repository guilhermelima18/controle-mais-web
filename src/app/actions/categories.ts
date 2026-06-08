/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/axios";

export async function listCategoriesAction() {
  try {
    const response = await api.get("/categories");
    return { success: true, data: response.data };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao listar categorias." };
  }
}
