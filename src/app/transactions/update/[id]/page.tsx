import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { TransactionUpdateTemplate } from "@/templates/transaction-update";
import { listTransactionAction } from "@/app/actions/transactions";

interface TransactionUpdateProps {
  params: Promise<{ id: string }>;
}

export default async function TransactionUpdate({
  params,
}: TransactionUpdateProps) {
  const { id: transactionId } = await params;

  const cookieStorage = await cookies();
  const userCookie = cookieStorage.get("@controle-mais:user");

  if (!userCookie) {
    redirect("/");
  }

  const user = JSON.parse(userCookie.value);
  const result = await listTransactionAction({ transactionId });

  return <TransactionUpdateTemplate user={user} transaction={result.data} />;
}
