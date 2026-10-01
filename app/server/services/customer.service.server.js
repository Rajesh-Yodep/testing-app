import { connectDb } from "../../db.server";
import { Customer } from "../models/customer.model";
import { Company } from "../models/company.model";
import {
    CUSTOMER_CREATE_MUTATION,
    COMPANY_CREATE_MUTATION,
    COMPANY_ASSIGN_CUSTOMER_AS_CONTACT,
    COMPANY_ASSIGN_MAIN_CONTACT,
    GET_COMPANY_CONTACT_ROLES,
    COMPANY_CONTACT_ASSIGN_ROLE,
    COMPANY_CREATE_LOCATION
} from "../graphql/customer.graphql";
import countries from "../utils/extra/stdcode.json" with { type: "json" };

//Helper function to get phone number with country code
function getPhoneWithCode(countryCode, phone) {
    const country = countries.find(
        (c) => c.code === countryCode?.trim().toUpperCase()
    );
    if (!country) {
        throw new Error(`Invalid country code: ${countryCode}`);
    }
    return `+${country.dial_code.replace(/-/g, "")}${String(phone).trim()}`;
}

// Helper function to build shipping address object
function buildShippingAddress(data) {
    const address = {
        address1: data.address1.trim(),
        city: data.city.trim(),
        zoneCode: data.state.trim(),
        zip: String(data.zip).trim(),
        countryCode: data.countryCode.trim().toUpperCase(),
    };
    if (data.address2?.trim()) {
        address.address2 = data.address2.trim();
    }
    return address;
}

//Duplicate check functions
export async function checkCustomerDuplicate(email, phoneWithCode) {
    const existingByEmail = await Customer.findOne({ email });
    if (existingByEmail) {
        throw new Error("Customer with this email already exists.");
    }

    const existingByPhone = await Customer.findOne({ phone: phoneWithCode });
    if (existingByPhone) {
        throw new Error("Customer with this phone number already exists.");
    }
}

//check company duplicate function
export async function checkCompanyDuplicate(companyName, shopDomain) {
    const existing = await Company.findOne({
        name: companyName.trim(),
        shopId: shopDomain,
    });
    if (existing) {
        throw new Error("Company with this name already exists.");
    }
}

//Shopify create company
export async function createShopifyCompany(admin, data) {
    const shippingAddress = buildShippingAddress(data);

    const response = await admin.graphql(COMPANY_CREATE_MUTATION, {
        variables: {
            input: {
                company: {
                    name: data.companyName.trim(),
                },
                companyLocation: {
                    name: "Main Location",
                    shippingAddress,
                    billingSameAsShipping: true,
                },
            },
        },
    });

    const result = await response.json();

    if (result?.data?.companyCreate?.userErrors?.length > 0) {
        console.log(result.data.companyCreate.userErrors);
        throw new Error(
            result.data.companyCreate.userErrors[0]?.message ||
                "Shopify company mutation failed."
        );
    }

    const company = result.data?.companyCreate?.company;
    if (!company) {
        throw new Error("Shopify did not return a company result.");
    }

    return company;
}

//shopify create customer
export async function createShopifyCustomer(admin, data, phoneWithCode) {
    const email = data.email.trim();

    const response = await admin.graphql(CUSTOMER_CREATE_MUTATION, {
        variables: {
            input: {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                email,
                phone: phoneWithCode,
                addresses: [
                    {
                        address1: data.address1.trim(),
                        address2: data.address2?.trim() || undefined,
                        city: data.city.trim(),
                        province: data.state.trim(),
                        countryCode: data.countryCode,
                        zip: String(data.zip),
                        firstName: data.firstName.trim(),
                        lastName: data.lastName.trim(),
                        phone: phoneWithCode,
                    },
                ],
            },
        },
    });

    const result = await response.json();

    if (result?.data?.customerCreate?.userErrors?.length > 0) {
        console.log(result.data.customerCreate.userErrors);
        throw new Error(
            result.data.customerCreate.userErrors[0]?.message ||
                "Shopify customer mutation failed."
        );
    }

    const customer = result.data?.customerCreate?.customer;
    if (!customer) {
        throw new Error("Shopify did not return a customer result.");
    }

    return customer;
}

