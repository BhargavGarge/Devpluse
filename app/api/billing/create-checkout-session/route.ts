import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    try {
        const { billingInterval, organizationId } = await req.json();

        if (!organizationId) {
            return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
        }

        const priceId =
            billingInterval === "yearly"
                ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
                : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;

        if (!priceId) {
            return NextResponse.json({ error: "Missing price ID configuration" }, { status: 500 });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?canceled=true`,
            metadata: {
                organizationId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
