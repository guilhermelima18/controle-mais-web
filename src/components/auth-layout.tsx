"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

import { Toaster } from "@/components/ui/sonner";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <Link href="/login" className="mb-10 flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-tight">
              Fluxo
            </p>
            <p className="text-[11px] text-muted-foreground">
              controle financeiro
            </p>
          </div>
        </Link>

        <div className="mb-7">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-surface/70 p-6 shadow-2xl shadow-background/40 backdrop-blur-xl md:p-8">
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>

      <Toaster />
    </div>
  );
}
