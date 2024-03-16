import { type Stripe } from 'stripe';
import { dbUpdateUserPurchases } from "./dbController";
import { StripeCheckoutSessionMetadata } from "./stripeController";

export async function handleSessionCompleted (event: Stripe.CheckoutSessionCompletedEvent) {
    const sessionMetadata = event.data.object.metadata as StripeCheckoutSessionMetadata;
    const updatedUser = await dbUpdateUserPurchases({
        userId: sessionMetadata.userId,
        courseId: sessionMetadata.courseId,
        purchase: sessionMetadata.purchase,
    });
    console.log("<==Updated user purchases: ", updatedUser);
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
