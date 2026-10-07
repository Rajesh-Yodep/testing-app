import Joi from "joi";

const productStatus = Joi.string().valid("ACTIVE", "DRAFT", "ARCHIVED");

const productPayloadSchema = Joi.object({
    title: Joi.string().trim().min(1).max(200).optional(),
    handle: Joi.string().trim().min(1).max(255).optional(),
    bodyHtml: Joi.string().allow("").optional(),
    descriptionHtml: Joi.string().allow("").optional(),
    vendor: Joi.string().trim().allow("").optional(),
    productType: Joi.string().trim().allow("").optional(),
    status: productStatus.optional(),
    published: Joi.boolean().optional(),
    tags: Joi.alternatives().try(
        Joi.string().trim(),
        Joi.array().items(Joi.string().trim())
    ).optional(),
    templateSuffix: Joi.string().trim().allow("").optional(),
    publishedAt: Joi.date().iso().allow(null).optional(),
    options: Joi.array().items(Joi.object()).optional(),
    variants: Joi.array().items(Joi.object()).optional(),
    images: Joi.array().items(Joi.object()).optional(),
    media: Joi.array().items(Joi.object()).optional(),
    collectionIds: Joi.forbidden(),
    collections: Joi.forbidden(),
    removeCollectionIds: Joi.forbidden(),
    removeCollections: Joi.forbidden(),
    inventoryQuantity: Joi.forbidden(),
    inventoryPolicy: Joi.forbidden(),
    sku: Joi.forbidden(),
    barcode: Joi.forbidden(),
    price: Joi.forbidden(),
}).unknown(false);

export const productValidations = {
    create: productPayloadSchema.min(1),
    update: productPayloadSchema.keys({
        id: Joi.alternatives().try(
            Joi.string().trim().min(1),
            Joi.number()
        ).optional(),
        productId: Joi.alternatives().try(
            Joi.string().trim().min(1),
            Joi.number()
        ).optional(),
    }).min(1),
};
