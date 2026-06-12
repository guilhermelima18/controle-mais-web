import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TransactionsNewTemplate } from "@/templates/transaction-new";

export default async function TransactionNew() {
  const cookieStorage = await cookies();
  const userCookie = cookieStorage.get("@controle-mais:user");

  if (!userCookie) {
    redirect("/");
  }

  const user = JSON.parse(userCookie.value);

  return <TransactionsNewTemplate user={user} />;
}
