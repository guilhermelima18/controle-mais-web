import z from "zod";
import { cpfValidate } from "@/helpers/validations";

export const signUpSchema = z.object({
  name: z.string("Esse campo é obrigatório!"),
  cpf: z
    .string("Esse campo é obrigatório!")
    .min(1, "O CPF é obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .superRefine((val, ctx) => {
      if (val.length !== 11) {
        ctx.addIssue({
          code: "custom",
          message: "O CPF deve conter 11 dígitos",
        });
        return;
      }
      if (!cpfValidate(val)) {
        ctx.addIssue({ code: "custom", message: "CPF inválido" });
      }
    }),
  email: z
    .email("E-mail inválido")
    .max(250, "E-mail deve ter no máximo 250 caracteres"),
  password: z
    .string("Esse campo é obrigatório!")
    .length(6, "A senha deve ter exatamente 6 dígitos")
    .refine((val) => /^\d{6}$/.test(val), {
      message: "A senha deve conter apenas números",
    }),
});

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
