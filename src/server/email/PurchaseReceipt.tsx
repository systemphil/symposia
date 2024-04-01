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