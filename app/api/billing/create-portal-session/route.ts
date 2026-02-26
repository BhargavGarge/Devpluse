import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
    try {
        const supabase = await createClient();

        // Context resolution for temp architecture
        const { data: { user } } = await supabase.auth.getUser();
        let organizationId = "temp-org-id";

        if (user) {
            const { data: member } = await supabase
                .from("organization_members")
                .select("organization_id")
                .eq("user_id", user.id)
                .single();

            if (member?.organization_id) {
                organizationId = member.organization_id;
            }
        }

        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("organization_id", organizationId)
            .single();

        if (!subscription || !subscription.stripe_customer_id) {
            return NextResponse.json({ error: "No active Stripe customer found for this organization" }, { status: 400 });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: subscription.stripe_customer_id,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`, // Replace with proper settings/billing return URL if changed
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating portal session:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
