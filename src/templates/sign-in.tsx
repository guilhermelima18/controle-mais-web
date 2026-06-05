/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";

import { AuthLayout } from "@/components/auth-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cpfMask } from "@/helpers/masks";

export function SignInTemplate() {
  const navigate = useRouter();

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { onSignIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const clearCpf = cpf?.replace(/\D/g, "");
      const result = await onSignIn({
        cpf: clearCpf,
        password,
      });

      if (result && result.success) {
        navigate.push("/dashboard");
      }
    } catch (err: any) {
      const errorMsg = err?.error
        ? err?.error
        : err?.errors &&
          Array.isArray(err?.errors) &&
          err?.errors?.[0]?.message;

      return toast.error(errorMsg, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bem-vindo!"
      subtitle="Entre com sua conta para acompanhar suas finanças."
      footer={
        <>
          Ainda não tem conta?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="cpf"
              type="text"
              required
              value={cpfMask(cpf)}
              onChange={(e) => setCpf(cpfMask(e.target.value))}
              placeholder="xxx.xxx.xxx-xx"
              className="h-11 border-border/60 bg-background/60 pl-10"
              maxLength={14}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 border-border/60 bg-background/60 pr-10"
            />

            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full text-base font-semibold shadow-lg shadow-primary/20 cursor-pointer"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </AuthLayout>
  );
}
