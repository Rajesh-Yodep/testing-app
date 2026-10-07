import { customerCreateSer, userCreateSer } from "../services/customer.service.server";
import { apiError, apiSuccess } from "../utils/api-response.server";
import { customerValidations, userValidations, salesRepValidations } from "../validations/customer.validation";

export async function customerCreateController(request, admin, shopDomain) {
    try {
        let data;
        try {
            data = await request.json();
        } catch {
            return apiError("Request body must be valid JSON.", 400);
        }

        const { error, value } = customerValidations.create.validate(data, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false,
        });

        if (error) {
            const details = error.details.map(({ message, path }) => ({
                field: path.join("."),
                message,
            }));
            return apiError("Customer validation failed.", 400, details);
        }        

        const countryCode = (value.countryCode ?? value.country)?.toUpperCase();

        if (!countryCode) {
            return apiError("Country code is required.", 400);
        }

        const result = await customerCreateSer(admin, shopDomain, {
            ...value,
            countryCode,
        });

        if (result.userErrors?.length) {
            return apiError("Shopify rejected the customer.", 422, result.userErrors);
        }

        return apiSuccess(result, 201);

    } catch (err) {
        console.error("Customer Create Error →", err.message);
        return apiError(err.message || "Unable to create customer in Shopify and MongoDB.", 502);
    }
}

//userCreateController
export async function userCreateController(request, admin, shopDomain) {
    try {
        let data;
        try {
            data = await request.json();
        } catch {
            return apiError("Request body must be valid JSON.", 400);
        }

        const { error, value } = userValidations.create.validate(data, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false,
        });

        if (error) {
            const details = error.details.map(({ message, path }) => ({
                field: path.join("."),
                message,
            }));
            return apiError("User validation failed.", 400, details);
        }

        const countryCode = (value.countryCode ?? value.country)?.toUpperCase();

        if (!countryCode) {
            return apiError("Country code is required.", 400);
        }
        
        const result = await userCreateSer(admin, shopDomain, {
            ...value,
            countryCode,
        });

        if (result.userErrors?.length) {
            return apiError("Shopify rejected the customer.", 422, result.userErrors);
        }

        return apiSuccess(result, 201);

    } catch (err) {
        console.error("Customer Create Error →", err.message);
        return apiError(err.message || "Unable to create customer in Shopify and MongoDB.", 502);
    }
}

export async function salesrepCreateController(request, admin, shopDomain) {
    let data;
    try {
        data = await request.json();

        const { error, value } = salesRepValidations.create.validate(data, {
            abortEarly: false,
            stripUnknown: false,
            allowUnknown: false,
        });

        if (error) {
            const details = error.details.map(({ message, path }) => ({
                field: path.join("."),
                message,
            }));
            return apiError("User validation failed.", 400, details);
        }


    } catch {
        return apiError("Request body must be valid JSON.", 400);
    }
}