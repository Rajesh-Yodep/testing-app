import { getStoreInfo, syncStoreDetails } from "../services/store.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";
export async function storeInfoController(shopDomain) {
    try {
        const details = await getStoreInfo(shopDomain);
        if (!details) {
            return apiError("Store details not found. Call POST /api/store/create first.", 404);
        }
        return apiSuccess(details);
    }
    catch {
        return apiError("Unable to load store information.", 502);
    }
}
export async function storeCreateController(admin, shopDomain) {
    try {
        return apiSuccess(await syncStoreDetails(admin, shopDomain), 201);
    }
    catch {
        return apiError("Unable to sync store details from Shopify.", 502);
    }
}
