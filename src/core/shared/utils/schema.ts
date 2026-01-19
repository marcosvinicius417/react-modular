import { z } from "zod";
import {
  incompleteErrorMsg,
  invalidErrorMsg,
  isCpf,
  isValidDatePeriod,
  requiredErrorMsg,
} from "./validators";

const stringRequired = z.string({ error: requiredErrorMsg });

export const requiredStringSelectionSchema = z
  .object(
    {
      title: z.string(),
      value: stringRequired.min(1, requiredErrorMsg),
    },
    { error: requiredErrorMsg }
  )
  .refine((v) => !!v.value, requiredErrorMsg);

export const requiredIdSelectionSchema = z
  .object(
    {
      title: z.string(),
      value: z
        .number({ error: requiredErrorMsg })
        .int()
        .gt(0, requiredErrorMsg),
    },
    { error: requiredErrorMsg }
  )
  .refine((v) => !!v.value && v.value > 0, requiredErrorMsg);

export const requiredMaskedPhoneNumberSchema = stringRequired
  .min(14, incompleteErrorMsg)
  .max(15, invalidErrorMsg)
  .regex(
    /^[0-9\-() ]*$/,
    "Campo pode conter apenas números e os simbolos, '-', '(', ')'"
  );

export const periodoPrestacaoServicoSchema = stringRequired.superRefine(
  (v, ctx) => {
    const validator = isValidDatePeriod({ required: true, validateYear: true });
    const validOrErrorMsg = validator(v);

    if (typeof validOrErrorMsg === "string") {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: validOrErrorMsg });
    }
  }
);

export const requiredCpfSchema = stringRequired
  .min(1, requiredErrorMsg)
  .refine(isCpf, "CPF inválido");

export const requiredDateSchema = stringRequired
  .min(1, requiredErrorMsg)
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), {
    message: invalidErrorMsg,
  });

export const requiredDateTimeSchema = stringRequired
  .min(1, requiredErrorMsg)
  .refine((val) => !isNaN(Date.parse(val)), { message: invalidErrorMsg });

export const optionalDateSchema = z
  .string()
  .transform((val) => new Date(val))
  .refine((date) => !isNaN(date.getTime()), {
    message: invalidErrorMsg,
  })
  .optional()
  .or(z.literal(""));

export const nomeColaboradorSchema = stringRequired.min(
  3,
  "Mínimo de 3 caracteres"
);

export const nomeSocialColaboradorSchema = z
  .string()
  .min(3, "Mínimo de 3 caracteres (se informado)")
  .optional()
  .or(z.literal(""));

export const requiredModeloContratacaoSchema = z.union(
  [z.literal("CLT"), z.literal("PJ")],
  { error: requiredErrorMsg }
);

export const modeloAtuacaoSchema = z.union(
  [z.literal("presencial"), z.literal("remoto"), z.literal("hibrido")],
  { error: requiredErrorMsg }
);

export const requiredStringSchema = stringRequired.min(1, requiredErrorMsg);

export const requiredEmailSchema = stringRequired
  .min(1, requiredErrorMsg)
  .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "E-mail inválido",
  });

export const requiredDateWithYearValidationSchema = stringRequired
  .min(1, requiredErrorMsg)
  .refine((dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const year = Number.parseInt(dateString.split("-")[0]);
    return year >= 1900 && year <= 2100;
  }, "Ano deve ter 4 dígitos e estar entre 1900 e 2100")
  .refine((dateString) => {
    const date = new Date(dateString);
    return (
      !isNaN(date.getTime()) && dateString === date.toISOString().split("T")[0]
    );
  }, "Data inválida");

export const requiredBirthDateSchema = stringRequired
  .min(1, requiredErrorMsg)
  .refine((dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    const year = Number.parseInt(dateString.split("-")[0]);
    return year >= 1900 && year <= new Date().getFullYear();
  }, "Ano deve ter 4 dígitos e estar entre 1900 e o ano atual")
  .refine((dateString) => {
    const date = new Date(dateString);
    return (
      !isNaN(date.getTime()) && dateString === date.toISOString().split("T")[0]
    );
  }, "Data inválida")
  .refine((dateString) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= 16;
    }
    return age >= 16;
  }, "Pessoa deve ter pelo menos 16 anos");
