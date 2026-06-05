/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { api } from "@/lib/axios";

export async function createUserAction({
  name,
  cpf,
  email,
  password,
}: {
  name: string;
  cpf: string;
  email: string;
  password: string;
}) {
  try {
    await api.post("/users", { name, cpf, email, password });
    return { success: true };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao criar usuário" };
  }
}
