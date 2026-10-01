import { shopifyPaymentTermsSer } from "../services/shopify.service.server";
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