import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Try to get current user to resolve their organization
        const { data: { user } } = await supabase.auth.getUser();

        // Fall back to a test org ID if not authenticated for testing logic while wiring it up
        let organizationId = "temp-org-id";

        if (user) {
            // Find their organization. Assuming a simple mapping for now.
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

        if (!subscription || subscription.plan === "starter") {
            return NextResponse.json({
                plan: "starter",
                status: "active",
            });
        }

        // Attempt to pull real Stripe info if they are "pro"
        if (!subscription.stripe_subscription_id) {
            return NextResponse.json({
                plan: subscription.plan,
                status: subscription.status || "canceling",
            });
        }

        const stripeSub = await stripe.subscriptions.retrieve(
            subscription.stripe_subscription_id,
            {
                expand: ["default_payment_method"],
            }
        );

        const invoices = await stripe.invoices.list({
            customer: subscription.stripe_customer_id as string,
            limit: 5,
        });

        return NextResponse.json({
            plan: subscription.plan,
            status: stripeSub.status,
            // @ts-ignore items.data[0] is generally safe here if it's an active sub
            billingInterval: stripeSub.items.data[0]?.price.recurring?.interval,
            currentPeriodEnd: stripeSub.current_period_end,
            card:
                stripeSub.default_payment_method &&
                    typeof stripeSub.default_payment_method !== "string" &&
                    "card" in stripeSub.default_payment_method &&
                    stripeSub.default_payment_method.card
                    ? {
                        brand: stripeSub.default_payment_method.card.brand,
                        last4: stripeSub.default_payment_method.card.last4,
                        exp_month: stripeSub.default_payment_method.card.exp_month,
                        exp_year: stripeSub.default_payment_method.card.exp_year,
                    }
                    : null,
            invoices: invoices.data.map((inv) => ({
                id: inv.number,
                date: inv.created,
                amount: inv.amount_paid,
                status: inv.status,
                invoiceUrl: inv.hosted_invoice_url,
            })),
        });
    } catch (error) {
        console.error("Error fetching billing summary:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
