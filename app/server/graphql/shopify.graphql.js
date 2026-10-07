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