"use client";

import { signInAction } from "@/app/actions/auth";

export function useAuth() {
  const onSignIn = async ({
    cpf,
    password,
  }: {
    cpf: string;
    password: string;
  }) => {
    const result = await signInAction({ cpf, password });

    if (!result.success) {
      throw result.message;
    }

    return result;
  };

  return {
    onSignIn,
  };
}
