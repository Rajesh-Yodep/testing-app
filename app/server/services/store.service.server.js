import { getDb } from "../../db.server";
import { STORE_APP_SUBSCRIPTIONS_QUERY, STORE_DETAILS_QUERY, } from "../graphql/admin-operations.server";
export async function getStoreInfo(shopDomain) {
    return getDb()
        .collection("store_detail")
        .findOne({ _id: shopDomain });
}

// Sync store details from Shopify and update the database
export async function syncStoreDetails(admin, shopDomain) {
    const [shopResponse, appPlanResponse] = await Promise.all([
        admin.graphql(STORE_DETAILS_QUERY),
        admin.graphql(STORE_APP_SUBSCRIPTIONS_QUERY).catch(() => null),
    ]);
    
    const shopResult = (await shopResponse.json());
    if (!shopResult.data?.shop) {
        throw new Error("Unable to load Shopify store details.");
    }
    let appPlan = {
        available: false,
        subscriptions: [],
        errors: ["App subscription details are unavailable."],
    };
    if (appPlanResponse) {
        const appPlanResult = (await appPlanResponse.json());
        const installation = appPlanResult.data?.currentAppInstallation;
        appPlan = {
            available: Boolean(installation),
            subscriptions: installation?.activeSubscriptions ?? [],
            errors: appPlanResult.errors?.map(({ message }) => message) ?? [],
        };
    }
    const details = {
        _id: shopDomain,
        shopDomain,
        shop: shopResult.data.shop,
        appPlan,
        syncedAt: new Date(),
    };
    await getDb()
        .collection("store_detail")
        .updateOne({ _id: shopDomain }, {
        $set: {
            shopDomain: details.shopDomain,
            shop: details.shop,
            appPlan: details.appPlan,
            syncedAt: details.syncedAt,
        },
    }, { upsert: true });
    return details;
}
