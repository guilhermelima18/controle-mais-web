/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { api } from "@/lib/axios";

export async function signInAction({
  cpf,
  password,
}: {
  cpf: string;
  password: string;
}) {
  try {
    const response = await api.post("/auth", { cpf, password });
    const { token, user } = response.data;

    const cookieStore = await cookies();

    cookieStore.set("@controle-mais:token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    cookieStore.set("@controle-mais:user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return { success: true };
  } catch (error: any) {
    if (error.response) {
      return { success: false, message: error.response.data };
    }

    return { success: false, message: "Erro ao autenticar" };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("@controle-mais:token");
  cookieStore.delete("@controle-mais:user");

  redirect("/");
}
