import client from "@/lib/mercadopago";
import { Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      cpf,
      cep,
      address,
      number,
      cart,
      deliveryFee,
      total,
    } = body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return Response.json({
        success: false,
        error: "Carrinho vazio",
      });
    }

    const cleanTotal = Number(total);

    if (!cleanTotal || cleanTotal <= 0) {
      return Response.json({
        success: false,
        error: "Total inválido",
      });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          ...cart.map((item: any) => ({
            id: String(item._id),
            title: String(item.name),
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.price),
            currency_id: "BRL",
          })),
          {
            id: "delivery",
            title: "Entrega discreta",
            quantity: 1,
            unit_price: Number(deliveryFee || 0),
            currency_id: "BRL",
          },
        ],

        payer: {
          name: String(name || ""),
          email: String(email || "").toLowerCase().trim(),
          identification: {
            type: "CPF",
            number: String(cpf || "").replace(/\D/g, ""),
          },
          phone: {
            number: String(phone || ""),
          },
          address: {
            zip_code: String(cep || ""),
            street_name: String(address || ""),
            street_number: String(number || ""),
          },
        },

        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },

        external_reference: `pedido-pro-${Date.now()}`,
      },
    });

    return Response.json({
      success: true,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
      preferenceId: result.id,
    });
  } catch (error: any) {
    console.log("CHECKOUT PRO ERROR:", error);

    return Response.json({
      success: false,
      error:
        error?.message ||
        error?.cause?.[0]?.description ||
        "Erro ao criar Checkout Pro",
    });
  }
}