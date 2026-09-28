import { timingSafeEqual } from "node:crypto";
import { apiError } from "./api-response.server";
import { env } from "../../env.server";
import { authenticate, unauthenticated } from "../../shopify.server";
function normalizeShopDomain(value) {
    try {
        const input = value.trim().toLowerCase();
        const url = new URL(input.includes("://") ? input : `https://${input}`);
        return url.hostname || null;
    }
    catch {
        return null;
    }
}
function hasDevelopmentApiToken(request) {
    if (env.isProduction || !env.API_TEST_TOKEN)
        return false;
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
    if (!token)
        return false;
    const supplied = Buffer.from(token);
    const expected = Buffer.from(env.API_TEST_TOKEN);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
export async function dispatchApiRequest(request, path, handlers) {
    const normalizedPath = path?.replace(/^\/+|\/+$/g, "") ?? "";
    const handler = handlers[`${request.method.toUpperCase()} ${normalizedPath}`];
    if (!handler) {
        return apiError("API endpoint not found.", 404);
    }
    const requestedShop = new URL(request.url).searchParams.get("shop");
    const normalizedShop = requestedShop ? normalizeShopDomain(requestedShop) : null;
    if (!normalizedShop) {
        const message = "A valid shop query parameter is required.";
        if (hasDevelopmentApiToken(request))
            return apiError(message, 400);
        const { cors } = await authenticate.admin(request);
        return cors(apiError(message, 400));
    }
    if (hasDevelopmentApiToken(request)) {
        try {
            const { admin, session } = await unauthenticated.admin(normalizedShop);
            if (normalizeShopDomain(session.shop) !== normalizedShop) {
                return apiError("The shop does not match the stored Shopify session.", 403);
            }
            return handler(request, admin, session.shop);
        }
        catch {
            return apiError("No installed Shopify session found for this store.", 401);
        }
    }
    const { admin, cors, session } = await authenticate.admin(request);
    if (normalizeShopDomain(session.shop) !== normalizedShop) {
        return cors(apiError("The shop does not match the authenticated store.", 403));
    }
    return cors(await handler(request, admin, session.shop));
}
