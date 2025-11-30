import express, { Request, Response } from "express";
import Stripe from "stripe";
import cors from 'cors';
import bodyParser from "body-parser";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const app = express();

//Marlon


const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware para health check e rotas que não precisam de raw body
// app.use(express.json());
app.use(cors());

app.post("/create-checkout-session", async (req: Request, res: Response) => {
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ error: 'Email and userId are required.' });
  }

  const plan = {
    id: "prod_TOtu3U0m2c5IxG",
    name: "Starter",
    description: "Perfeito para começar",
    priceInCents: 4900,
    interval: "month",
    features: [
      "Até 10 projetos",
      "Suporte por email",
      "5 GB de armazenamento",
      "Analytics básico",
      "Comunidade de usuários",
    ],
  };

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      customer_email: email,
      metadata: {
        userId: userId,
      },
      line_items: [
        {
          price_data: {
            currency: "BRL",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: plan.priceInCents,
            recurring: {
              interval: plan.interval as "month" | "year",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      payment_method_types: ["card"],
    });
    res.json(session);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: 'Failed to create checkout session.' });
  }
});


// Rota de webhook do Stripe precisa do raw body para verificar a assinatura
app.post("/webhook", bodyParser.raw({ type: "application/json" }), async (req: Request, res: Response) => {
  const endpointSecret = "whsec_a5e0723cdbaa4653f3c794fa1757249c9e2418ea7caf5ada5aded9bba26d05f9"; // vindo do painel do Stripe

  const signature = req.headers["stripe-signature"]!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      endpointSecret
    );
    console.log(event);

  } catch (err: any) {
    console.error("⚠️  Erro no webhook:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // -------------------------------
  // 🔥 EVENTOS DO STRIPE TRATADOS
  // -------------------------------

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      console.log("Pagamento aprovado, session:", session);
      // Exemplo: marcar pedido como pago no banco
      break;

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent pago:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      console.log("Pagamento falhou:", failedIntent.id);
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
  }

  res.status(200).json({ received: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});