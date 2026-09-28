import { timingSafeEqual } from "node:crypto";
import type { LoaderFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { getDb } from "../db.server";
import { env } from "../env.server";

// Dummy API: GET /api/test
//
// Test token (dev only):  Authorization: Bearer <API_TEST_TOKEN from .env>
// Real token:             Authorization: Bearer <Shopify session token (JWT)>
//                         App Bridge adds this automatically to fetch() calls made
//                         from inside the embedded admin.

function isTestToken(request: Request): boolean {
  if (env.isProduction || !env.API_TEST_TOKEN) return false;

  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  const a = Buffer.from(token);
  const b = Buffer.from(env.API_TEST_TOKEN);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function logPing(mode: "test" | "real", shop: string) {
  const pings = getDb().collection("api_pings");
  await pings.insertOne({ mode, shop, createdAt: new Date() });
  return pings.countDocuments({ shop });
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (isTestToken(request)) {
    const shop = "test-shop.myshopify.com";
    return Response.json({
      ok: true,
      mode: "test",
      shop,
      message: "Authenticated with API_TEST_TOKEN (dummy data)",
      data: { companies: [{ id: "dummy-1", name: "Acme Wholesale" }] },
      pingCount: await logPing("test", shop),
    });
  }

  // Throws a 401/redirect Response if the session token is missing or invalid.
  const { admin, session, cors } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query apiTestShop {
        shop {
          name
          myshopifyDomain
        }
      }`,
  );
  const { data } = await response.json();

  return cors(
    Response.json({
      ok: true,
      mode: "real",
      shop: session.shop,
      message: "Authenticated with a Shopify session token",
      data: { shop: data?.shop },
      pingCount: await logPing("real", session.shop),
    }),
  );
};
