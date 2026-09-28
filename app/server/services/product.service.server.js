import { CREATE_PRODUCT_MUTATION } from "../graphql/admin-operations.server";
export async function createProduct(admin, input) {
    const response = await admin.graphql(CREATE_PRODUCT_MUTATION, {
        variables: { product: input },
    });
    const result = (await response.json());
    if (result.errors?.length || !result.data?.productCreate) {
        throw new Error("Shopify product creation failed.");
    }
    return result.data.productCreate;
}
