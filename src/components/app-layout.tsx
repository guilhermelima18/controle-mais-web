"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ListOrdered,
  LogOut,
  PlusCircle,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ListOrdered },
  { to: "/transactions/create", label: "Nova", icon: PlusCircle },
] as const;

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useRouter();

  const handleLogout = async () => {
    toast.success("Você saiu da conta.");
    navigate.push("/");
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-tight">
                Fluxo
              </p>
              <p className="text-[11px] text-muted-foreground">
                controle financeiro
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-border/60 bg-surface/60 p-1 md:flex">
            {nav.map((item) => {
              const active = false;
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-all",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 pb-28">{children}</main>

      <nav className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-around rounded-2xl border border-border/60 bg-surface-elevated/90 p-2 shadow-2xl backdrop-blur-xl md:hidden">
        {nav.map((item) => {
          const active = false;
          return (
            <Link
              key={item.to}
              href={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
