export const STORE_DETAILS_QUERY = `#graphql
  query StoreDetails {
    shop {      
      alerts {
        description
        action {
          title
          url
        }
      }
      shopAddress {
        address1
        address2
        city
        company
        country
        countryCodeV2
        latitude
        longitude
        phone
        province
        provinceCode
        zip
      }
      checkoutApiSupported
      contactEmail
      createdAt
      currencyCode
      currencyFormats {
        moneyFormat
        moneyInEmailsFormat
        moneyWithCurrencyFormat
        moneyWithCurrencyInEmailsFormat
      }
      customerAccounts
      description
      email
      enabledPresentmentCurrencies
      fulfillmentServices {
        handle
        serviceName
      }
      ianaTimezone
      id
      marketingSmsConsentEnabledAtCheckout
      myshopifyDomain
      name
      paymentSettings {
        supportedDigitalWallets
      }
      plan {
        publicDisplayName
        partnerDevelopment
        shopifyPlus
      }
      primaryDomain {
        host
        id
      }
      setupRequired
      shipsToCountries
      taxesIncluded
      taxShipping
      timezoneAbbreviation
      transactionalSmsDisabled
      updatedAt
      url
      weightUnit
    }
  }
`;

export const STORE_APP_SUBSCRIPTIONS_QUERY = `#graphql
  query StoreAppSubscriptions {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        status
        createdAt
        currentPeriodEnd
        test
        trialDays
        lineItems {
          id
          plan {
            pricingDetails {
              __typename
              ... on AppRecurringPricing {
                interval
                planHandle
                price {
                  amount
                  currencyCode
                }
              }
              ... on AppUsagePricing {
                interval
                terms
                cappedAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const CREATE_PRODUCT_MUTATION = `#graphql
  mutation CreateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        title
        handle
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;


export const DEMO_POPULATE_PRODUCT_MUTATION = `#graphql
  mutation populateProduct($product: ProductCreateInput!) {
    productCreate(product: $product) {
      product {
        id
        title
        handle
        status
        variants(first: 10) {
          edges {
            node {
              id
              price
              barcode
              createdAt
            }
          }
        }
        demoInfo: metafield(namespace: "$app", key: "demo_info") {
          jsonValue
        }
      }
    }
  }
`;
export const UPDATE_PRODUCT_VARIANTS_MUTATION = `#graphql
  mutation shopifyReactRouterTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
    productVariantsBulkUpdate(productId: $productId, variants: $variants) {
      productVariants {
        id
        price
        barcode
        createdAt
      }
    }
  }
`;
export const UPSERT_DEMO_METAOBJECT_MUTATION = `#graphql
  mutation shopifyReactRouterTemplateUpsertMetaobject($handle: MetaobjectHandleInput!, $values: JSON!) {
    metaobjectUpsert(handle: $handle, values: $values) {
      metaobject {
        id
        handle
        values
      }
      userErrors {
        field
        message
      }
    }
  }
`;
