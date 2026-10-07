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

export const PRODUCT_LIST_QUERY = `#graphql
  query ProductList($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          title
          handle
          vendor
          productType
          status
          publishedAt
          createdAt
          updatedAt
          tags
          totalInventory
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                inventoryQuantity
                inventoryPolicy
                availableForSale
                price
              }
            }
          }
        }
      }
    }
  }
`;

export const PRODUCT_DETAIL_QUERY = `#graphql
  query ProductDetail($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      bodyHtml
      descriptionHtml
      vendor
      productType
      status
      publishedAt
      tags
      templateSuffix
      createdAt
      updatedAt
      options {
        id
        name
        values
      }
      images(first: 20) {
        edges {
          node {
            id
            url
            altText
          }
        }
      }
      media(first: 20) {
        edges {
          node {
            ... on MediaImage {
              id
              alt
              image {
                url
                altText
              }
            }
            ... on Video {
              id
              sources {
                url
                format
                mimeType
              }
            }
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            sku
            barcode
            price
            inventoryQuantity
            inventoryItem {
              id
            }
            inventoryPolicy
            availableForSale
          }
        }
      }
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
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
        vendor
        productType
        status
        publishedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `#graphql
  mutation UpdateProduct($input: ProductInput!) {
    productUpdate(input: $input) {
      product {
        id
        title
        handle
        vendor
        productType
        status
        publishedAt
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `#graphql
  mutation DeleteProduct($productId: ID!) {
    productDelete(input: { id: $productId }) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }
`;

export const ASSIGN_PRODUCT_TO_COLLECTION_MUTATION = `#graphql
  mutation AssignProductToCollection($productId: ID!, $collectionId: ID!) {
    collectionAddProducts(id: $collectionId, productIds: [$productId]) {
      collection {
        id
        title
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export const REMOVE_PRODUCT_FROM_COLLECTION_MUTATION = `#graphql
  mutation RemoveProductFromCollection($productId: ID!, $collectionId: ID!) {
    collectionRemoveProducts(id: $collectionId, productIds: [$productId]) {
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
