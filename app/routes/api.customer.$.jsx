import { customerCreateController, userCreateController, salesrepCreateController } from "../server/controllers/customer.controller.server";
import { dispatchApiRequest, } from "../server/utils/api-router.server";

//Handle all requests to /api/customer/*
const customerHandlers = {
    "POST create": (request, admin, shopDomain) => customerCreateController(request, admin, shopDomain),
    "POST user-create": (request, admin, shopDomain) => userCreateController(request, admin, shopDomain),
    "POST salesrep-create": (request, admin, shopDomain) => salesrepCreateController(request, admin, shopDomain),
};

// Log the request method and URL for debugging purposes
function logRequest(request) {
    console.log(`[API customer] ${request.method} ${request.url}`);
}

// Loader and action functions to handle incoming requests
export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], customerHandlers);
};

// Action function to handle POST requests
export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], customerHandlers);
};