//shopify assign customer as company contact
export async function assignCustomerAsContact(admin, companyId, customerId) {
    const response = await admin.graphql(COMPANY_ASSIGN_CUSTOMER_AS_CONTACT, {
        variables: { companyId, customerId },
    });

    const result = await response.json();

    if (result?.data?.companyAssignCustomerAsContact?.userErrors?.length > 0) {
        console.log(result.data.companyAssignCustomerAsContact.userErrors);
        throw new Error(
            result.data.companyAssignCustomerAsContact.userErrors[0]?.message ||
                "Failed to assign customer as company contact."
        );
    }

    return result.data.companyAssignCustomerAsContact.companyContact.id;
}

//Company contact main role assignment functions
export async function setMainContact(admin, companyId, companyContactId) {
    const response = await admin.graphql(COMPANY_ASSIGN_MAIN_CONTACT, {
        variables: { companyId, companyContactId },
    });

    const result = await response.json();

    if (result?.data?.companyAssignMainContact?.userErrors?.length > 0) {
        console.log(result.data.companyAssignMainContact.userErrors);
        console.warn("Failed to set main contact, but contact is assigned.");
        return false;
    }

    return true;
}

//assign ordering role to company contact
export async function assignOrderingRole(admin, companyId, companyContactId, companyLocationId) {
    // Get location + roles
    const rolesRes = await admin.graphql(GET_COMPANY_CONTACT_ROLES, {
        variables: { companyId },
    });
    const rolesJson = await rolesRes.json();

    if(!companyLocationId) {
        companyLocationId =
            rolesJson?.data?.company?.locations?.edges?.[0]?.node?.id;
    }
    const roles = rolesJson?.data?.company?.contactRoles?.edges || [];

    const orderingRole =
        roles.find((r) => r.node.name.toLowerCase().includes("ordering")) ||
        roles.find((r) => r.node.name.toLowerCase().includes("admin")) ||
        roles[0];

    if (!companyLocationId || !orderingRole) {
        throw new Error("Company location or contact role not found.");
    }

    const response = await admin.graphql(COMPANY_CONTACT_ASSIGN_ROLE, {
        variables: {
            companyContactId,
            companyContactRoleId: orderingRole.node.id,
            companyLocationId: companyLocationId,
        },
    });

    const result = await response.json();

    if (result?.data?.companyContactAssignRole?.userErrors?.length > 0) {
        console.log(result.data.companyContactAssignRole.userErrors);
        throw new Error(
            result.data.companyContactAssignRole.userErrors[0]?.message ||
                "Failed to assign ordering permission."
        );
    }

    return {
        locationId: companyLocationId,
        roleId: orderingRole.node.id,
        roleName: orderingRole.node.name,
    };
}

//Save customer and company to MongoDB
export async function saveCustomerToDb(customerResult, data, phoneWithCode, shopDomain, companyId) {
    const address = customerResult.defaultAddress;
    const email = data.email.trim();

    return Customer.create({
        shopifyCustomerId: customerResult.id,
        firstName: customerResult.firstName,
        lastName: customerResult.lastName,
        email: customerResult.defaultEmailAddress?.emailAddress ?? email,
        phone: customerResult.defaultPhoneNumber?.phoneNumber ?? phoneWithCode,
        address1: address?.address1 ?? data.address1,
        address2: address?.address2 ?? data.address2,
        city: address?.city ?? data.city,
        state: address?.province ?? data.state,
        country: address?.country ?? data.countryCode,
        zip: address?.zip ?? String(data.zip),
        role: data.role,
        status: data.status || "active",
        shopId: shopDomain,
        companyId: companyId || null,
        createdBy: data.createdBy || null,
    });
}

