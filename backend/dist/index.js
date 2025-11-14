"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
// 1. Importações (agora usando 'import' do ES6)
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const cors_1 = __importDefault(require("cors"));
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
// 2. Inicializa a aplicação Express
const app = (0, express_1.default)();
// 3. Define a porta (com tipo 'number')
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 7777;
// 4. Middleware para "parsear" JSON
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Health
app.post("/create-checkout-session", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const session = yield exports.stripe.checkout.sessions.create({
        ui_mode: "embedded",
        redirect_on_completion: "always",
        customer_email: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email,
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
                        interval: plan.interval,
                        interval_count: 1,
                    },
                },
                quantity: 1,
            },
        ],
        mode: "subscription",
        // success_url: "https://entrevista-ja.vercel.app/",
        return_url: 'https://www.entrevistaja.com.br/home?session_id={CHECKOUT_SESSION_ID}',
        // success_url: 'https://entrevista-ja.vercel.app/home?session_id={CHECKOUT_SESSION_ID}',
        // cancel_url: 'https://entrevista-ja.vercel.app/pagamento-cancelado',
        // Para adicionar PIX (boleto), ative em: https://dashboard.stripe.com/account/payments/settings
        payment_method_types: ["card"],
    });
    res.json(session);
}));
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post("/webhook/stripe", (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = exports.stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Falha ao verificar assinatura do webhook:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    // Trate os eventos relevantes para assinaturas
    switch (event.type) {
        case 'checkout.session.completed':
            // Opcional: ativar acesso após a primeira compra via Checkout
            // (especialmente quando usando Checkout para criar assinaturas)
            break;
        case 'invoice.payment_succeeded': {
            // Pagamento da fatura de assinatura foi bem-sucedido
            const invoice = event.data.object;
            // Ex.: marcar assinatura como ativa/provisionar acesso
            // invoice.customer, invoice.subscription, invoice.lines etc.
            break;
        }
        case 'invoice.payment_failed': {
            // Pagamento da fatura falhou: notificar e/ou aplicar política de grace period
            const invoice = event.data.object;
            break;
        }
        case 'customer.subscription.updated': {
            // Mudanças de status/itens/renovação da assinatura
            const subscription = event.data.object;
            break;
        }
        case 'customer.subscription.deleted': {
            // Assinatura cancelada: revogar acesso
            const subscription = event.data.object;
            break;
        }
        case 'customer.subscription.trial_will_end': {
            // Trial prestes a terminar: avisar cliente
            const subscription = event.data.object;
            break;
        }
        default:
            console.log(`Evento não tratado: ${event.type}`);
    }
    // Responder 2xx rapidamente para evitar retries prolongados
    res.json({ received: true });
    return {};
});
app.post("/update-user-account", () => {
});
// 5. Inicia o servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
