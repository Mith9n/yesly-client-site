import { auth, ensureAuthDbConnected } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
  await ensureAuthDbConnected();
  return handler.GET(request);
}

export async function POST(request: Request) {
  await ensureAuthDbConnected();
  return handler.POST(request);
}