// Product input for Shopify productCreate
export function productModel(data) {
    return {
        title: String(data?.title ?? "").trim(),
    };
}
