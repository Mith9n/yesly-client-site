const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const SESSION_COOKIE_NAMES = new Set([
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
]);

export async function GET(request: Request) {
  const sessionCookies = (request.headers.get("cookie") || "")
    .split(";")
    .map((cookie) => cookie.trim())
    .filter((cookie) => {
      const separator = cookie.indexOf("=");
      return (
        separator !== -1 &&
        SESSION_COOKIE_NAMES.has(cookie.slice(0, separator))
      );
    });

  const apiResponse = await fetch(`${API_URL}/api/auth/session`, {
    headers: {
      Accept: "application/json",
      ...(sessionCookies.length
        ? { Cookie: sessionCookies.join("; ") }
        : {}),
    },
    cache: "no-store",
  });

  return new Response(apiResponse.body, {
    status: apiResponse.status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type":
        apiResponse.headers.get("content-type") || "application/json",
    },
  });
}
