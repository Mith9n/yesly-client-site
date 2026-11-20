import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(
  process.env.AUTH_DB_NAME || process.env.DB_NAME || "YESLY-Databse",
);

const appUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

async function findUserById(userId: unknown) {
  if (!userId) return null;
  const collection = db.collection("user");
  if (typeof userId === "string" && ObjectId.isValid(userId)) {
    return collection.findOne({ _id: new ObjectId(userId) });
  }
  return collection.findOne({ _id: userId as ObjectId });
}

/**
 * Enforce the Yesly password policy on the server, not only in the sign-up
 * form. Any client that calls Better Auth directly must still meet these rules.
 */
function assertStrongPassword(password: unknown) {
  if (typeof password !== "string") return;
  if (password.length < 6) {
    throw new APIError("BAD_REQUEST", {
      message: "Password must be at least 6 characters",
    });
  }
  if (!/[A-Z]/.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message: "Password must contain an uppercase letter",
    });
  }
  if (!/[a-z]/.test(password)) {
    throw new APIError("BAD_REQUEST", {
      message: "Password must contain a lowercase letter",
    });
  }
}

// Endpoints that set or change a password. Sign-up sends `password`, while the
// change/reset flows send `newPassword`.
const PASSWORD_PATHS = new Set([
  "/sign-up/email",
  "/change-password",
  "/reset-password",
  "/set-password",
]);

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: appUrl,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [
    appUrl,
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Accounts created with email and password are stored with emailVerified
  // false, so a Google sign-in with the same address would otherwise be
  // rejected as "account not linked" and bounce back to the home page.
  // Google always verifies the address, so trusting it is safe here.
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (!PASSWORD_PATHS.has(ctx.path)) return;
      const body = (ctx.body ?? {}) as {
        password?: unknown;
        newPassword?: unknown;
      };
      assertStrongPassword(body.newPassword ?? body.password);
    }),
  },

  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requested = String((user as { role?: string }).role || "customer");
          // Admin accounts can never be created through public registration.
          const role = requested === "vendor" ? "vendor" : "customer";
          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
            } as typeof user,
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const existing = await findUserById((session as { userId: unknown }).userId);
          if (existing?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message:
                "Your account has been blocked. Please contact the Yesly concierge.",
            });
          }
          return { data: session };
        },
      },
    },
  },
});

export type Auth = typeof auth;
