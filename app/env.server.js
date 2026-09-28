import { existsSync } from "node:fs";
// In dev, load .env ourselves so custom vars (such as MONGODB_URI) are available
// to server code. Vars already set by the Shopify CLI or the host win.
if (process.env.NODE_ENV !== "production" && existsSync(".env")) {
    process.loadEnvFile(".env");
}
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
export const env = {
    NODE_ENV: process.env.NODE_ENV ?? "development",
    isProduction: process.env.NODE_ENV === "production",
    // Shopify (injected by `shopify app dev`; set manually in production)
    SHOPIFY_API_KEY: process.env.SHOPIFY_API_KEY ?? "",
    SHOPIFY_API_SECRET: process.env.SHOPIFY_API_SECRET ?? "",
    SHOPIFY_APP_URL: process.env.SHOPIFY_APP_URL ?? "",
    SCOPES: process.env.SCOPES,
    SHOP_CUSTOM_DOMAIN: process.env.SHOP_CUSTOM_DOMAIN,
    // MongoDB
    MONGODB_URI: required("MONGODB_URI"),
    MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "b2b_register_app",
    // Development-only token for external API clients such as Postman.
    API_TEST_TOKEN: process.env.API_TEST_TOKEN ?? "",
};
