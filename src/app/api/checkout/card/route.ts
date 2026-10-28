import client from "@/lib/mercadopago";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

import { Payment } from "mercadopago";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      token,
      issuer_id,
      payment_method_id,
      installments,
      amount,
      email,
      cpf,
      name,
      phone,
      cep,
      address,
      number,
      city,
      state,
      cart,
    } = body;

    const cleanEmail = String(email || "")
      .toLowerCase()
      .trim();

    const cleanCpf = String(cpf || "")
      .replace(/\D/g, "");

    const cleanAmount = Number(amount);

    if (!token) {
      return Response.json({
        success: false,
        error: "Token do cartão não recebido",
      });
    }

    if (!cleanEmail || !cleanEmail.includes("@")) {
      return Response.json({
        success: false,
        error: "Email inválido",
      });
    }

    if (cleanCpf.length !== 11) {
      return Response.json({
        success: false,
        error: "CPF inválido",
      });
    }

    if (!cleanAmount || cleanAmount <= 0) {
      return Response.json({
        success: false,
        error: "Valor inválido",
      });
    }

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return Response.json({
        success: false,
        error: "Carrinho vazio",
      });
    }

    const payment = new Payment(client);

    const result = await payment.create({
      body: {
        transaction_amount: cleanAmount,
        token,
        description: "Pedido Inventta 3D",
        installments: Number(installments || 1),
        payment_method_id,
        issuer_id: Number(issuer_id),
        external_reference: `pedido-card-${Date.now()}`,

        payer: {
          email: cleanEmail,

          identification: {
            type: "CPF",
            number: cleanCpf,
          },
        },
      },
    });

    const mongo = await clientPromise;

    const db = mongo.db(DB_NAME);

    const order = await db
      .collection("orders")
      .insertOne({
        customer: {
          name: name || "",
          email: cleanEmail,
          phone: phone || "",
          cpf: cleanCpf,
        },

        address: {
          cep: cep || "",
          address: address || "",
          number: number || "",
          city: city || "",
          state: state || "",
        },

        cart,

        total: cleanAmount,

        status: result.status || "pending",

        payment: {
          payment_id: result.id,
          status: result.status || "pending",
          status_detail:
            result.status_detail || "",
          method:
            payment_method_id || "card",
          installments:
            Number(installments || 1),
          issuer_id:
            Number(issuer_id),
        },

        stockUpdated: false,

        createdAt: new Date(),
        updatedAt: new Date(),
      });

    if (result.status === "approved") {
      for (const item of cart) {
        await db
          .collection("products")
          .updateOne(
            {
              _id: new ObjectId(item._id),
            },
            {
              $inc: {
                stock: -Number(
                  item.quantity || 1
                ),
              },
            }
          );
      }

      await db
        .collection("orders")
        .updateOne(
          {
            _id: order.insertedId,
          },
          {
            $set: {
              stockUpdated: true,
              stockUpdatedAt: new Date(),
            },
          }
        );
    }

    return Response.json({
      success: true,
      orderId: order.insertedId,
      paymentId: result.id,
      status: result.status,
      statusDetail:
        result.status_detail,
    });
  } catch (error: any) {
    console.log("CARD ERROR:", error);

    return Response.json({
      success: false,
      error:
        error?.message ||
        error?.cause?.[0]?.description ||
        "Erro ao processar cartão",
    });
  }
}