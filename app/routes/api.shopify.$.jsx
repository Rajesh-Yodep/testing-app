import { shopifyPaymentTermsController } from "../server/controllers/shopify.controller.server";
import { dispatchApiRequest, } from "../server/utils/api-router.server";

//Handle all requests to /api/customer/*
const shopifyHandlers = {
    "GET payment-terms": (request, admin, shopDomain) => shopifyPaymentTermsController(request, admin, shopDomain),
};

// Log the request method and URL for debugging purposes
function logRequest(request) {
    console.log(`[API shopify] ${request.method} ${request.url}`);
}

// Loader and action functions to handle incoming requests
export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], shopifyHandlers);
};

// Action function to handle POST requests
export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], shopifyHandlers);
};
