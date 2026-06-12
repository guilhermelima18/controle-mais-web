"use client";

import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, ListOrdered, LogOut, PlusCircle } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

import { logoutAction } from "@/app/actions/auth";

import { cn } from "@/lib/utils";

import logo from "@/assets/logo-controle-mais.png";

const nav = [
  { to: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { to: "/transactions", label: "Transações", icon: ListOrdered },
  { to: "/transactions/create", label: "Nova", icon: PlusCircle },
] as const;

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt="Logo Controle Mais"
              width={70}
              height={70}
              loading="eager"
            />
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
            onClick={logoutAction}
            className="grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-surface/60 text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-330 px-6 py-4 pb-28">{children}</main>

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

      <Toaster />
    </div>
  );
}
