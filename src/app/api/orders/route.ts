import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error) {
    console.log("GET ORDERS ERROR:", error);

    return Response.json({
      success: false,
      orders: [],
      error: "Erro ao buscar pedidos",
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const cart = body.cart || body.products || [];

    const order = {
      customer: {
        name: body.name || "",
        email: body.email || "",
        phone: body.phone || "",
        cpf: body.cpf || "",
      },

      address: {
        cep: body.cep || "",
        address: body.address || "",
        number: body.number || "",
        city: body.city || "",
        state: body.state || "",
      },

      products: cart.map((item: any) => ({
        productId: item.productId || item._id,
        name: item.name || "",
        image: item.image || "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      })),

      subtotal: Number(body.subtotal || 0),
      deliveryFee: Number(body.deliveryFee || 0),
      total: Number(body.total || 0),

      paymentMethod: body.paymentMethod || "mercadopago",
      paymentStatus: "pending",

      mercadoPago: {
        preferenceId: "",
        paymentId: "",
        status: "",
      },

      status: "pending",
      productionStatus: "waiting",
      trackingCode: "",
      stockReduced: false,
      notes: "",

      history: [
        {
          status: "pending",
          date: new Date(),
          message: "Pedido criado",
        },
      ],

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("orders").insertOne(order);

    return Response.json({
      success: true,
      orderId: String(result.insertedId),
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao criar pedido",
    });
  }
}