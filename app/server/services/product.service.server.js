import {
    PRODUCT_LIST_QUERY,
    PRODUCT_DETAIL_QUERY,
    CREATE_PRODUCT_MUTATION,
    UPDATE_PRODUCT_MUTATION,
    DELETE_PRODUCT_MUTATION,
    ASSIGN_PRODUCT_TO_COLLECTION_MUTATION,
    REMOVE_PRODUCT_FROM_COLLECTION_MUTATION,
} from "../graphql/admin-operations.server";

function normalizeIdList(value) {
    if (!value && value !== 0) return [];
    if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean);
    if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
    return [String(value).trim()].filter(Boolean);
}

function normalizeProductInput(payload = {}) {
    const product = payload.product && typeof payload.product === "object" ? payload.product : payload;
    const sanitized = { ...product };

    const invalidGraphqlKeys = [
        "collectionIds",
        "removeCollectionIds",
        "collections",
        "images",
        "media",
        "options",
        "variants",
        "inventoryQuantity",
        "inventoryPolicy",
        "price",
        "sku",
        "barcode",
    ];

    Object.keys(sanitized).forEach((key) => {
        const value = sanitized[key];
        if (value === undefined || value === null) {
            delete sanitized[key];
            return;
        }

        if (invalidGraphqlKeys.includes(key)) {
            delete sanitized[key];
            return;
        }

        if (typeof value === "string" && value.trim() === "") {
            delete sanitized[key];
        }
    });

    if (Array.isArray(sanitized.tags)) {
        sanitized.tags = sanitized.tags.join(",");
    }

    if (sanitized.published === false && sanitized.status === undefined) {
        sanitized.status = "DRAFT";
    }

    return sanitized;
}

export async function listProductsSer(admin, params = {}) {
    const first = Number(params.first ?? 25);
    const response = await admin.graphql(PRODUCT_LIST_QUERY, {
        variables: {
            first,
            after: params.after || null,
            query: params.query || null,
            sortKey: params.sortKey || "CREATED_AT",
            reverse: Boolean(params.reverse),
        },
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0]?.message || "Shopify product list query failed.");
    }

    return result.data?.products || { edges: [], pageInfo: {} };
}

export async function getProductSer(admin, { id, handle } = {}) {
    if (id) {
        const response = await admin.graphql(PRODUCT_DETAIL_QUERY, {
            variables: { id },
        });

        const result = await response.json();

        if (result.errors?.length) {
            throw new Error(result.errors[0]?.message || "Shopify product detail query failed.");
        }

        return result.data?.product || null;
    }

    if (handle) {
        const data = await listProductsSer(admin, {
            first: 1,
            query: `handle:${handle}`,
        });

        return data?.edges?.[0]?.node || null;
    }

    throw new Error("Product id or handle is required.");
}

export async function createProductSer(admin, input = {}, extra = {}) {
    const product = normalizeProductInput(input);
    const response = await admin.graphql(CREATE_PRODUCT_MUTATION, {
        variables: { product },
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0]?.message || "Shopify product creation failed.");
    }

    const userErrors = result.data?.productCreate?.userErrors || [];
    const productRecord = result.data?.productCreate?.product;

    if (!productRecord) {
        throw new Error("Shopify did not return a product record.");
    }

    const collectionIds = normalizeIdList(extra.collectionIds);
    if (collectionIds.length) {
        await assignProductToCollections(admin, productRecord.id, collectionIds);
    }

    return {
        ...result.data.productCreate,
        userErrors,
    };
}

export async function updateProductSer(admin, productId, input = {}, extra = {}) {
    const product = normalizeProductInput(input);

    if (!productId) {
        throw new Error("Product id is required for update.");
    }

    const response = await admin.graphql(UPDATE_PRODUCT_MUTATION, {
        variables: {
            input: {
                id: productId,
                ...product,
            },
        },
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0]?.message || "Shopify product update failed.");
    }

    const userErrors = result.data?.productUpdate?.userErrors || [];
    const productRecord = result.data?.productUpdate?.product;

    if (extra.collectionIds?.length) {
        await assignProductToCollections(admin, productId, normalizeIdList(extra.collectionIds));
    }

    if (extra.removeCollectionIds?.length) {
        await removeProductFromCollections(admin, productId, normalizeIdList(extra.removeCollectionIds));
    }

    return {
        ...result.data.productUpdate,
        userErrors,
        product: productRecord,
    };
}

export async function deleteProductSer(admin, productId) {
    const response = await admin.graphql(DELETE_PRODUCT_MUTATION, {
        variables: { productId },
    });

    const result = await response.json();

    if (result.errors?.length) {
        throw new Error(result.errors[0]?.message || "Shopify product delete failed.");
    }

    return result.data?.productDelete || { deletedProductId: productId, userErrors: [] };
}

export async function assignProductToCollections(admin, productId, collectionIds) {
    const ids = normalizeIdList(collectionIds);
    const responseList = [];

    for (const collectionId of ids) {
        const response = await admin.graphql(ASSIGN_PRODUCT_TO_COLLECTION_MUTATION, {
            variables: { productId, collectionId },
        });

        const result = await response.json();

        if (result.errors?.length) {
            throw new Error(result.errors[0]?.message || "Shopify collection assignment failed.");
        }

        const userErrors = result.data?.collectionAddProducts?.userErrors || [];
        if (userErrors.length) {
            throw new Error(userErrors[0]?.message || "Shopify rejected the collection assignment.");
        }

        responseList.push(result.data?.collectionAddProducts);
    }

    return responseList;
}

export async function removeProductFromCollections(admin, productId, collectionIds) {
    const ids = normalizeIdList(collectionIds);
    const responseList = [];

    for (const collectionId of ids) {
        const response = await admin.graphql(REMOVE_PRODUCT_FROM_COLLECTION_MUTATION, {
            variables: { productId, collectionId },
        });

        const result = await response.json();

        if (result.errors?.length) {
            throw new Error(result.errors[0]?.message || "Shopify collection removal failed.");
        }

        const userErrors = result.data?.collectionRemoveProducts?.userErrors || [];
        if (userErrors.length) {
            throw new Error(userErrors[0]?.message || "Shopify rejected the collection removal.");
        }

        responseList.push(result.data?.collectionRemoveProducts);
    }

    return responseList;
}

export async function publishProductSer(admin, productId) {
    return updateProductSer(admin, productId, { status: "ACTIVE" });
}

export async function unpublishProductSer(admin, productId) {
    return updateProductSer(admin, productId, { status: "DRAFT" });
}

export async function createProduct(admin, input) {
    return createProductSer(admin, input);
}
