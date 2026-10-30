import { Resend } from "resend";

/**
 * Cliente do Resend. Sem RESEND_API_KEY (ex.: `npm run build` sem .env) usa uma
 * chave vazia de marcação para não quebrar o build; o envio falha e é tratado nas rotas.
 */
const apiKey = process.env.RESEND_API_KEY;

if (!apiKey && process.env.NODE_ENV !== "production") {
  console.warn("RESEND_API_KEY não configurada: e-mails não serão enviados.");
}

export const resend = new Resend(apiKey || "re_not_configured");
