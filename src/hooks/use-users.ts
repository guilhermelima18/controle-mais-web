"use client";

import { createUserAction } from "@/app/actions/users";

export function useUsers() {
  const onCreateUser = async ({
    name,
    cpf,
    email,
    password,
  }: {
    name: string;
    cpf: string;
    email: string;
    password: string;
  }) => {
    const result = await createUserAction({ name, cpf, email, password });

    if (!result.success) {
      throw result.message;
    }

    return result;
  };

  return {
    onCreateUser,
  };
}
