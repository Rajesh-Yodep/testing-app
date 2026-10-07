import {
    shopifyPaymentTermsSer,
    shopifyProductListSer,
    shopifyProductDetailSer,
} from "../services/shopify.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";

export async function shopifyPaymentTermsController(request, admin, shopDomain) {
    try {
        const details = await shopifyPaymentTermsSer(admin, shopDomain);
        if (!details) {
            return apiError("Store details not found. Call POST /api/store/create first.", 404);
        }
        return apiSuccess(details);
    }
    catch {
        return apiError("Unable to load store information.", 502);
    }
}

export async function shopifyProductListController(request, admin, shopDomain) {
    try {
        const url = new URL(request.url);
        const first = Number(url.searchParams.get("first") || 25);
        const after = url.searchParams.get("after") || undefined;
        const query = url.searchParams.get("query") || undefined;
        const sortKey = url.searchParams.get("sortKey") || "CREATED_AT";
        const reverse = url.searchParams.get("reverse") === "true";

        const products = await shopifyProductListSer(admin, {
            first,
            after,
            query,
            sortKey,
            reverse,
        }, shopDomain);

        return apiSuccess(products, 200);
    } catch (err) {
        return apiError(err.message || "Unable to fetch Shopify products.", 400);
    }
}

export async function shopifyProductDetailController(request, admin, shopDomain) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || undefined;
        const handle = url.searchParams.get("handle") || undefined;

        if (!id && !handle) {
            return apiError("Product id or handle is required.", 400);
        }

        const product = await shopifyProductDetailSer(admin, { id, handle }, shopDomain);
        return apiSuccess(product, 200);
    } catch (err) {
        return apiError(err.message || "Unable to fetch Shopify product details.", 400);
    }
}