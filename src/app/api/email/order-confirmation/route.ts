import { requireAdmin } from "@/lib/auth";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();

    const { email, name, orderId, total } = body;

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: `Pedido confirmado - Inventta 3D #${orderId}`,
      html: `
        <h1>Pedido confirmado 🎉</h1>
        <p>Olá, ${name}!</p>
        <p>Recebemos seu pedido <strong>#${orderId}</strong>.</p>
        <p>Total: <strong>R$ ${Number(total).toFixed(2)}</strong></p>
        <p>Em breve enviaremos atualizações de produção e rastreamento.</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.log("SEND EMAIL ERROR:", error);

    return Response.json({
      success: false,
      error: "Erro ao enviar email",
    });
  }
}