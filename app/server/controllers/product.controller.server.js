import {
    createProductSer,
    listProductsSer,
    getProductSer,
    updateProductSer,
    deleteProductSer,
    assignProductToCollections,
    removeProductFromCollections,
    publishProductSer,
    unpublishProductSer,
} from "../services/product.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";
import { productValidations } from "../validations/product.validation";

function getRequestJson(request) {
    return request.json();
}

function getProductPayload(body) {
    if (!body || typeof body !== "object") {
        throw new Error("Request body must be a JSON object.");
    }

    return body.product && typeof body.product === "object" ? body.product : body;
}

function toIdArray(value) {
    if (!value && value !== 0) return [];
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [String(value).trim()].filter(Boolean);
}

export async function productListController(request, admin) {
    try {
        const url = new URL(request.url);
        const first = Number(url.searchParams.get("first") || 25);
        const after = url.searchParams.get("after") || undefined;
        const query = url.searchParams.get("query") || undefined;
        const sortKey = url.searchParams.get("sortKey") || "CREATED_AT";
        const reverse = url.searchParams.get("reverse") === "true";

        const response = await listProductsSer(admin, {
            first,
            after,
            query,
            sortKey,
            reverse,
        });

        return apiSuccess(response, 200);
    } catch (err) {
        return apiError(err.message || "Unable to fetch products.", 400);
    }
}

export async function productDetailController(request, admin) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || undefined;
        const handle = url.searchParams.get("handle") || undefined;

        if (!id && !handle) {
            return apiError("Product id or handle is required.", 400);
        }

        const response = await getProductSer(admin, { id, handle });
        return apiSuccess(response, 200);
    } catch (err) {
        return apiError(err.message || "Unable to fetch product details.", 400);
    }
}

export async function productCreateController(request, admin) {
    try {
        const body = await getRequestJson(request);
        const payload = getProductPayload(body);

        const { error, value } = productValidations.create.validate(payload, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false,
        });

        if (error) {
            const details = error.details.map(({ message, path }) => ({
                field: path.join("."),
                message,
            }));
            return apiError("Product validation failed.", 400, details);
        }

        const result = await createProductSer(admin, value, {
            collectionIds: toIdArray(body.collectionIds ?? body.collections),
        });

        if (result?.userErrors?.length) {
            return apiError("Shopify rejected the product creation.", 422, result.userErrors);
        }

        return apiSuccess(result, 201);
    } catch (err) {
        return apiError(err.message || "Unable to create product.", 400);
    }
}

export async function productUpdateController(request, admin) {
    try {
        const body = await getRequestJson(request);
        const productId = body.productId || body.id || body.product?.id;

        if (!productId) {
            return apiError("Product id is required for update.", 400);
        }

        const payload = getProductPayload(body);
        const { error, value } = productValidations.update.validate(payload, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false,
        });

        if (error) {
            const details = error.details.map(({ message, path }) => ({
                field: path.join("."),
                message,
            }));
            return apiError("Product validation failed.", 400, details);
        }

        const result = await updateProductSer(admin, productId, value, {
            collectionIds: toIdArray(body.collectionIds ?? body.collections),
            removeCollectionIds: toIdArray(body.removeCollectionIds ?? body.removeCollections),
        });

        if (result?.userErrors?.length) {
            return apiError("Shopify rejected the product update.", 422, result.userErrors);
        }

        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to update product.", 400);
    }
}

export async function productDeleteController(request, admin) {
    try {
        const body = await getRequestJson(request).catch(() => ({}));
        const url = new URL(request.url);
        const productId = body.productId || body.id || url.searchParams.get("id") || undefined;

        if (!productId) {
            return apiError("Product id is required for delete.", 400);
        }

        const result = await deleteProductSer(admin, productId);
        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to delete product.", 400);
    }
}

export async function productAssignCollectionController(request, admin) {
    try {
        const body = await getRequestJson(request);
        const productId = body.productId || body.id || body.product?.id;
        const collectionIds = toIdArray(body.collectionIds ?? body.collections ?? body.collectionId);

        if (!productId || !collectionIds.length) {
            return apiError("Product id and at least one collection id are required.", 400);
        }

        const result = await assignProductToCollections(admin, productId, collectionIds);
        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to assign product to collections.", 400);
    }
}

export async function productRemoveCollectionController(request, admin) {
    try {
        const body = await getRequestJson(request);
        const productId = body.productId || body.id || body.product?.id;
        const collectionIds = toIdArray(body.collectionIds ?? body.collections ?? body.collectionId);

        if (!productId || !collectionIds.length) {
            return apiError("Product id and at least one collection id are required.", 400);
        }

        const result = await removeProductFromCollections(admin, productId, collectionIds);
        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to remove product from collections.", 400);
    }
}

export async function productPublishController(request, admin) {
    try {
        const body = await getRequestJson(request).catch(() => ({}));
        const url = new URL(request.url);
        const productId = body.productId || body.id || url.searchParams.get("id") || undefined;

        if (!productId) {
            return apiError("Product id is required for publish action.", 400);
        }

        const result = await publishProductSer(admin, productId);
        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to publish product.", 400);
    }
}

export async function productUnpublishController(request, admin) {
    try {
        const body = await getRequestJson(request).catch(() => ({}));
        const url = new URL(request.url);
        const productId = body.productId || body.id || url.searchParams.get("id") || undefined;

        if (!productId) {
            return apiError("Product id is required for unpublish action.", 400);
        }

        const result = await unpublishProductSer(admin, productId);
        return apiSuccess(result, 200);
    } catch (err) {
        return apiError(err.message || "Unable to unpublish product.", 400);
    }
}

