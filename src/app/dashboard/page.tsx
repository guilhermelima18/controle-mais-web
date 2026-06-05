import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardTemplate } from "@/templates/dashboard";

export default async function Dashboard() {
  const cookieStorage = await cookies();
  const userCookie = cookieStorage.get("@controle-mais:user");

  if (!userCookie) {
    redirect("/");
  }

  const user = JSON.parse(userCookie.value);

  return <DashboardTemplate user={user} />;
}