// Save company to MongoDB
export async function saveCompanyToDb(companyResult, customerMongoId, shopDomain) {
    return Company.create({
        shopifyCompanyId: companyResult.id,
        name: companyResult.name,
        mainContactId: customerMongoId,
        status: "active",
        shopId: shopDomain,
    });
}

// Main service function to create customer and company
export async function customerCreateSer(admin, shopDomain, data) {
    await connectDb();

    const phoneWithCode = getPhoneWithCode(data.countryCode, data.phone);
    const email = data.email.trim();

    // 1. Duplicate checks
    await checkCustomerDuplicate(email, phoneWithCode);
    await checkCompanyDuplicate(data.companyName, shopDomain);

    // 2. Create company in Shopify
    const companyResult = await createShopifyCompany(admin, data);
    const companyId = companyResult.id;

    // 3. Create customer in Shopify
    const customerResult = await createShopifyCustomer(admin, data, phoneWithCode);

    // 4. Save customer in MongoDB
    const customer = await saveCustomerToDb(
        customerResult,
        data,
        phoneWithCode,
        shopDomain,
        null
    );

    // 5. Assign as contact
    const companyContactId = await assignCustomerAsContact(
        admin,
        companyId,
        customerResult.id
    );

    // 6. Set main contact
    await setMainContact(admin, companyId, companyContactId);

    // 7. Assign ordering role on location
    await assignOrderingRole(admin, companyId, companyContactId, null);

    // 8. Save company in MongoDB
    const company = await saveCompanyToDb(
        companyResult,
        customer._id,
        shopDomain
    );

    return {
        customer: customer.toObject(),
        company: company.toObject(),
        companyContactId,
        userErrors: [],
    };
}

export async function userCreateSer(admin, shopDomain, data) {
    await connectDb();

    const phoneWithCode = getPhoneWithCode(data.countryCode, data.phone);
    const email = data.email.trim();

    // 1. Duplicate checks
    await checkCustomerDuplicate(email, phoneWithCode);

    let company;
    if (data.companyId) {
        company = await Company.findById(data.companyId);
    }

    if (!company) {
        throw new Error("Company not found for the provided companyId.");
    }

    // 2. Create customer in Shopify
    const customerResult = await createShopifyCustomer(admin, data, phoneWithCode);

    // 5. Assign as contact
    const companyContactId = await assignCustomerAsContact(
        admin,
        company.shopifyCompanyId,
        customerResult.id
    );

    const customerLocation = await userLocationCreate(admin, data, company.shopifyCompanyId);

    await assignOrderingRole(admin, company.shopifyCompanyId, companyContactId, customerLocation.id);

    // 4. Save customer in MongoDB
    const customer = await saveCustomerToDb(
        customerResult,
        data,
        phoneWithCode,
        shopDomain,
        company._id
    );

    console.log("userCreateSer customer →", customer.toObject());

    return {
        customer: customer.toObject(),
        userErrors: [],
    };
}

export async function userLocationCreate(admin, data, companyId) {
    const response = await admin.graphql(COMPANY_CREATE_LOCATION, {
        variables: {
            companyId: companyId,
            input: {
                name: data.firstName.trim() + " " + data.lastName.trim() + " Location",
                shippingAddress: {
                    address1: data.address1.trim(),
                    address2: data.address2?.trim() || undefined,
                    city: data.city.trim(),
                    zoneCode: data.state.trim(),
                    countryCode: data.countryCode,
                    zip: String(data.zip),
                }
            }
        }
    });

    const result = await response.json();

    if (result?.data?.companyLocationCreate?.userErrors?.length > 0) {
        console.log(result.data.companyLocationCreate.userErrors);
        throw new Error(
            result.data.companyLocationCreate.userErrors[0]?.message ||
                "Shopify company location mutation failed."
        );
    }
    const location = result.data?.companyLocationCreate?.companyLocation;
    if (!location) {
        throw new Error("Shopify did not return a company location result.");
    }
    return location;
}