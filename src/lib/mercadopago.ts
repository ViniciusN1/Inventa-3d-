import { MercadoPagoConfig } from "mercadopago";

/**
 * Sem MERCADO_PAGO_ACCESS_TOKEN (ex.: `npm run build` sem .env) não quebramos o
 * build no import; as chamadas de pagamento falham e são tratadas nas rotas.
 */
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.warn("MERCADO_PAGO_ACCESS_TOKEN não configurado: pagamentos indisponíveis.");
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || "not_configured",
});

export default client;
