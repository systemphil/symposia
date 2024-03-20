import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripeClient";
import { handleSessionCompleted } from "@/server/controllers/stripeWebhookController";
import { dbCreateStripeEventRecord } from "@/server/controllers/dbController";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

export async function POST (req: NextRequest) {
    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature") as string,
        webhookSecret as string
    )

    // Handle the event
    switch (event.type) {
        case "charge.succeeded":
            break;
        case "checkout.session.completed":
            await handleSessionCompleted(event);
            break;
        case "payment_intent.created":
            break;
        case "payment_intent.succeeded":
            break;
        case "payment_intent.requires_action":
            break;
        case "product.updated":
            console.log("===Product updated event received")
            break;
        case "product.created":
            break;
        default:
            console.log(`===Unhandled event type: ${event.type}`);
            // Unexpected event type
    }

    // Record the event in the database (unless development mode)
    if (process.env.NODE_ENV !== "development") {
        await dbCreateStripeEventRecord(event);
    }

    return new NextResponse();
}
