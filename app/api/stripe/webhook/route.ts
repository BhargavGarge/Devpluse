import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize a supabase client with the service role to bypass RLS in this backend webhook handler
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return new NextResponse("Missing stripe-signature header", { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        if (event.type === "checkout.session.completed") {
            const session = event.data.object as any;
            const organizationId = session.metadata?.organizationId;

            if (!organizationId) {
                console.error("Missing organizationId in checkout session metadata");
                return new NextResponse("Webhook handler requires organizationId in metadata", { status: 400 });
            }

            // Upsert the subscription row for the organization
            const { error } = await supabase
                .from("subscriptions")
                .upsert(
                    {
                        organization_id: organizationId,
                        stripe_customer_id: session.customer,
                        stripe_subscription_id: session.subscription,
                        plan: "pro",
                        status: "active",
                        // For a complete implementation, this interval could be passed in metadata or fetched from the line item price.
                        billing_interval: session.amount_total > 10000 ? "yearly" : "monthly",
                        updated_at: new Date().toISOString()
                    },
                    { onConflict: "organization_id" }
                );

            if (error) {
                console.error("Supabase upsert error:", error);
                throw error;
            }
        }

        if (
            event.type === "customer.subscription.deleted" ||
            event.type === "customer.subscription.canceled"
        ) {
            const subscription = event.data.object as any;

            // Downgrade organization to starter
            const { error } = await supabase
                .from("subscriptions")
                .update({
                    plan: "starter",
                    status: "canceled",
                    updated_at: new Date().toISOString()
                })
                .eq("stripe_subscription_id", subscription.id);

            if (error) {
                console.error("Supabase downgrade update error:", error);
                throw error;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`Webhook handler error: ${error.message}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
