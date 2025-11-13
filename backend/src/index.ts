// 1. Importações (agora usando 'import' do ES6)
import express, { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import cors from 'cors';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// 2. Inicializa a aplicação Express
const app = express();

// 3. Define a porta (com tipo 'number')
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 7777;

// 4. Middleware para "parsear" JSON
app.use(express.json());
app.use(cors());

// Health
app.post("/create-checkout-session", async (req: Request, res: Response) => {
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
  }
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    customer_email: req?.body?.email,
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
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    // Para adicionar PIX (boleto), ative em: https://dashboard.stripe.com/account/payments/settings
    payment_method_types: ["card"],
  })
  res.json(session);
});

// 5. Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});