import mongoose from "mongoose";

export const CUSTOMER_COLLECTION = "customer";

const customerSchema = new mongoose.Schema(
    {
        shopifyCustomerId: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,  
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address1: {
            type: String,
            required: true,
        },
        address2: {
            type: String,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["main", "user", "sales", "wholesaler", "staff"],
            default: "user",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        shopId : {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            ref: "StoreDetail",
        },
        paymentTerms: {
            type: String,
            default: null,
        },
        paymentTermsTemplateId: {
            type: String,
            default: null,
        },
        depositPercentage: {        
            type: Number,
            default: 0,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },        
    },
    {
        collection: CUSTOMER_COLLECTION,
        timestamps: true,
        versionKey: false,
    },
);

export const Customer = mongoose.models.Customer
    ?? mongoose.model("Customer", customerSchema);

export default Customer;
