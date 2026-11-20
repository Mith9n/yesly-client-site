import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, stripeSetupIssue } from "@/lib/stripe";

const PREMIUM_PRICE_CENTS = 9900;
const PREMIUM_CURRENCY = "usd";

/**
 * Create a Stripe Checkout session for a signed-in vendor.
 *
 * Payment confirmation is handled by the Express webhook at
 * `/api/payments/webhook`; the `vendorId` metadata below is what lets that
 * webhook upgrade the correct account. Never grant Premium from this route.
 */
export async function POST() {
  try {
    const setupIssue = stripeSetupIssue();
    if (setupIssue) {
      return NextResponse.json({ error: setupIssue, message: setupIssue }, { status: 503 });
    }

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required", message: "Authentication required" },
        { status: 401 },
      );
    }
    if (session.user.role !== "vendor") {
      return NextResponse.json(
        { error: "Only vendor accounts can upgrade", message: "Only vendor accounts can upgrade" },
        { status: 403 },
      );
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json({ error: "Stripe is not configured", message: "Stripe is not configured" }, { status: 503 });
    }

    const origin =
      headersList.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const metadata = { vendorId: session.user.id, plan: "premium" };
    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: PREMIUM_CURRENCY,
            unit_amount: PREMIUM_PRICE_CENTS,
            product_data: {
              name: "Yesly Premium Vendor — Annual Membership",
              description:
                "Unlimited active services, premium vendor badge and priority discovery for 12 months.",
            },
          },
        },
      ],
      metadata,
      payment_intent_data: { metadata },
      client_reference_id: session.user.id,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    });

    // Keep the JSON shape expected by the subscription page.
    return NextResponse.json({ url: checkout.url, sessionId: checkout.id });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not start Stripe checkout";
    return NextResponse.json({ error: message, message }, { status: 500 });
  }
}
