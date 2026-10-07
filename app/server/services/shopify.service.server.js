import {
    GET_PAYMENT_TERMS_TEMPLATES,
    PRODUCT_LIST_QUERY,
    PRODUCT_DETAIL_QUERY,
} from "../graphql/shopify.graphql";

export async function shopifyPaymentTermsSer(admin, shopDomain) {
    try {
        const response = await admin.graphql(GET_PAYMENT_TERMS_TEMPLATES);

        const result = await response.json();

        if (result?.errors?.length) {
            console.error(`Shopify payment terms GraphQL error for ${shopDomain}:`, result.errors);
            throw new Error(result.errors[0]?.message || "Failed to fetch payment terms.");
        }

        return result?.data?.paymentTermsTemplates ?? [];
    } catch (error) {
        console.error(`Failed to get Shopify payment terms for ${shopDomain}:`, error);
        throw new Error(error?.message || "Unable to fetch Shopify payment terms.");
    }
}

export async function shopifyProductListSer(admin, params = {}, shopDomain) {
    try {
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

        if (result?.errors?.length) {
            console.error(`Shopify product list query error for ${shopDomain}:`, result.errors);
            throw new Error(result.errors[0]?.message || "Failed to fetch Shopify products.");
        }

        return result?.data?.products ?? { edges: [], pageInfo: {} };
    } catch (error) {
        console.error(`Failed to fetch Shopify products for ${shopDomain}:`, error);
        throw new Error(error?.message || "Unable to fetch Shopify products.");
    }
}

export async function shopifyProductDetailSer(admin, { id, handle } = {}, shopDomain) {
    try {
        if (id) {
            const response = await admin.graphql(PRODUCT_DETAIL_QUERY, {
                variables: { id },
            });

            const result = await response.json();

            if (result?.errors?.length) {
                console.error(`Shopify product detail query error for ${shopDomain}:`, result.errors);
                throw new Error(result.errors[0]?.message || "Failed to fetch Shopify product detail.");
            }

            return result?.data?.product ?? null;
        }

        if (handle) {
            const products = await shopifyProductListSer(admin, {
                first: 1,
                query: `handle:${handle}`,
            }, shopDomain);
            return products?.edges?.[0]?.node || null;
        }

        throw new Error("Product id or handle is required.");
    } catch (error) {
        console.error(`Failed to fetch Shopify product detail for ${shopDomain}:`, error);
        throw new Error(error?.message || "Unable to fetch Shopify product detail.");
    }
}