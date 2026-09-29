import { getStoreInfo, syncStoreDetails, updateStoreInfo } from "../services/store.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";

// Store information controller to handle GET requests for store details
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

// Store creation controller to handle POST requests for syncing store details
export async function storeCreateController(admin, shopDomain) {
    try {
        return apiSuccess(await syncStoreDetails(admin, shopDomain), 201);
    }
    catch {
        return apiError("Unable to sync store details from Shopify.", 502);
    }
}

// Store update controller to handle PUT requests for updating store details
export async function storeUpdateController(request, shopDomain) {
    try {
        const data = await request.json();
        const result = await updateStoreInfo(shopDomain, data);
        if (!result) {
            return apiError("Store details not found. Call POST /api/store/create first.", 404);
        }
        return apiSuccess(result, 200);
    } catch (error) {
        console.error("Store update error:", error);
        if (error instanceof SyntaxError) {
            return apiError("Request body must be valid JSON.", 400);
        }
        return apiError("Unable to update store details.", 500);
    }
}
