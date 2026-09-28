import { productCreateController } from "../server/controllers/product.controller.server";
import { dispatchApiRequest, } from "../server/utils/api-router.server";
const productHandlers = {
    "POST create": (request, admin) => productCreateController(request, admin),
};
function logRequest(request) {
    console.log(`[API product] ${request.method} ${request.url}`);
}
export const loader = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], productHandlers);
};
export const action = ({ request, params }) => {
    logRequest(request);
    return dispatchApiRequest(request, params["*"], productHandlers);
};
