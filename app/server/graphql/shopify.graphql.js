// Payment Terms Templates GraphQL Query
export const GET_PAYMENT_TERMS_TEMPLATES = `#graphql
    query GetPaymentTermsTemplates {
        paymentTermsTemplates {
            id
            name
            paymentTermsType
            dueInDays
            description
            translatedName
        }
    }
`;