import { Payment } from "mercadopago";
import client from "@/lib/mercadopago";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("PIX BODY:", body);

    const {
      name,
      email,
      phone,
      cpf,
      cep,
      address,
      number,
      city,
      state,
      cart,
      total,
    } = body;

    // =========================
    // NORMALIZAÇÃO SEGURA
    // =========================
    const cleanEmail = String(email || "")
      .toLowerCase()
      .trim();

    const cleanCpf = String(cpf || "").replace(/\D/g, "");

    const cleanTotal = Math.round(
      Number(total || 0) * 100
    ) / 100;

    // =========================
    // VALIDAÇÕES
    // =========================
    if (
      !name ||
      !cleanEmail ||
      !phone ||
      !cep ||
      !address ||
      !number ||
      !city ||
      !state
    ) {
      return Response.json({
        success: false,
        error: "Preencha todos os campos",
      });
    }

    if (!cleanEmail.includes("@")) {
      return Response.json({
        success: false,
        error: "Email inválido",
      });
    }

    if (isNaN(cleanTotal) || cleanTotal <= 0) {
      return Response.json({
        success: false,
        error: "Total inválido",
      });
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json({
        success: false,
        error: "Carrinho vazio",
      });
    }

    // =========================
    // MERCADO PAGO PIX
    // =========================
    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: cleanTotal,
        description: "Pedido - Loja",
        payment_method_id: "pix",

        external_reference: `pedido-${Date.now()}`,

        payer: {
          email: cleanEmail,
          first_name: name,
        },
      },
    });

    // =========================
    // MONGODB
    // =========================
    const mongo = await clientPromise;
    const db = mongo.db(DB_NAME);

    const order = await db.collection("orders").insertOne({
      customer: {
        name,
        email: cleanEmail,
        phone,
        cpf: cleanCpf,
      },
      address: {
        cep,
        address,
        number,
        city,
        state,
      },
      cart,
      total: cleanTotal,

      status: result.status || "pending",

      payment: {
        payment_id: result.id,
        status: result.status || "pending",
        method: "pix",
      },

      qr_code:
        result?.point_of_interaction?.transaction_data?.qr_code || null,

      qr_code_base64:
        result?.point_of_interaction?.transaction_data?.qr_code_base64 || null,

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // =========================
    // RESPONSE
    // =========================
    return Response.json({
      success: true,
      orderId: order.insertedId,
      paymentId: result.id,

      qr_code:
        result?.point_of_interaction?.transaction_data?.qr_code,

      qr_code_base64:
        result?.point_of_interaction?.transaction_data?.qr_code_base64,
    });

  } catch (error: any) {
    console.log("PIX ERROR:", error);

    return Response.json({
      success: false,
      error:
        error?.message ||
        error?.cause?.[0]?.description ||
        "Erro ao gerar PIX",
    });
  }
}