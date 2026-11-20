import Stripe from "stripe";

/**
 * Server-only Stripe client for the Next.js checkout route.
 *
 * `STRIPE_SECRET_KEY` must NOT be NEXT_PUBLIC_ — only route handlers and
 * server code may read it. The webhook that confirms payment still lives in
 * the Express API (`yesly-server`), so this file only needs the secret key.
 */

const secretKey = process.env.STRIPE_SECRET_KEY;

export function getStripe() {
  if (!secretKey) return null;
  return new Stripe(secretKey);
}

/** Keep the named export used by the Stripe Next.js sample. */
export const stripe = getStripe();

export const CHECKOUT_UNAVAILABLE =
  "Premium checkout is not available yet. Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to the server environment.";

export function stripeSetupIssue() {
  if (!secretKey) return CHECKOUT_UNAVAILABLE;
  return null;
}
