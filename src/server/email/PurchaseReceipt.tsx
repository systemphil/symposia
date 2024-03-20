import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Tailwind,
  } from "@react-email/components"
import { OrderInformation } from "./OrderInformation"
  
type PurchaseReceiptEmailProps = {
    product: {
        name: string
        imagePath: string
        description: string
    }
    order: { id: string; createdAt: Date; pricePaidInCents: number }
    courseLink: string
}
  
// PurchaseReceiptEmail.PreviewProps = {
//     product: {
//         name: "Product name",
//         description: "Some description",
//         imagePath:
//             "/products/5aba7442-e4a5-4d2e-bfa7-5bd358cdad64-02 - What Is Next.js.jpg",
//     },
//     order: {
//         id: crypto.randomUUID(),
//         createdAt: new Date(),
//         pricePaidInCents: 10000,
//     },
//     downloadVerificationId: crypto.randomUUID(),
// } satisfies PurchaseReceiptEmailProps

// ! BUG where is this coming from??
// Warning: Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.

export default function PurchaseReceiptEmail({
    product,
    order,
    courseLink,
}: PurchaseReceiptEmailProps) {
    return (
        <Html>
            <Preview>Access {product.name} and view receipt</Preview>
            <Tailwind>
                <Head />
                <Body className="font-sans bg-white">
                    <Container className="max-w-xl">
                        <Heading>Purchase Receipt</Heading>
                        <OrderInformation
                            order={order}
                            product={product}
                            courseLink={courseLink}
                        />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}