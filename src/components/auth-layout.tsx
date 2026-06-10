"use client";

import Link from "next/link";
import Image from "next/image";

import { Toaster } from "@/components/ui/sonner";

import logo from "@/assets/logo-controle-mais.png";

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
        <div className="flex flex-col items-center mb-7">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={logo}
              alt="Logo Controle Mais"
              width={150}
              height={150}
            />
          </Link>

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
