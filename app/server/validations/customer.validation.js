import Joi from "joi";
const objectId = Joi.string().trim().pattern(/^[0-9a-fA-F]{24}$/);

export const customerValidations = {
    create: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        phone: Joi.number().min(1000000000).max(9999999999).required(),
        address1: Joi.string().trim().required(),
        address2: Joi.string().trim().allow("").optional(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        countryCode: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        zip: Joi.number().required(),
        role: Joi.string().valid("main", "user", "sales", "wholesaler", "staff").optional(),
        status: Joi.string().valid("active", "inactive").optional(),
        companyName: Joi.string().trim().required(),
    }).or("country", "countryCode"),
};

export const userValidations = {
    create: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        phone: Joi.number().min(1000000000).max(9999999999).required(),
        address1: Joi.string().trim().required(),
        address2: Joi.string().trim().allow("").optional(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        countryCode: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        zip: Joi.number().required(),
        role: Joi.string().valid("main", "user", "sales", "wholesaler", "staff").optional(),
        status: Joi.string().valid("active", "inactive").optional(),
        companyId: objectId.required(),
        createdBy : objectId.required(),
        paymentTerms: Joi.string().allow(null).optional(),
        paymentTermsId: Joi.string().allow(null).optional(),
        deposit: Joi.number().min(0).max(100).optional(),
    }).or("country", "countryCode"),
};

export const salesRepValidations = {
    create: Joi.object({
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        email: Joi.string().trim().email().required(),
        phone: Joi.number().min(1000000000).max(9999999999).required(),
        address1: Joi.string().trim().required(),
        address2: Joi.string().trim().allow("").optional(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        countryCode: Joi.string().trim().pattern(/^[A-Za-z]{2}$/).optional(),
        zip: Joi.number().required(),
        role: Joi.string().valid("main", "user", "sales", "wholesaler", "staff").optional(),
        status: Joi.string().valid("active", "inactive").optional(),
        companyId: objectId.required(),
        createdBy : objectId.required(),
        paymentTerms: Joi.string().allow(null).optional(),
        paymentTermsId: Joi.string().allow(null).optional(),
        deposit: Joi.number().min(0).max(100).optional(),
    }).or("country", "countryCode"),
};