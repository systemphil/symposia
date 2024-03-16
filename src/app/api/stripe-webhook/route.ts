import { NextRequest, NextResponse } from "next/server";
// import { 
//     handleCustomerIdDeleted,
//     handleInvoicePaid,
//     handleSessionCompleted,
//     handleSessionExpiry,
//     handleSubscriptionCanceled,
//     handleSubscriptionCreatedOrUpdated,
// } from '../../server/stripe/stripeWebhookHandlers';
import { prisma } from "@/server/db";
import { stripe } from "@/lib/stripe/stripeClient";

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
            console.log("==>RECEIVED CHARGE SUCCEEDED");
            break;
        case "checkout.session.completed":
            console.log("==>RECEIVED CHECKOUT SESSION COMPLETED");
            break;
        // TODO cleanup
        // case "charge.succeeded":
        //     await handleChargeSucceeded({
        //         event, prisma
        //     });
        default:
            console.log(`Unhandled event type: ${event.type}`);
            // Unexpected event type
    }

    if (process.env.NODE_ENV === "development") {
        console.log("Development mode in stripe webhook -- bypassing stripe event db record");
    }

    // Record the event in the database (unless development mode)
    if (process.env.NODE_ENV !== "development") {
        await prisma.stripeEvent.create({
            data: {
                id: event.id,
                type: event.type,
                object: event.object,
                api_version: event.api_version,
                account: event.account,
                created: new Date(event.created * 1000),
                data: {
                    object: JSON.stringify(event.data.object),
                    previous_attributes: event.data.previous_attributes,
                },
                livemode: event.livemode,
                pending_webhooks: event.pending_webhooks,
                request: {
                    id: event.request?.id,
                    idempotency_key: event.request?.idempotency_key,
                },
            },
        });
    }

    return new NextResponse();
}
