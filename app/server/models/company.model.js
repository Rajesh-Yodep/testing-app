import mongoose from "mongoose";

export const COMPANY_COLLECTION = "company";

const companySchema = new mongoose.Schema(
    {
        shopifyCompanyId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        mainContactId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Customer",
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
    },
    {
        collection: COMPANY_COLLECTION,
        timestamps: true,
        versionKey: false,
    },
);

export const Company = mongoose.models.Company
    ?? mongoose.model("Company", companySchema);

export default Company;
