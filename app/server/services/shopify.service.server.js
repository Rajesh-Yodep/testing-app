import { GET_PAYMENT_TERMS_TEMPLATES } from "../graphql/shopify.graphql";

export async function shopifyPaymentTermsSer(admin, shopDomain,) {
     try {
        const response = await admin.graphql(
            GET_PAYMENT_TERMS_TEMPLATES
        );

        const result = await response.json();

        if (result?.errors?.length) {
            console.error(
                `Shopify payment terms GraphQL error for ${shopDomain}:`,
                result.errors
            );

            throw new Error(
                result.errors[0]?.message ||
                "Failed to fetch payment terms."
            );
        }

        const details = result?.data?.paymentTermsTemplates ?? [];

        return details;
    } catch (error) {
        console.error(
            `Failed to get Shopify payment terms for ${shopDomain}:`,
            error
        );

        throw new Error(
            error?.message ||
            "Unable to fetch Shopify payment terms."
        );
    }
}