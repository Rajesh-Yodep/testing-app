import mongoose from "mongoose";

export const STORE_DETAIL_COLLECTION = "store_detail";

const storeDetailSchema = new mongoose.Schema(
    {
        shopDomain: {
            type: String,
            required: true,
            unique: true,
        },
        shop: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        appPlan: {
            type: mongoose.Schema.Types.Mixed,
            default: () => ({}),
        },
        onbording: {
            type: Boolean,
            default: false,
        },
        syncedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        collection: STORE_DETAIL_COLLECTION,
        timestamps: true,
        versionKey: false,
    },
);

export const StoreDetail = mongoose.models.StoreDetail
    ?? mongoose.model("StoreDetail", storeDetailSchema);

export default StoreDetail;
