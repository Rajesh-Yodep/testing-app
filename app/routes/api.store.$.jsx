import { storeCreateController, storeInfoController, storeUpdateController } from "../server/controllers/store.controller.server";
import { dispatchApiRequest, } from "../server/utils/api-router.server";

//Handle all requests to /api/store/*
const storeHandlers = {
    "GET info": (_request, _admin, shopDomain) => storeInfoController(shopDomain),
    "POST create": (_request, admin, shopDomain) => storeCreateController(admin, shopDomain),
    "PUT update": (request, _admin, shopDomain) => storeUpdateController(request, shopDomain),

};

// Log the request method and URL for debugging purposes
function logRequest(request) {
    console.log(`[API store] ${request.method} ${request.url}`);
}

// Loader and action functions to handle incoming requests
export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], storeHandlers);
};

// Action function to handle POST requests
export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], storeHandlers);
};
