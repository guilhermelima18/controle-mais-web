import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TransactionsNewTemplate } from "@/templates/transactions-new";

export default async function TransactionsNew() {
  const cookieStorage = await cookies();
  const userCookie = cookieStorage.get("@controle-mais:user");

  if (!userCookie) {
    redirect("/");
  }

  const user = JSON.parse(userCookie.value);

  return <TransactionsNewTemplate user={user} />;
}
