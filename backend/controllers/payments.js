import Stripe from "stripe";
import { prisma } from "../lib/prisma.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

/**
 * Create a Stripe Checkout Session for paying a case.
 * Body: { caseId, amountInCents?, successUrl, cancelUrl }
 * Only the case owner (dentist) can create a session. Case must be Ready/Completed and not already paid.
 */
export async function createCheckoutSession(req, res) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ success: false, message: "Payment system is not configured" });
    }
    const userId = req.user?.data?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { caseId, amountInCents, successUrl, cancelUrl } = req.body;
    if (!caseId) {
      return res.status(400).json({ success: false, message: "caseId is required" });
    }

    const record = await prisma.caseRecord.findUnique({
      where: { caseId },
      select: { id: true, caseId: true, createdById: true, status: true, isPaid: true, patientName: true },
    });
    if (!record) {
      return res.status(404).json({ success: false, message: "Case not found" });
    }
    if (record.createdById !== userId) {
      return res.status(403).json({ success: false, message: "Only the case owner can pay for this case" });
    }
    if (record.isPaid) {
      return res.status(400).json({ success: false, message: "This case is already paid" });
    }
    if (record.status !== "Ready" && record.status !== "Completed") {
      return res.status(400).json({ success: false, message: "Case must be Ready or Completed to pay" });
    }

    const amount = Math.max(100, Math.round(Number(amountInCents) || 10000)); // min $1, default $100
    const baseUrl = process.env.FRONTEND_URL || process.env.VITE_APP_URL || "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Case payment – ${record.patientName || record.caseId}`,
              description: `Payment for case ${record.caseId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${baseUrl}/cases/${caseId}?payment=success`,
      cancel_url: cancelUrl || `${baseUrl}/cases/${caseId}?payment=cancelled`,
      metadata: {
        caseId: record.caseId,
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Create checkout session error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment session",
    });
  }
}

/**
 * Stripe webhook: on checkout.session.completed, mark the case as paid.
 * Must be mounted with express.raw() for signature verification.
 */
export async function handleStripeWebhook(req, res) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("STRIPE_WEBHOOK_SECRET not set; webhook skipped");
    return res.status(200).send();
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const caseId = session.metadata?.caseId;
    if (caseId) {
      try {
        const caseRecord = await prisma.caseRecord.findUnique({
          where: { caseId },
          select: { createdById: true },
        });
        await prisma.caseRecord.update({
          where: { caseId },
          data: { isPaid: true },
        });
        const amountInCents = session.amount_total ?? 0;
        const currency = (session.currency || "usd").toLowerCase();
        await prisma.payment.create({
          data: {
            caseId,
            amountInCents: Number(amountInCents),
            currency,
            stripeSessionId: session.id,
            paidById: caseRecord?.createdById ?? null,
          },
        });
        console.log("Case marked as paid and payment recorded:", caseId);
      } catch (e) {
        console.error("Failed to mark case paid or record payment:", e);
      }
    }
  }

  return res.status(200).send();
}

/**
 * List all payment transactions (Admin only). Query: page, limit.
 */
export async function getTransactions(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          caseRecord: {
            select: { caseId: true, patientName: true, caseType: true, status: true },
          },
        },
      }),
      prisma.payment.count(),
    ]);

    return res.status(200).json({
      success: true,
      data: payments,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch transactions" });
  }
}

/**
 * Get total balance (sum of all successful payments) for Admin.
 */
export async function getBalance(req, res) {
  try {
    const result = await prisma.payment.aggregate({
      _sum: { amountInCents: true },
      _count: { id: true },
    });
    const totalCents = result._sum?.amountInCents ?? 0;
    return res.status(200).json({
      success: true,
      totalAmountCents: totalCents,
      totalAmount: (totalCents / 100).toFixed(2),
      transactionCount: result._count?.id ?? 0,
    });
  } catch (error) {
    console.error("Get balance error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch balance" });
  }
}
