/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Key, Loader2, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useUsers } from "@/hooks/use-users";

import { AuthLayout } from "@/components/auth-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cpfMask } from "@/helpers/masks";
import { signUpSchema } from "@/validations/sign-up-validation";

export function SignUpTemplate() {
  const navigate = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });
  const { onCreateUser } = useUsers();

  const [show, setShow] = useState(false);

  const submit = async (data: FieldValues) => {
    try {
      const result = await onCreateUser({
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        password: data.password,
      });

      if (result && result.success) {
        navigate.push("/");
      }
    } catch (err: any) {
      const errorMsg = err?.error
        ? err?.error
        : err?.errors &&
          Array.isArray(err?.errors) &&
          err?.errors?.[0]?.message;

      return toast.error(errorMsg, { position: "top-right" });
    }
  };

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Comece a organizar suas finanças em menos de um minuto."
      footer={
        <>
          Já tem uma conta?{" "}
          <Link href="/" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit(submit)} noValidate>
        <div className="space-y-1">
          <Label htmlFor="name">Nome</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Controller
              name="name"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id="name"
                  value={value}
                  onChange={(e) => {
                    const value = e.target.value
                      ?.toLowerCase()
                      ?.split(" ")
                      ?.map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      ?.join(" ");

                    onChange(value);
                  }}
                  placeholder="Seu nome"
                  className="h-11 border-border/60 bg-background/60 pl-10"
                />
              )}
            />
          </div>

          {errors.name && (
            <span className="text-xs text-red-500 ml-1">
              {errors.name.message as string}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="cpf">CPF</Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Controller
              name="cpf"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id="cpf"
                  type="text"
                  value={cpfMask(value)}
                  onChange={(e) => onChange(cpfMask(e.target.value))}
                  placeholder="xxx.xxx.xxx-xx"
                  className="h-11 border-border/60 bg-background/60 pl-10"
                  maxLength={14}
                />
              )}
            />
          </div>

          {errors.cpf && (
            <span className="text-xs text-red-500 ml-1">
              {errors.cpf.message as string}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Controller
              name="email"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id="email"
                  type="email"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="voce@email.com"
                  className="h-11 border-border/60 bg-background/60 pl-10"
                />
              )}
            />
          </div>

          {errors.email && (
            <span className="text-xs text-red-500 ml-1">
              {errors.email.message as string}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Controller
              name="password"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="h-11 border-border/60 bg-background/60 pr-10"
                />
              )}
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

          {errors.password && (
            <span className="text-xs text-red-500 ml-1">
              {errors.password.message as string}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-11 w-full text-base font-semibold shadow-lg shadow-primary/20 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
