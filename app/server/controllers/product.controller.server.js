import { productModel } from "../models/product.model";
import { createProduct } from "../services/product.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";
export async function productCreateController(request, admin) {
    let body;
    try {
        body = await request.json();
    }
    catch {
        return apiError("Request body must be valid JSON.", 400);
    }
    const input = productModel(body);
    if (!input.title) {
        return apiError("A non-empty product title is required.", 400);
    }
    try {
        const result = await createProduct(admin, input);
        if (!result) {
            return apiError("Shopify did not return a product.", 502);
        }
        if (result.userErrors.length > 0) {
            return apiError("Shopify rejected the product.", 422, result.userErrors);
        }
        if (!result.product) {
            return apiError("Shopify did not return a product.", 502);
        }
        return apiSuccess({ product: result.product }, 201);
    }
    catch {
        return apiError("Shopify product creation failed.", 502);
    }
}
