import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-06-20",
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature")!;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("Webhook verification failed.", err);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Extract organizationId from metadata
        const organizationId = session.metadata?.organizationId || session.client_reference_id;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const planNickname = subscription.items.data[0].price.nickname || "pro";
        const interval = subscription.items.data[0].price.recurring?.interval;

        console.log(`Processing checkout for org: ${organizationId}, sub: ${subscription.id}`);

        const { error } = await supabase.from("subscriptions").insert({
            organization_id: organizationId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscription.id,
            plan: planNickname,
            billing_interval: interval,
            status: subscription.status,
            current_period_end: new Date(
                subscription.current_period_end * 1000
            ).toISOString(),
        });

        if (error) {
            console.error("Error inserting subscription to supabase:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
