// ---------- GraphQL Queries and Mutations ----------
// Create customer
export const CUSTOMER_CREATE_MUTATION = `#graphql
    mutation CustomerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
            customer {
                id
                firstName
                lastName

                defaultEmailAddress {
                    emailAddress
                }

                defaultPhoneNumber {
                    phoneNumber
                }

                defaultAddress {
                    address1
                    address2
                    city
                    province
                    country
                    countryCodeV2
                    zip
                }
            }

            userErrors {
                field
                message
            }
        }
    }
`;

// Create company
export const COMPANY_CREATE_MUTATION = `#graphql
    mutation companyCreate($input: CompanyCreateInput!) {
        companyCreate(input: $input) {
            company {
                id
                name
                locations(first: 5) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
                contacts(first: 5) {
                    edges {
                        node {
                            id
                            customer {
                                id
                                firstName
                                lastName
                                email
                            }
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }
`;

// Assign main contact to company
export const COMPANY_ASSIGN_MAIN_CONTACT = `#graphql
  mutation companyAssignMainContact($companyId: ID!, $companyContactId: ID!) {
    companyAssignMainContact(companyId: $companyId, companyContactId: $companyContactId) {
      company {
        id
        name
        mainContact {
          id
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Assign customer as company contact
export const COMPANY_ASSIGN_CUSTOMER_AS_CONTACT = `#graphql
  mutation companyAssignCustomerAsContact($companyId: ID!, $customerId: ID!) {
    companyAssignCustomerAsContact(companyId: $companyId, customerId: $customerId) {
      companyContact {
        id
        customer {
          id
          email
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Get company contact roles
export const GET_COMPANY_CONTACT_ROLES = `#graphql
  query getCompanyContactRoles($companyId: ID!) {
    company(id: $companyId) {
      id
      contactRoles(first: 10) {
        edges {
          node {
            id
            name
          }
        }
      }
      locations(first: 5) {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

// Assign role to company contact
export const COMPANY_CONTACT_ASSIGN_ROLE = `#graphql
  mutation companyContactAssignRole(
    $companyContactId: ID!
    $companyContactRoleId: ID!
    $companyLocationId: ID!
  ) {
    companyContactAssignRole(
      companyContactId: $companyContactId
      companyContactRoleId: $companyContactRoleId
      companyLocationId: $companyLocationId
    ) {
      companyContactRoleAssignment {
        id
        role {
          id
          name
        }
        companyLocation {
          id
          name
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Create company location
export const COMPANY_CREATE_LOCATION = `#graphql
    mutation CompanyLocationCreate(
        $companyId: ID!
        $input: CompanyLocationInput!
    ) {
        companyLocationCreate(
            companyId: $companyId
            input: $input
        ) {
            companyLocation {
                id
                name

                shippingAddress {
                    address1
                    address2
                    city
                    province
                    zip
                    countryCode
                }

                buyerExperienceConfiguration {
                    checkoutToDraft

                    paymentTermsTemplate {
                        id
                        name
                        description
                        dueInDays
                        paymentTermsType
                    }

                    deposit {
                        __typename

                        ... on DepositPercentage {
                            percentage
                        }
                    }
                }
            }

            userErrors {
                field
                message
                code
            }
        }
    }
`;