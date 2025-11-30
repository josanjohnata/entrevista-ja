import express, { Request, Response } from "express";
import Stripe from "stripe";
import cors from 'cors';
import bodyParser from "body-parser";
import { db } from "./lib/firebase"; // Assuming db is a Firestore instance
import { addDoc, collection, doc, getDocs, query, setDoc, where } from "@firebase/firestore";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const app = express();
app.use(cors());

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

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
// ===============================
// 🔥 WEBHOOK DO STRIPE (RAW BODY)
// ===============================
app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    const signature = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err: any) {
      console.error("❌ Erro ao validar webhook:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    console.log("🔥 EVENTO RECEBIDO:", event.type);

    // 1. Cria uma referência para a coleção 'users'
    const usersRef = collection(db, "users");

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    // 2. Cria a consulta: Selecione onde o campo "userID" é igual (==) ao valor
    const q = query(usersRef, where("userID", "==", userId));

    // 3. Executa a busca
    const querySnapshot = await getDocs(q);
    const docID = querySnapshot.docs[0].id;

    // =======================
    // 🎯 TRATAMENTO DE EVENTOS
    // =======================

    switch (event.type) {
      // --------------------
      //  PAGAMENTO COMPLETO
      // --------------------
      case "checkout.session.completed": {

        await addDoc(collection(db, "users", docID, "payments", session.id), {
          status: "paid",
          amount: session.amount_total,
          subscriptionId: session.subscription,
          email: session.customer_email,
          createdAt: session.created,
        });

        console.log("💰 Pagamento confirmado para usuário:", userId);
        break;
      }

      // --------------------
      //  ASSINATURA CRIADA
      // --------------------
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;

        await setDoc(
          doc(db, "users", docID, "payments", subscription.id),
          {
            subscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: subscription.ended_at,
            currentPeriodStart: subscription.start_date,
            planId: subscription.items.data[0].price.id,
          },
          { merge: true }
        );

        console.log("📦 Assinatura criada:", subscription.id);
        break;
      }

      // --------------------
      //  ASSINATURA ATUALIZADA
      // --------------------
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        await setDoc(
          doc(db, "users", docID, "subscriptions", subscription.id),
          {
            status: subscription.status,
            currentPeriodEnd: subscription.cancel_at_period_end,
          },
          { merge: true }
        );

        console.log("🔄 Assinatura atualizada:", subscription.id);
        break;
      }

      // --------------------
      //  ASSINATURA CANCELADA
      // --------------------
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await setDoc(
          doc(db, "users", docID, "subscriptions", subscription.id),
          {
            status: subscription.status,
            currentPeriodEnd: subscription.cancel_at_period_end,
          },
          { merge: true }
        );

        console.log("❌ Assinatura cancelada:", subscription.id);
        break;
      }

      // --------------------
      //  PAGAMENTO SUCESSO
      // --------------------
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        await setDoc(
          doc(db, "users", docID, "invoices", invoice.id),
          {
            paid: true,
            amount: invoice.amount_paid,
            customer: invoice.customer,
            subscriptionId: invoice.id,
            periodEnd: invoice.period_end,
          },
          { merge: true }
        );

        console.log("✅ Pagamento da invoice confirmado:", invoice.id);
        break;
      }

      // --------------------
      //  PAGAMENTO FALHOU
      // --------------------
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        await setDoc(
          doc(db, "users", docID, "invoices", invoice.id),
          {
            paid: false,
            customer: invoice.customer,
            subscriptionId: invoice.id,
            reason: "payment_failed",
          },
          { merge: true }
        );

        console.log("⚠️ Pagamento da invoice FALHOU:", invoice.id);
        break;
      }

      // --------------------
      //  EVENTOS NÃO TRATADOS
      // --------------------
      default:
        console.log(`ℹ️ Evento sem tratativa específica: ${event.type}`);
    }

    res.status(200).json({ received: true });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});