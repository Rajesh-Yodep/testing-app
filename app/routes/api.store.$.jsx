import { storeCreateController, storeInfoController, } from "../server/controllers/store.controller.server";
import { dispatchApiRequest, } from "../server/utils/api-router.server";
const storeHandlers = {
    "GET info": (_request, _admin, shopDomain) => storeInfoController(shopDomain),
    "POST create": (_request, admin, shopDomain) => storeCreateController(admin, shopDomain),
};
function logRequest(request) {
    console.log(`[API store] ${request.method} ${request.url}`);
}
export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], storeHandlers);
};
export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], storeHandlers);
};
