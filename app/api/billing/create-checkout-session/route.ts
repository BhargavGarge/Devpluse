import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const { billingInterval } = await req.json();

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: member, error } = await supabase
            .from("organization_members")
            .select("organization_id")
            .eq("user_id", user.id)
            .single();

        console.log("User id:", user.id);
        console.log("Billing Interval passed:", billingInterval);
        console.log("Member data:", member, "Error:", error);

        const organizationId = member?.organization_id;

        if (!organizationId) {
            console.error("Failing with 400: User does not belong to an organization. Member data:", member);
            return NextResponse.json({ error: "User does not belong to an organization" }, { status: 400 });
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
            subscription_data: {
                metadata: {
                    organizationId,
                }
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
