import { type Stripe } from 'stripe';
import { dbUpdateUserPurchases } from "./dbController";
import { StripeCheckoutSessionMetadata } from "./stripeController";
import { resend } from '../email';
import PurchaseReceiptEmail from '../email/PurchaseReceipt';
import PurchaseNotification from '../email/PurchaseNotification';

export async function handleSessionCompleted (event: Stripe.CheckoutSessionCompletedEvent) {
    const sessionMetadata = event.data.object.metadata as StripeCheckoutSessionMetadata;
    if (event.data.object.payment_status !== 'paid') {
        console.log(`=!=Payment status not paid for session ${event.data.object.id}`);
        return;
    }

    const updatedUser = await dbUpdateUserPurchases({
        userId: sessionMetadata.userId,
        courseId: sessionMetadata.courseId,
        purchasePriceId: sessionMetadata.purchase,
    });

    const customerEmail = event.data.object.customer_email;
    if (!customerEmail) {
        console.log(`=!=No customer email found in session metadata. Session id ${event.data.object.id}`);
        return updatedUser;
    }
    const senderEmail = process.env.EMAIL_SEND
    if (!senderEmail) {
        console.log("=!=No sender email found in process.env");
        return updatedUser;
    }

    const order = {
        id: event.data.object.id,
        createdAt: new Date(event.data.object.created * 1000),
        pricePaidInCents: event.data.object.amount_total ?? 0,
    }

    const product = {
        name: sessionMetadata.name,
        imagePath: sessionMetadata.imageUrl,
        description: sessionMetadata.description,
    }

    await resend.emails.send({
        from: `No Reply <${senderEmail}>`,
        to: customerEmail,
        subject: 'Order Confirmation',
        react: (
            <PurchaseReceiptEmail
                key={order.id}
                order={order}
                product={product}
                courseLink={sessionMetadata.courseLink}
            />
        ),
    });

    const receiverEmail = process.env.EMAIL_RECEIVE;
    if (receiverEmail) {
        await resend.emails.send({
            from: `No Reply <${senderEmail}>`,
            to: receiverEmail,
            subject: 'New Purchase',
            react: (
                <PurchaseNotification
                    user={updatedUser}
                    key={order.id}
                    order={order}
                    product={product}
                    courseLink={sessionMetadata.courseLink}
                />
            ),
        });
    } else {
        console.log("=!=No receiver email found in process.env");
    }

    return updatedUser;
}


// export const handleCustomerIdDeleted = async ({
//     event,
//     prisma
// }: HandleCustomerIdDeletedProps) => {
//     const subscription = event.data.object as Stripe.Subscription;
//     const userId = subscription.metadata.userId;

//     await prisma.user.update({
//         where: {
//             id: userId,
//         },
//         data: {
//             stripeCustomerId: null,
//         },
//     });
// };
