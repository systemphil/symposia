import { type PrismaClient } from "@prisma/client";
import { type Stripe } from 'stripe';
import { type Session } from "next-auth";
import { stripe } from "@/lib/stripe/stripeClient";

interface StripeCreateProductProps {
    name: string,
    description?: string,
}

export async function stripeCreateProduct ({name, description}: StripeCreateProductProps) {
    const product = await stripe.products.create({
        name: name,
        description: description ?? undefined,
    });
    return product;
}

export async function stripeUpdateProduct ({
    stripeProductId, name, description
}: {
    stripeProductId: string, name?: string, description?: string
}) {
    const product = await stripe.products.update(stripeProductId, {
        name: name ?? undefined,
        description: description ?? undefined,
    });
    return product;
}

export async function stripeArchiveProduct ({stripeProductId}: {stripeProductId: string}) {
    const product = await stripe.products.update(stripeProductId, {
        active: false,
    });
    return product;
}

interface StripeCreatePriceProps {
    stripeProductId: string,
    unitPrice: number,
    currency?: string,
}

export async function stripeCreatePrice ({stripeProductId, unitPrice, currency = "usd"}: StripeCreatePriceProps) {
    const price = await stripe.prices.create({
        unit_amount: unitPrice,
        currency: currency,
        product: stripeProductId,
    });
    return price;
}

export async function stripeRetrievePrice ({stripePriceId}: {stripePriceId: string}) {
    const price = await stripe.prices.retrieve(stripePriceId);
    return price;
}

export async function stripeArchivePrice ({
    stripePriceId,
}: {
    stripePriceId: string, unitPrice?: number, currency?: string
}) {
    const price = await stripe.prices.update(stripePriceId, {
        active: false,
    });
    return price;
}

export async function stripeDeleteProduct ({stripeProductId}: {stripeProductId: string}) {
    const product = await stripe.products.del(stripeProductId);
    return product;
}


// interface SessionPrismaStripeProps {
//     session: Session,
//     prisma: PrismaClient,
//     stripe: Stripe,
// }

// export async function forceStripeSessionExpire ({session, prisma, stripe}: SessionPrismaStripeProps) {
//     // Get pending session details from db
//     const pendingStripeSession = await prisma.pendingStripeSession.findFirst({
//         where: {
//             userId: session.user.id
//         },
//     })
//     if (!pendingStripeSession) {
//         throw new Error("Expected pending session entry...");
//     }

//     // Manually expire Stripe Session
//     await stripe.checkout.sessions.expire(
//         pendingStripeSession.stripeSession
//     );
// };

// export async function createStripeSessionResume ({session, prisma, stripe}: SessionPrismaStripeProps) {
//     const pendingStripeSessionRecord = await prisma.pendingStripeSession.findUnique({
//         where: {
//             userId: session.user.id,
//         }
//     })

//     if (!pendingStripeSessionRecord) {
//         return { 
//             url: null,
//             cancelUrl: null,
//         };
//     }

//     const stripeSession = await stripe.checkout.sessions.retrieve(
//         pendingStripeSessionRecord.stripeSession
//     );

//     if (!stripeSession) {
//         throw new Error("Could not create retrieve checkout session");
//     }

//     return { 
//         url: stripeSession.url,
//         cancelUrl: stripeSession.cancel_url,
//     };
// }

interface CreateStripeRefundProps {
    paymentIntentId: string,
    stripe: Stripe
}
export async function createStripeRefund ({ paymentIntentId, stripe }: CreateStripeRefundProps) {
    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId
        });
        return refund;
    } catch(err) {
        if (err instanceof Error) return err.message;
    }
}