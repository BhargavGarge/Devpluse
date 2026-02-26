import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia", // Updated to a valid recent API version since 2023-10-16 might be deprecated or better to use recent for new setups
});
