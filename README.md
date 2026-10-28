# Inventta 3D

Loja virtual completa para venda de peças impressas em 3D, com pagamento online, gestão de pedidos e estoque, e um painel administrativo próprio.

Projeto pessoal desenvolvido do zero por **Vinícius Nunes**.

🔗 **Loja no ar:** https://inventta-3dd.vercel.app

## Funcionalidades

**Loja**
- Catálogo com categorias, busca e página de produto com galeria de imagens
- Carrinho persistente (drawer lateral) sincronizado com a conta do usuário
- Checkout com **Mercado Pago**: cartão de crédito, **Pix** e Checkout Pro
- Webhook do Mercado Pago para confirmar pagamentos automaticamente
- Baixa automática de estoque após a compra
- E-mail de confirmação de cadastro e de pedido (Resend)

**Clientes**
- Cadastro e login com JWT e senhas criptografadas (bcrypt)
- Perfil público, histórico de pedidos e rastreamento de entrega
- Feed com posts, curtidas e comentários

**Painel administrativo**
- Cadastro e edição de produtos com upload de imagens (Cloudinary)
- Gestão de pedidos, códigos de rastreio e balanço financeiro
- Controle de materiais (filamentos)
- **Calculadora de preço de impressão 3D**: custo de filamento, energia e margem
- Mensagens, notícias, vídeos e configurações da loja

## Tecnologias

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4
- MongoDB
- Mercado Pago SDK
- Cloudinary (imagens) e Resend (e-mails)
- Deploy na Vercel

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev
```

Acesse http://localhost:3000

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `MONGODB_URI` | Conexão com o MongoDB |
| `MONGODB_DB` | Nome do banco (padrão: `inventta3d`) |
| `JWT_SECRET` | Assinatura dos tokens de login |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Acesso ao painel admin |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token privado do Mercado Pago |
| `NEXT_PUBLIC_MP_PUBLIC_KEY` | Chave pública do Mercado Pago |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Upload de imagens |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Envio de e-mails |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site |

## Autor

Vinícius Nunes · [LinkedIn](https://www.linkedin.com/in/vinicius-nunes-dev) · [GitHub](https://github.com/ViniciusN1)
